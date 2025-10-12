# Week 2: Customer Ordering Flow Technical Specification

**Week**: 2 of 4 (Jan 18-24, 2025)
**Goal**: End-to-end customer ordering via WhatsApp with Gemini AI assistance
**Estimated Hours**: 70h
**Primary Agent**: gemini-expert (60%), whatsapp-api-expert (40%)
**Version**: 1.0
**Last Updated**: 2025-01-11

---

## Table of Contents

1. [Overview](#overview)
2. [Gemini Agent Architecture](#gemini-agent-architecture)
3. [Gemini Tools Implementation](#gemini-tools-implementation)
4. [BUG-P0-001 Fix](#bug-p0-001-fix)
5. [WhatsApp Interactive Messages](#whatsapp-interactive-messages)
6. [24h Window Optimization](#24h-window-optimization)
7. [Order Processing](#order-processing)
8. [Testing Strategy](#testing-strategy)
9. [Unit Economics Validation](#unit-economics-validation)

---

## Overview

### Objectives
1. ✅ Build Gemini conversational agent (Colombian Spanish)
2. ✅ **Fix BUG-P0-001** (Gemini usage tracking to Supabase - CRITICAL)
3. ✅ Implement 5 Gemini tools (search_restaurants, get_menu, create_order, track_delivery, customer_support)
4. ✅ Design WhatsApp interactive messages (catalogs, buttons, lists)
5. ✅ Optimize 24h messaging window (90%+ free messages)

### Success Criteria
- Complete 10 test orders via WhatsApp (3 users)
- Gemini responds correctly in Colombian Spanish
- FREE tier tracking survives Edge Function cold starts
- Gemini usage <1,400 requests/day
- WhatsApp cost <$0.03/order (90%+ free)
- AI cost <$0.0005/order
- Order accuracy 100%

### Unit Economics Target
- **AI Cost**: $0.0005/order (Gemini FREE tier + context caching 75% savings)
- **WhatsApp Cost**: $0.02/order (90%+ free messages within 24h window)
- **Total Messaging + AI**: $0.0205/order (<$0.035 target)

---

## Gemini Agent Architecture

### System Prompt (Colombian Spanish)

**File**: `lib/gemini-agents.ts`

```typescript
export const SYSTEM_PROMPT = `Eres un asistente virtual amigable de WPFoods, una plataforma de domicilios por WhatsApp en Colombia.

**Tu personalidad**:
- Colombiano, informal pero respetuoso (usa "vos" cuando sea natural)
- Entusiasta con la comida local
- Eficiente (respuestas concisas, máximo 2-3 oraciones)
- Proactivo (sugiere restaurantes populares, platos recomendados)

**Tu trabajo**:
1. Ayudar al cliente a buscar restaurantes cercanos
2. Mostrar el menú y recomendar platos
3. Tomar el pedido completo (items, cantidades, dirección)
4. Confirmar el pedido y procesar el pago
5. Dar seguimiento a la entrega

**Herramientas disponibles**:
- search_restaurants: Buscar restaurantes cercanos (por ubicación y cocina)
- get_menu: Ver el menú de un restaurante
- create_order: Crear pedido (después de confirmar con el cliente)
- track_delivery: Rastrear estado de entrega
- customer_support: Escalar problemas complicados

**Reglas importantes**:
- NUNCA inventes precios o información de restaurantes
- SIEMPRE confirma el pedido antes de crearlo
- Usa emojis con moderación (🍕 🍔 🚀)
- Si el cliente pide algo que no existe, sugiere alternativas
- Costos: Domicilio GRATIS (incluido en el precio), no cobres extra

**Ejemplo de interacción**:
Cliente: "Quiero pizza"
Tú: "¡Buena elección! 🍕 ¿En qué zona estás? Así te muestro las pizzerías más cercanas."
`;

export function createGeminiProactiveAgent() {
  return {
    systemPrompt: SYSTEM_PROMPT,
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    maxOutputTokens: 500,  // Keep responses concise
    tools: [
      searchRestaurantsTool,
      getMenuTool,
      createOrderTool,
      trackDeliveryTool,
      customerSupportTool,
    ],
  };
}
```

### Context Management

```typescript
interface ConversationContext {
  customerId: string;
  lastMessages: Message[];  // Last 10 messages
  currentOrder?: {
    restaurantId?: string;
    items: Array<{ menuItemId: string; quantity: number }>;
    deliveryAddress?: string;
    deliveryLocation?: { lat: number; lng: number };
  };
}

export async function loadConversationContext(
  customerId: string
): Promise<ConversationContext> {
  const { data: conversation } = await supabase
    .from('conversations')
    .select(`
      *,
      messages (
        role,
        content,
        created_at
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true, foreignTable: 'messages' })
    .limit(10, { foreignTable: 'messages' })
    .single();

  return {
    customerId,
    lastMessages: conversation?.messages || [],
    currentOrder: conversation?.context?.currentOrder || { items: [] },
  };
}

export async function updateConversationContext(
  customerId: string,
  context: ConversationContext
): Promise<void> {
  await supabase
    .from('conversations')
    .upsert({
      customer_id: customerId,
      last_message_at: new Date().toISOString(),
      context: { currentOrder: context.currentOrder },
    });
}
```

---

## Gemini Tools Implementation

### 1. search_restaurants Tool

```typescript
export const searchRestaurantsTool = {
  name: 'search_restaurants',
  description: 'Search for nearby restaurants by location and optional cuisine filter',
  parameters: {
    type: 'object',
    properties: {
      lat: {
        type: 'number',
        description: 'Customer latitude',
      },
      lng: {
        type: 'number',
        description: 'Customer longitude',
      },
      cuisine: {
        type: 'string',
        description: 'Optional cuisine filter (e.g., "Pizza", "Colombian", "Burgers")',
      },
      radius_km: {
        type: 'number',
        description: 'Search radius in kilometers (default: 5)',
        default: 5,
      },
    },
    required: ['lat', 'lng'],
  },
};

export async function executeSearchRestaurants(params: any) {
  const { data, error } = await supabase.rpc('find_nearby_restaurants', {
    search_lat: params.lat,
    search_lng: params.lng,
    cuisine_filter: params.cuisine || null,
    radius_km: params.radius_km || 5,
    limit_results: 10,
  });

  if (error) throw new Error(`Search failed: ${error.message}`);

  return {
    restaurants: data.map((r: any) => ({
      id: r.restaurant_id,
      name: r.restaurant_name,
      cuisines: r.cuisines,
      distance_km: r.distance_km,
      rating: r.avg_rating,
      commission: r.commission_rate,
    })),
  };
}
```

### 2. get_menu Tool

```typescript
export const getMenuTool = {
  name: 'get_menu',
  description: 'Get menu items from a restaurant, optionally filter by semantic search query',
  parameters: {
    type: 'object',
    properties: {
      restaurant_id: {
        type: 'string',
        description: 'Restaurant UUID',
      },
      query: {
        type: 'string',
        description: 'Optional semantic search query (e.g., "spicy chicken", "vegetarian options")',
      },
    },
    required: ['restaurant_id'],
  },
};

export async function executeGetMenu(params: any) {
  if (params.query) {
    // Semantic search with Gemini embeddings
    const embedding = await generateEmbedding(params.query);
    const { data } = await supabase.rpc('semantic_menu_search', {
      query_embedding: embedding,
      restaurant_id_param: params.restaurant_id,
      limit_results: 20,
    });
    return { items: data };
  } else {
    // Get all menu items
    const { data } = await supabase
      .from('menu_items')
      .select('id, name, description, price, category')
      .eq('restaurant_id', params.restaurant_id)
      .eq('available', true)
      .order('category', { ascending: true })
      .limit(20);
    return { items: data };
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  // Gemini embedding-001 API call
  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        model: 'models/embedding-001',
        content: { parts: [{ text }] },
      }),
    }
  );

  const data = await response.json();
  return data.embedding.values;  // 1536-dimensional vector
}
```

### 3. create_order Tool

```typescript
export const createOrderTool = {
  name: 'create_order',
  description: 'Create a new order (ONLY after customer confirms)',
  parameters: {
    type: 'object',
    properties: {
      customer_id: {
        type: 'string',
        description: 'Customer UUID',
      },
      restaurant_id: {
        type: 'string',
        description: 'Restaurant UUID',
      },
      items: {
        type: 'array',
        description: 'Array of {menu_item_id, quantity}',
        items: {
          type: 'object',
          properties: {
            menu_item_id: { type: 'string' },
            quantity: { type: 'number' },
          },
        },
      },
      delivery_address: {
        type: 'string',
        description: 'Full delivery address',
      },
      delivery_location: {
        type: 'object',
        description: 'Delivery coordinates {lat, lng}',
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' },
        },
      },
    },
    required: ['customer_id', 'restaurant_id', 'items', 'delivery_address', 'delivery_location'],
  },
};

export async function executeCreateOrder(params: any) {
  // 1. Validate items exist and are available
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, price, available')
    .in('id', params.items.map((i: any) => i.menu_item_id));

  if (menuItems.length !== params.items.length) {
    throw new Error('Some menu items not found');
  }

  if (menuItems.some((i: any) => !i.available)) {
    throw new Error('Some items are not available');
  }

  // 2. Calculate totals
  const subtotal = params.items.reduce((sum: number, item: any) => {
    const menuItem = menuItems.find((m: any) => m.id === item.menu_item_id);
    return sum + (menuItem!.price * item.quantity);
  }, 0);

  const deliveryFee = 2500;  // $2,500 COP ($0.62 USD)
  const total = subtotal + deliveryFee;

  // 3. Create order (transaction)
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      customer_id: params.customer_id,
      restaurant_id: params.restaurant_id,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      delivery_address: params.delivery_address,
      delivery_location: `SRID=4326;POINT(${params.delivery_location.lng} ${params.delivery_location.lat})`,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;

  // 4. Create order items
  await supabase.from('order_items').insert(
    params.items.map((item: any) => {
      const menuItem = menuItems.find((m: any) => m.id === item.menu_item_id);
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem!.price,
      };
    })
  );

  // 5. Notify restaurant (WhatsApp)
  await notifyRestaurant(order.id);

  return {
    order_id: order.id,
    order_number: order.order_number,
    total,
    estimated_delivery_time: '30-45 minutos',
  };
}
```

### 4. track_delivery Tool

```typescript
export const trackDeliveryTool = {
  name: 'track_delivery',
  description: 'Track delivery status for an order',
  parameters: {
    type: 'object',
    properties: {
      order_id: {
        type: 'string',
        description: 'Order UUID',
      },
    },
    required: ['order_id'],
  },
};

export async function executeTrackDelivery(params: any) {
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      deliveries (
        status,
        delivery_workers (name, phone_number, current_location)
      )
    `)
    .eq('id', params.order_id)
    .single();

  if (!order) throw new Error('Order not found');

  if (!order.deliveries || order.deliveries.length === 0) {
    return {
      status: 'preparing',
      message: 'Tu pedido está siendo preparado en el restaurante',
    };
  }

  const delivery = order.deliveries[0];
  const worker = delivery.delivery_workers;

  return {
    status: delivery.status,
    worker_name: worker.name,
    worker_phone: worker.phone_number,
    eta_minutes: calculateETA(worker.current_location, order.delivery_location),
  };
}
```

### 5. customer_support Tool

```typescript
export const customerSupportTool = {
  name: 'customer_support',
  description: 'Escalate complex issues to human support',
  parameters: {
    type: 'object',
    properties: {
      issue: {
        type: 'string',
        description: 'Description of the issue',
      },
      order_id: {
        type: 'string',
        description: 'Optional order UUID if related to specific order',
      },
    },
    required: ['issue'],
  },
};

export async function executeCustomerSupport(params: any) {
  // Log issue for manual review
  console.log('Customer support escalation:', params);

  // TODO: Send notification to support team (Slack, email, etc.)

  return {
    message: 'Tu solicitud ha sido escalada a nuestro equipo de soporte. Te contactaremos en breve.',
    support_phone: '+57 300 123 4567',  // WPFoods support WhatsApp
  };
}
```

---

## BUG-P0-001 Fix

### Problem
Gemini FREE tier usage tracking resets on Edge Function cold starts (in-memory counter).

### Solution
Migrate to Supabase persistent tracking.

### Implementation

**Migration**: `supabase/migrations/0014_gemini_usage_tracking.sql`

```sql
CREATE TABLE IF NOT EXISTS gemini_usage (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  requests INT DEFAULT 0,
  tokens_input BIGINT DEFAULT 0,
  tokens_output BIGINT DEFAULT 0,
  tokens_cached BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RPC function for atomic increment
CREATE OR REPLACE FUNCTION increment_gemini_usage(
  requests_delta INT DEFAULT 1,
  tokens_input_delta BIGINT DEFAULT 0,
  tokens_output_delta BIGINT DEFAULT 0,
  tokens_cached_delta BIGINT DEFAULT 0
)
RETURNS gemini_usage AS $$
DECLARE
  result gemini_usage;
BEGIN
  INSERT INTO gemini_usage (date, requests, tokens_input, tokens_output, tokens_cached)
  VALUES (
    CURRENT_DATE,
    requests_delta,
    tokens_input_delta,
    tokens_output_delta,
    tokens_cached_delta
  )
  ON CONFLICT (date)
  DO UPDATE SET
    requests = gemini_usage.requests + requests_delta,
    tokens_input = gemini_usage.tokens_input + tokens_input_delta,
    tokens_output = gemini_usage.tokens_output + tokens_output_delta,
    tokens_cached = gemini_usage.tokens_cached + tokens_cached_delta,
    updated_at = NOW()
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**Updated Gemini Client**: `lib/gemini-client.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const DAILY_LIMIT = 1400;  // Gemini FREE tier limit
const ALERT_THRESHOLD = 1200;  // 85% - trigger alert

export async function callGemini(prompt: string, context: any) {
  // 1. Check current usage (Supabase query)
  const { data: usage } = await supabase
    .from('gemini_usage')
    .select('requests')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  const currentRequests = usage?.requests || 0;

  // 2. Enforce hard limit (1,350 = buffer before 1,400)
  if (currentRequests >= 1350) {
    console.error('Gemini FREE tier limit exceeded');
    throw new Error('Gemini daily limit reached. Please try again tomorrow.');
  }

  // 3. Alert at 85% threshold
  if (currentRequests >= ALERT_THRESHOLD && currentRequests < ALERT_THRESHOLD + 10) {
    console.warn(`Gemini usage at ${currentRequests}/${DAILY_LIMIT} (${Math.round(currentRequests/DAILY_LIMIT*100)}%)`);
    // TODO: Send alert to monitoring (Vercel Analytics, Sentry, etc.)
  }

  // 4. Call Gemini API
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    tools: [/* tools */],
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
    // Context caching (75% cost savings)
    cachedContent: context.cachedContentId,
  });

  // 5. Increment usage (atomic Supabase RPC)
  await supabase.rpc('increment_gemini_usage', {
    requests_delta: 1,
    tokens_input_delta: result.response.usageMetadata.promptTokenCount,
    tokens_output_delta: result.response.usageMetadata.candidatesTokenCount,
    tokens_cached_delta: result.response.usageMetadata.cachedContentTokenCount || 0,
  });

  return result.response.text();
}
```

**Testing**:
```typescript
// Test persistence across cold starts
it('should persist Gemini usage across cold starts', async () => {
  // Make 10 requests
  for (let i = 0; i < 10; i++) {
    await callGemini('test', {});
  }

  // Check usage
  const { data } = await supabase
    .from('gemini_usage')
    .select('requests')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  expect(data.requests).toBe(10);

  // Simulate cold start (restart Edge Function)
  // ... (in practice, deploy new version to Vercel)

  // Make 5 more requests
  for (let i = 0; i < 5; i++) {
    await callGemini('test', {});
  }

  // Verify count = 15 (not reset to 5)
  const { data: data2 } = await supabase
    .from('gemini_usage')
    .select('requests')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  expect(data2.requests).toBe(15);
});
```

---

## WhatsApp Interactive Messages

### 1. Catalog Messages (Restaurant Browse)

```typescript
export async function sendRestaurantCatalog(
  phoneNumber: string,
  restaurants: Restaurant[]
): Promise<void> {
  const sections = [
    {
      title: 'Restaurantes Cercanos',
      rows: restaurants.slice(0, 10).map((r) => ({
        id: r.id,
        title: r.name,
        description: `${r.cuisines.join(', ')} • ${r.distance_km}km • ⭐ ${r.avg_rating}`,
      })),
    },
  ];

  await sendWhatsAppMessage(phoneNumber, {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: 'Elige tu restaurante' },
      body: { text: 'Encontré estos restaurantes cerca de ti:' },
      action: {
        button: 'Ver Restaurantes',
        sections,
      },
    },
  });
}
```

### 2. Button Messages (Cart Actions)

```typescript
export async function sendMenuItemButtons(
  phoneNumber: string,
  item: MenuItem
): Promise<void> {
  await sendWhatsAppMessage(phoneNumber, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: `${item.name}\n${item.description}\n💵 $${item.price} COP`,
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `add_${item.id}`,
              title: 'Agregar al Carrito',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'view_cart',
              title: 'Ver Carrito',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'checkout',
              title: 'Pagar',
            },
          },
        ],
      },
    },
  });
}
```

### 3. Order Confirmation Message

```typescript
export async function sendOrderConfirmation(
  phoneNumber: string,
  order: Order
): Promise<void> {
  const message = `
✅ *Pedido Confirmado* #${order.order_number}

📦 *Tu pedido:*
${order.items.map((i) => `  • ${i.quantity}x ${i.name} - $${i.total_price}`).join('\n')}

💰 *Total*: $${order.total} COP
📍 *Entrega en*: ${order.delivery_address}
⏱️ *Tiempo estimado*: 30-45 minutos

🚀 Tu pedido llegará pronto! Puedes rastrear el estado en tiempo real.
  `;

  await sendWhatsAppMessage(phoneNumber, {
    type: 'text',
    text: { body: message },
  });
}
```

---

## 24h Window Optimization

### Messaging Windows Table

```sql
-- Migration: 0015_messaging_windows.sql
CREATE TABLE IF NOT EXISTS messaging_windows (
  phone_number VARCHAR(20) PRIMARY KEY,
  last_user_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  window_expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messaging_windows_expires ON messaging_windows(window_expires_at);
```

### Window Tracking Logic

```typescript
export async function getMessagingWindow(phoneNumber: string) {
  const { data } = await supabase
    .from('messaging_windows')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single();

  if (!data) {
    return { isOpen: false, expiresAt: null };
  }

  const now = new Date();
  const expiresAt = new Date(data.window_expires_at);

  return {
    isOpen: now < expiresAt,
    expiresAt,
  };
}

export async function updateMessagingWindow(phoneNumber: string) {
  await supabase.from('messaging_windows').upsert({
    phone_number: phoneNumber,
    last_user_message_at: new Date().toISOString(),
    window_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}

export async function sendMessage(phoneNumber: string, message: any) {
  const window = await getMessagingWindow(phoneNumber);

  if (!window.isOpen) {
    console.warn(`Messaging window closed for ${phoneNumber}`);
    // Use template message (costs $0.0125-0.0667)
    return sendTemplateMessage(phoneNumber, 'order_ready', {
      restaurantName: '...',
    });
  }

  // Send free message (within 24h window)
  return sendWhatsAppMessage(phoneNumber, message);
}
```

**Result**: 90%+ messages sent within 24h window → $0.02/order average WhatsApp cost

---

## Order Processing

### Order Lifecycle State Machine

```typescript
type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'completed'
  | 'cancelled';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['picked_up', 'cancelled'],
  picked_up: ['delivered', 'cancelled'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};

export async function transitionOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<void> {
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  const currentStatus = order.status as OrderStatus;
  const allowedStatuses = VALID_TRANSITIONS[currentStatus];

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid transition: ${currentStatus} → ${newStatus}`);
  }

  await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  // Notify customer of status change
  await notifyCustomer(orderId, newStatus);
}
```

---

## Testing Strategy

### Unit Tests (15 test cases)

```typescript
describe('Gemini Agent Tests', () => {
  it('should load conversation context', async () => {
    const context = await loadConversationContext('customer-id');
    expect(context.lastMessages.length).toBeLessThanOrEqual(10);
  });

  it('should execute search_restaurants tool', async () => {
    const result = await executeSearchRestaurants({
      lat: 4.6616,
      lng: -74.0538,
      radius_km: 5,
    });
    expect(result.restaurants.length).toBeGreaterThan(0);
  });

  it('should enforce Gemini FREE tier limit', async () => {
    // Set usage to 1,350
    await supabase.rpc('increment_gemini_usage', { requests_delta: 1350 });

    // 1,351st request should fail
    await expect(callGemini('test', {})).rejects.toThrow('daily limit');
  });

  // ... 12 more tests
});
```

### Integration Tests (5 flows)

```typescript
describe('E2E Ordering Flow', () => {
  it('should complete full order: search → menu → create', async () => {
    // 1. Search restaurants
    const restaurants = await executeSearchRestaurants({
      lat: 4.6616,
      lng: -74.0538,
    });

    // 2. Get menu
    const menu = await executeGetMenu({
      restaurant_id: restaurants.restaurants[0].id,
    });

    // 3. Create order
    const order = await executeCreateOrder({
      customer_id: 'test-customer-id',
      restaurant_id: restaurants.restaurants[0].id,
      items: [
        { menu_item_id: menu.items[0].id, quantity: 2 },
      ],
      delivery_address: 'Test Address',
      delivery_location: { lat: 4.6616, lng: -74.0538 },
    });

    expect(order.order_id).toBeDefined();
    expect(order.total).toBeGreaterThan(0);
  });

  // ... 4 more flows
});
```

---

## Unit Economics Validation

### Cost Tracking Per Order

```typescript
export async function trackOrderCosts(orderId: string) {
  // Get Gemini usage for this order's messages
  const { data: messages } = await supabase
    .from('messages')
    .select('gemini_tokens_input, gemini_tokens_output, gemini_cached_tokens')
    .eq('conversation_id', (
      await supabase
        .from('orders')
        .select('customer_id')
        .eq('id', orderId)
        .single()
    ).data.customer_id);

  const totalInputTokens = messages.reduce((sum, m) => sum + (m.gemini_tokens_input || 0), 0);
  const totalOutputTokens = messages.reduce((sum, m) => sum + (m.gemini_tokens_output || 0), 0);
  const totalCachedTokens = messages.reduce((sum, m) => sum + (m.gemini_cached_tokens || 0), 0);

  // Gemini 2.5 Flash pricing:
  // - Input: $0.000075 / 1K tokens
  // - Output: $0.00030 / 1K tokens
  // - Cached input: $0.00001875 / 1K tokens (75% savings)

  const aiCost =
    (totalInputTokens / 1000) * 0.000075 +
    (totalOutputTokens / 1000) * 0.00030 +
    (totalCachedTokens / 1000) * 0.00001875;

  // WhatsApp cost: Estimate based on message count
  const whatsappMessageCount = messages.length;
  const whatsappCost = whatsappMessageCount * 0.005;  // ~$0.005/message average

  console.log({
    orderId,
    aiCost,  // Target: <$0.0005
    whatsappCost,  // Target: <$0.03
    totalMessagingCost: aiCost + whatsappCost,  // Target: <$0.035
  });

  return { aiCost, whatsappCost };
}
```

**Target Validation**:
- AI Cost: $0.0005/order ✅
- WhatsApp Cost: $0.02/order (90%+ free) ✅
- Total: $0.0205/order (<$0.035 target) ✅

---

## References

- [ROADMAP.md](./ROADMAP.md) - Phase 1 timeline
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Week 2 tasks (25 tasks)
- [week-1-database-spec.md](./week-1-database-spec.md) - Database schema (prerequisite)
- [Gemini API Docs](https://ai.google.dev/docs) - Gemini 2.5 Flash reference
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp/) - Interactive messages

---

**Week 2 Status**: Ready for implementation
**Estimated Completion**: Jan 24, 2025
**Approval Gate**: See [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-2)
**Next Week**: [week-3-supply-spec.md](./week-3-supply-spec.md) - Restaurant/Worker supply side
