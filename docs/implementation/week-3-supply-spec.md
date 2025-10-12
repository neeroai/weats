# Week 3: Supply Side Technical Specification

**Week**: 3 of 4 (Jan 25-31, 2025)
**Goal**: Restaurant & worker onboarding + automatic dispatch system operational
**Estimated Hours**: 65h
**Primary Agent**: whatsapp-api-expert (50%), supabase-expert (30%), gemini-expert (20%)

---

## Overview

### Objectives
- Restaurant onboarding via WhatsApp (<30 seconds)
- Menu extraction from PDF/images (Gemini Vision)
- Worker dispatch system (PostGIS-based, <10ms)
- QR code pickup/delivery confirmation

### Success Criteria
- 3 restaurants onboarded successfully (<30s each)
- Menu extraction >80% accuracy
- 5 orders dispatched successfully (<10ms each)
- QR confirmation system working

---

## Restaurant Onboarding Flow

### 30-Second Conversation Flow

```typescript
// 5-step conversational flow
const ONBOARDING_STEPS = [
  {
    step: 'welcome',
    message: '¡Bienvenido a WPFoods! 🍽️\n\nTe voy a ayudar a registrar tu restaurante. Solo toma 30 segundos.\n\n¿Cuál es el nombre de tu restaurante?',
  },
  {
    step: 'business_info',
    message: 'Perfecto! Ahora necesito:\n1. Dirección completa\n2. NIT (Número de Identificación Tributaria)\n3. Teléfono de contacto',
    validation: (input: string) => {
      // Extract: address, NIT, phone using Gemini
      return extractBusinessInfo(input);
    },
  },
  {
    step: 'menu_upload',
    message: '¡Excelente! Ahora envíame tu menú:\n- PDF del menú\n- Fotos del menú\n- O escríbeme los platos (nombre y precio)',
  },
  {
    step: 'confirmation',
    message: '✅ Datos recibidos!\n\nTu restaurante será revisado por nuestro equipo y te confirmaremos en breve.',
  },
  {
    step: 'activation',
    message: '🎉 Tu restaurante está ACTIVO en WPFoods!\n\nYa puedes recibir pedidos. Te notificaremos cuando lleguen órdenes.',
  },
];
```

### Menu Extraction (Gemini Vision)

```typescript
export async function extractMenuFromImage(imageUrl: string): Promise<MenuItem[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: await fetchImageBase64(imageUrl),
      },
    },
    {
      text: `Extrae todos los items del menú de esta imagen.

      Para cada item, extrae:
      - name (nombre del plato)
      - price (precio en COP, solo número sin símbolo $)
      - description (descripción si está disponible)
      - category (categoría: appetizers, mains, desserts, drinks)

      Retorna JSON array: [{"name":"...", "price":15000, "description":"...", "category":"mains"}, ...]

      Si no puedes extraer algún campo, usa null.`,
    },
  ]);

  const menuItems = JSON.parse(result.response.text());

  // Generate embeddings for semantic search
  for (const item of menuItems) {
    item.embedding = await generateEmbedding(`${item.name} ${item.description}`);
  }

  return menuItems;
}
```

**Accuracy Target**: >80% (name + price extraction)

---

## Worker Dispatch System

### Optimized PostGIS Query

```sql
-- Migration: 0016_optimize_dispatch.sql

-- Add composite index for dispatch queries
CREATE INDEX idx_delivery_workers_dispatch
  ON delivery_workers(status, available, current_location)
  WHERE status = 'active' AND available = true AND deleted_at IS NULL;

-- Materialized view for worker stats (refreshed every 5 minutes)
CREATE MATERIALIZED VIEW worker_stats AS
SELECT
  w.id AS worker_id,
  w.current_location,
  w.avg_rating,
  w.acceptance_rate,
  COUNT(d.id) FILTER (WHERE d.created_at >= CURRENT_DATE) AS deliveries_today,
  COUNT(d.id) FILTER (WHERE d.status IN ('assigned', 'accepted', 'picked_up')) AS active_deliveries
FROM delivery_workers w
LEFT JOIN deliveries d ON w.id = d.worker_id
WHERE w.status = 'active' AND w.deleted_at IS NULL
GROUP BY w.id;

CREATE UNIQUE INDEX idx_worker_stats_worker_id ON worker_stats(worker_id);

-- Refresh materialized view every 5 minutes (cron job)
CREATE OR REPLACE FUNCTION refresh_worker_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY worker_stats;
END;
$$ LANGUAGE plpgsql;
```

### Real-Time Assignment Logic

```typescript
export async function assignOrderToWorker(orderId: string): Promise<string | null> {
  // 1. Get restaurant location
  const { data: order } = await supabase
    .from('orders')
    .select('restaurant_id, restaurants(location)')
    .eq('id', orderId)
    .single();

  const restaurantLocation = order.restaurants.location;

  // 2. Find best worker (optimized query <10ms)
  const { data: workerId } = await supabase.rpc('find_best_worker', {
    restaurant_lat: restaurantLocation.coordinates[1],
    restaurant_lng: restaurantLocation.coordinates[0],
    order_id_param: orderId,
  });

  if (!workerId) {
    console.warn('No available workers found');
    return null;  // Manual dispatch fallback
  }

  // 3. Create delivery record
  await supabase.from('deliveries').insert({
    order_id: orderId,
    worker_id: workerId,
    status: 'assigned',
    payout_amount: 5600,  // $1.40 USD = ~5,600 COP
  });

  // 4. Update worker availability
  await supabase
    .from('delivery_workers')
    .update({ available: false })
    .eq('id', workerId);

  // 5. Notify worker
  await notifyWorker(workerId, orderId);

  return workerId;
}
```

### Worker Notification Design

```typescript
export async function notifyWorker(workerId: string, orderId: string): Promise<void> {
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      restaurants(name, address, location),
      order_items(quantity, menu_items(name))
    `)
    .eq('id', orderId)
    .single();

  const restaurant = data.restaurants;
  const items = data.order_items;
  const distance = calculateDistance(worker.current_location, restaurant.location);

  const message = `
🚀 *Nuevo Pedido Disponible*

📍 *Restaurante*: ${restaurant.name}
${restaurant.address}

📦 *Pedido*: ${items.length} items
${items.map(i => `  • ${i.quantity}x ${i.menu_items.name}`).join('\n')}

💰 *Pago*: $5,600 COP
📏 *Distancia*: ${distance} km
⏱️ *Tiempo estimado*: ${Math.ceil(distance / 20 * 60)} min

¿Aceptas este pedido?
  `;

  await sendWhatsAppMessage(worker.phone_number, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: message },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: { id: `accept_${orderId}`, title: 'Aceptar ✅' },
          },
          {
            type: 'reply',
            reply: { id: `reject_${orderId}`, title: 'Rechazar ❌' },
          },
        ],
      },
    },
  });

  // Auto-reassign after 2 minutes if no response
  setTimeout(() => reassignIfNotAccepted(orderId), 2 * 60 * 1000);
}
```

---

## QR Code System

### Generation

```typescript
import { createHmac } from 'crypto';
import QRCode from 'qrcode';

export async function generatePickupQR(orderId: string): Promise<string> {
  const timestamp = Date.now();
  const payload = `${orderId}:${timestamp}`;

  // HMAC signature (security)
  const signature = createHmac('sha256', process.env.QR_SECRET!)
    .update(payload)
    .digest('hex')
    .substring(0, 16);  // First 16 chars

  const qrData = `${payload}:${signature}`;

  // Generate QR code (SVG for lightweight)
  const qrImage = await QRCode.toDataURL(qrData);

  return qrImage;  // Base64 data URL
}
```

### Validation

```typescript
export async function validatePickupQR(qrData: string): Promise<boolean> {
  const [orderId, timestamp, signature] = qrData.split(':');

  // 1. Check timestamp (valid for 1 hour)
  if (Date.now() - parseInt(timestamp) > 60 * 60 * 1000) {
    throw new Error('QR code expired');
  }

  // 2. Verify HMAC signature
  const expectedSignature = createHmac('sha256', process.env.QR_SECRET!)
    .update(`${orderId}:${timestamp}`)
    .digest('hex')
    .substring(0, 16);

  if (signature !== expectedSignature) {
    throw new Error('Invalid QR code');
  }

  // 3. Check order status
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (order.status !== 'ready') {
    throw new Error('Order not ready for pickup');
  }

  return true;
}
```

---

## Testing Strategy

### E2E Onboarding Test

```typescript
it('should complete restaurant onboarding in <30 seconds', async () => {
  const startTime = Date.now();

  // Simulate onboarding conversation
  await simulateOnboarding({
    name: 'Test Restaurant',
    address: 'Calle 85 #10-20, Bogotá',
    nit: '900123456-7',
    phone: '+573001234567',
    menu: 'test-menu.pdf',
  });

  const elapsed = Date.now() - startTime;

  expect(elapsed).toBeLessThan(30000);  // <30 seconds

  // Verify restaurant created
  const { data } = await supabase
    .from('restaurants')
    .select('*')
    .eq('name', 'Test Restaurant')
    .single();

  expect(data.status).toBe('pending_approval');
});
```

### Dispatch Performance Test

```typescript
it('should dispatch order in <10ms', async () => {
  // Create test order
  const { data: order } = await supabase
    .from('orders')
    .insert({ /* test order data */ })
    .select()
    .single();

  const startTime = Date.now();

  const workerId = await assignOrderToWorker(order.id);

  const elapsed = Date.now() - startTime;

  expect(workerId).toBeDefined();
  expect(elapsed).toBeLessThan(10);  // <10ms target
});
```

---

## References

- [ROADMAP.md](./ROADMAP.md)
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Week 3 tasks (17 tasks)
- [week-1-database-spec.md](./week-1-database-spec.md) - PostGIS functions
- [week-2-ordering-spec.md](./week-2-ordering-spec.md) - Gemini agent (prerequisite for menu extraction)

---

**Week 3 Status**: Ready for implementation
**Approval Gate**: [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-3)
**Next Week**: [week-4-payments-spec.md](./week-4-payments-spec.md)
