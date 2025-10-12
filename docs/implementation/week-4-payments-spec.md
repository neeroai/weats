# Week 4: Payments + Launch Technical Specification

**Week**: 4 of 4 (Feb 1-8, 2025)
**Goal**: Stripe payments operational + 50 restaurants + 20 workers + 500 customers launched
**Estimated Hours**: 55h
**Primary Agent**: backend-developer (60%), business-analyst (40%)

---

## Overview

### Objectives
- Stripe WhatsApp Flows v3 checkout
- Payment webhooks (succeeded, failed, refunded)
- Cost tracking dashboard (10 KPIs)
- Launch 50 restaurants, 20 workers, 500 customers

### Success Criteria
- 20 real paid orders processed successfully (>95% success rate)
- Unit economics validated ($0.86 profit/order)
- 50 restaurants + 20 workers + 500 customers onboarded
- 20-30 orders/day by Week 4 end

---

## Stripe Integration

### Payment Intent Creation

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createPaymentIntent(orderId: string): Promise<string> {
  const { data: order } = await supabase
    .from('orders')
    .select('*, customer_id')
    .eq('id', orderId)
    .single();

  // Idempotency: Check if payment already exists
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('stripe_payment_intent_id')
    .eq('order_id', orderId)
    .maybeSingle();

  if (existingPayment) {
    return existingPayment.stripe_payment_intent_id;
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),  // COP to cents
    currency: 'cop',
    metadata: {
      order_id: orderId,
      customer_id: order.customer_id,
    },
    automatic_payment_methods: { enabled: true },
  });

  // Save to database
  await supabase.from('payments').insert({
    order_id: orderId,
    stripe_payment_intent_id: paymentIntent.id,
    stripe_client_secret: paymentIntent.client_secret,
    amount: order.total,
    status: 'pending',
  });

  return paymentIntent.id;
}
```

### WhatsApp Flows v3 Checkout

```typescript
export async function sendCheckoutFlow(phoneNumber: string, orderId: string): Promise<void> {
  const paymentIntentId = await createPaymentIntent(orderId);

  // WhatsApp Flow with 3 screens: Cart → Address → Payment
  await sendWhatsAppMessage(phoneNumber, {
    type: 'interactive',
    interactive: {
      type: 'flow',
      header: { type: 'text', text: 'Finalizar Pedido' },
      body: { text: 'Confirma tu pedido y procede al pago' },
      action: {
        name: 'flow',
        parameters: {
          flow_token: paymentIntentId,
          flow_id: process.env.WHATSAPP_CHECKOUT_FLOW_ID!,
          flow_cta: 'Pagar Ahora',
          flow_action: 'navigate',
          flow_action_payload: {
            screen: 'cart_review',
            data: { order_id: orderId },
          },
        },
      },
    },
  });
}
```

### Stripe Webhooks

**File**: `app/api/payments/webhook/route.ts`

```typescript
export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();

  // Verify Stripe signature
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;

    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const orderId = paymentIntent.metadata.order_id;

  // Update payment status
  await supabase
    .from('payments')
    .update({
      status: 'succeeded',
      succeeded_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // Update order status
  await supabase
    .from('orders')
    .update({ status: 'preparing' })
    .eq('id', orderId);

  // Notify customer + restaurant
  await notifyPaymentSuccess(orderId);
}

async function handlePaymentFailed(paymentIntent: any) {
  const orderId = paymentIntent.metadata.order_id;

  await supabase
    .from('payments')
    .update({
      status: 'failed',
      failed_at: new Date().toISOString(),
      failure_code: paymentIntent.last_payment_error?.code,
      failure_message: paymentIntent.last_payment_error?.message,
      retry_count: supabase.raw('retry_count + 1'),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  // Retry logic (3 attempts)
  const { data: payment } = await supabase
    .from('payments')
    .select('retry_count')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single();

  if (payment.retry_count < 3) {
    // Send payment link via WhatsApp
    await sendPaymentRetryLink(orderId);
  } else {
    // Cancel order after 3 failed attempts
    await cancelOrder(orderId, 'Payment failed after 3 attempts');
  }
}

async function handleRefund(charge: any) {
  const paymentIntentId = charge.payment_intent;

  await supabase
    .from('payments')
    .update({
      status: 'refunded',
      refunded_at: new Date().toISOString(),
      refund_amount: charge.amount_refunded / 100,  // Cents to COP
    })
    .eq('stripe_payment_intent_id', paymentIntentId);

  // Update order
  await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', charge.metadata.order_id);

  // Notify customer
  await notifyRefund(charge.metadata.order_id);
}
```

---

## Cost Tracking Dashboard

### Dashboard KPIs

```typescript
// File: lib/analytics.ts

export async function getDashboardKPIs(dateRange: { start: Date; end: Date }) {
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      payments(*),
      deliveries(*),
      messages(gemini_tokens_input, gemini_tokens_output, gemini_cached_tokens)
    `)
    .gte('created_at', dateRange.start.toISOString())
    .lte('created_at', dateRange.end.toISOString())
    .eq('status', 'completed');

  const orderCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPayouts = orders.reduce((sum, o) => sum + (o.deliveries[0]?.payout_amount || 0), 0);

  // Calculate AI cost (Gemini usage)
  const aiCost = orders.reduce((sum, o) => {
    const messages = o.messages || [];
    const inputTokens = messages.reduce((s, m) => s + (m.gemini_tokens_input || 0), 0);
    const outputTokens = messages.reduce((s, m) => s + (m.gemini_tokens_output || 0), 0);
    const cachedTokens = messages.reduce((s, m) => s + (m.gemini_cached_tokens || 0), 0);

    return sum + (
      (inputTokens / 1000) * 0.000075 +
      (outputTokens / 1000) * 0.00030 +
      (cachedTokens / 1000) * 0.00001875
    );
  }, 0);

  // WhatsApp cost (estimate based on messaging windows)
  const whatsappCost = orderCount * 0.02;  // $0.02/order average (90%+ free)

  // Infrastructure cost (estimate)
  const infrastructureCost = orderCount * 0.22;  // $0.22/order (Vercel + Supabase)

  const totalCost = totalPayouts + aiCost + whatsappCost + infrastructureCost;
  const profitPerOrder = (totalRevenue - totalCost) / orderCount;
  const margin = (totalRevenue - totalCost) / totalRevenue;

  return {
    orderCount,
    revenue: totalRevenue,
    aiCostPerOrder: aiCost / orderCount,  // Target: <$0.0005
    whatsappCostPerOrder: whatsappCost / orderCount,  // Target: <$0.03
    infrastructureCostPerOrder: infrastructureCost / orderCount,  // Target: <$0.24
    deliveryPayoutPerOrder: totalPayouts / orderCount,  // $1.40
    profitPerOrder,  // Target: $0.86
    margin,  // Target: 34%
    geminiUsageToday: await getGeminiUsageToday(),  // Monitor FREE tier limit
  };
}

async function getGeminiUsageToday(): Promise<number> {
  const { data } = await supabase
    .from('gemini_usage')
    .select('requests')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  return data?.requests || 0;
}
```

### Dashboard UI (React Component)

```tsx
// File: components/dashboard/kpi-cards.tsx
export function KPICards({ kpis }: { kpis: DashboardKPIs }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <KPICard
        title="Profit Per Order"
        value={`$${kpis.profitPerOrder.toFixed(2)}`}
        target="$0.86"
        status={kpis.profitPerOrder >= 0.86 ? 'success' : 'warning'}
      />

      <KPICard
        title="AI Cost Per Order"
        value={`$${kpis.aiCostPerOrder.toFixed(4)}`}
        target="<$0.0005"
        status={kpis.aiCostPerOrder < 0.0005 ? 'success' : 'danger'}
      />

      <KPICard
        title="Gemini Usage Today"
        value={`${kpis.geminiUsageToday} / 1,400`}
        progress={(kpis.geminiUsageToday / 1400) * 100}
        status={kpis.geminiUsageToday < 1200 ? 'success' : 'warning'}
      />

      {/* ... 7 more KPI cards */}
    </div>
  );
}
```

---

## Launch Execution

### Restaurant Target List

**File**: `docs/launch/restaurant-list.md`

```markdown
# Target Restaurants (50 total)

## Zona T (25 restaurants)

### Popular Chains (10)
1. Andrés Carne de Res - Calle 3 #11A-56
2. Crepes & Waffles - Carrera 13 #82-71
3. El Corral - Calle 93 #13-46
4. Juan Valdez Café - Carrera 15 #93-30
5. Wok - Calle 85 #13-15
... (5 more)

### Local Favorites (15)
1. La Puerta Falsa - Calle 11 #6-50
2. Archie's - Calle 93B #13-24
... (13 more)

## Chicó (25 restaurants)
... (similar structure)

## Onboarding Strategy
- Cold call + WhatsApp invite
- Pitch: 5-10% commission vs Rappi 28%
- Demo: Live onboarding in <30 seconds
- Target: 60% conversion (30+ restaurants)
```

### Launch Tracking Spreadsheet

| Restaurant Name | Status | Contacted | Onboarded | Approved | First Order |
|----------------|--------|-----------|-----------|----------|-------------|
| Andrés Carne de Res | ✅ | 2025-02-01 | 2025-02-01 | 2025-02-02 | 2025-02-05 |
| Crepes & Waffles | 🔄 | 2025-02-01 | - | - | - |
| ... | | | | | |

---

## Testing Strategy

### Payment E2E Test

```typescript
it('should process full payment flow', async () => {
  // 1. Create order
  const order = await createTestOrder();

  // 2. Create payment intent
  const paymentIntentId = await createPaymentIntent(order.id);

  // 3. Simulate successful payment (Stripe test mode)
  await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: 'pm_card_visa',  // Test card
  });

  // 4. Wait for webhook (max 5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // 5. Verify order status updated
  const { data: updatedOrder } = await supabase
    .from('orders')
    .select('status')
    .eq('id', order.id)
    .single();

  expect(updatedOrder.status).toBe('preparing');

  // 6. Verify payment status
  const { data: payment } = await supabase
    .from('payments')
    .select('status')
    .eq('order_id', order.id)
    .single();

  expect(payment.status).toBe('succeeded');
});
```

---

## Unit Economics Validation

### Cost Breakdown Per Order (Target)

| Cost Category | Amount | % of Revenue |
|--------------|--------|--------------|
| **Revenue** | **$2.50** | **100%** |
| Delivery Payout | $1.40 | 56% |
| AI Cost (Gemini FREE) | $0.0005 | 0.02% |
| WhatsApp Cost | $0.02 | 0.8% |
| Infrastructure | $0.22 | 8.8% |
| **Total Cost** | **$1.6405** | **65.6%** |
| **Profit** | **$0.8595** | **34.4%** |

**Validation**:
- ✅ Profit > $0.86 target
- ✅ Margin > 34% target
- ✅ AI cost < $0.0005
- ✅ WhatsApp cost < $0.03
- ✅ Infrastructure < $0.24

---

## References

- [ROADMAP.md](./ROADMAP.md)
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Week 4 tasks (20 tasks)
- [week-3-supply-spec.md](./week-3-supply-spec.md) - Restaurant onboarding (prerequisite)
- [Stripe Docs](https://stripe.com/docs/payments/payment-intents) - Payment Intents API
- [WhatsApp Flows Docs](https://developers.facebook.com/docs/whatsapp/flows/) - Flows v3 reference

---

**Week 4 Status**: Ready for implementation
**Approval Gate**: [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-4) - GO/NO-GO decision
**Next**: Production launch 2025-03-01 (if Gate 4 approved)
