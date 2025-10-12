# Supabase Connection Patterns for Edge Runtime

Edge-compatible Supabase client configuration for Weats.ai platform.

---

## Edge Runtime Connection (CRITICAL)

**Problem:** Default Supabase client uses connection pooling (port 5432), which doesn't work in Edge Runtime.

**Solution:** Use **transaction pooling** (port 6543) with session management disabled.

### Pattern

```typescript
import { createClient } from '@supabase/supabase-js';

// For Edge Functions - use transaction pooling
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: false,      // Edge Runtime (no localStorage)
      autoRefreshToken: false     // Edge Runtime (no background refresh)
    }
  }
);

// Connection string format:
// postgres://[user]:[password]@[host]:6543/[database]
// Port 6543 = Transaction mode (required for Edge)
// Pool size = 1 (optimal for serverless)
```

**Why transaction pooling?**
- Edge Functions are short-lived (no persistent connections)
- Transaction mode = 1 connection per request (lightweight)
- Connection pooling (port 5432) = sticky connections (doesn't work in serverless)

**Reference:** `lib/supabase.ts`

---

## PostGIS Location Queries

**Weats.ai uses PostGIS** for restaurant/worker matching (<10ms queries).

### Find Nearby Restaurants

```typescript
// Location-based restaurant search (PostGIS)
const { data: restaurants } = await supabase.rpc('find_nearby_restaurants', {
  customer_lat: -4.6097,
  customer_lng: -74.0817,
  radius_km: 3,
  cuisine_types: ['colombian', 'fast_food']
});

// Returns restaurants within 3km, sorted by distance
// Execution time: <10ms (PostGIS spatial index)
```

**Database function (PostGIS):**
```sql
CREATE OR REPLACE FUNCTION find_nearby_restaurants(
  customer_lat DECIMAL,
  customer_lng DECIMAL,
  radius_km DECIMAL,
  cuisine_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  distance_km DECIMAL,
  avg_prep_time_minutes INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.name,
    r.address,
    ST_Distance(
      r.location::geography,
      ST_SetSRID(ST_MakePoint(customer_lng, customer_lat), 4326)::geography
    ) / 1000 AS distance_km,
    r.avg_prep_time_minutes
  FROM restaurants r
  WHERE r.is_active = TRUE
    AND ST_DWithin(
      r.location::geography,
      ST_SetSRID(ST_MakePoint(customer_lng, customer_lat), 4326)::geography,
      radius_km * 1000
    )
    AND (cuisine_types IS NULL OR r.cuisine_type = ANY(cuisine_types))
  ORDER BY distance_km ASC
  LIMIT 20;
END $$ LANGUAGE plpgsql;
```

---

### Optimal Worker Dispatch

```typescript
// Optimal worker dispatch (distance + availability)
const { data: worker } = await supabase.rpc('find_best_worker', {
  restaurant_lat: -4.6097,
  restaurant_lng: -74.0817,
  customer_lat: -4.6234,
  customer_lng: -74.0712
});

// Returns best available worker based on:
// 1. Distance to restaurant (pickup)
// 2. Distance to customer (delivery)
// 3. Worker availability status
// 4. Current workload
```

**Database function:**
```sql
CREATE OR REPLACE FUNCTION find_best_worker(
  restaurant_lat DECIMAL,
  restaurant_lng DECIMAL,
  customer_lat DECIMAL,
  customer_lng DECIMAL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  phone_number TEXT,
  distance_to_restaurant_km DECIMAL,
  distance_to_customer_km DECIMAL,
  current_orders INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.name,
    w.phone_number,
    ST_Distance(
      w.current_location::geography,
      ST_SetSRID(ST_MakePoint(restaurant_lng, restaurant_lat), 4326)::geography
    ) / 1000 AS distance_to_restaurant_km,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(restaurant_lng, restaurant_lat), 4326)::geography,
      ST_SetSRID(ST_MakePoint(customer_lng, customer_lat), 4326)::geography
    ) / 1000 AS distance_to_customer_km,
    (SELECT COUNT(*) FROM deliveries d WHERE d.worker_id = w.id AND d.status IN ('assigned', 'picked_up')) AS current_orders
  FROM delivery_workers w
  WHERE w.is_active = TRUE
    AND w.is_available = TRUE
  ORDER BY
    current_orders ASC,
    distance_to_restaurant_km ASC
  LIMIT 1;
END $$ LANGUAGE plpgsql;
```

---

### Real-Time Delivery Tracking

```typescript
// Real-time order tracking
await supabase
  .from('deliveries')
  .update({
    current_lat,
    current_lng,
    updated_at: new Date().toISOString()
  })
  .eq('id', deliveryId);

// Customers receive location updates via WhatsApp
// ETA calculated using PostGIS distance + avg speed
```

---

## pgvector Semantic Search

**Weats.ai uses pgvector** for menu item embeddings (semantic search).

### Menu Search Example

```typescript
// Search menu items by semantic similarity
const { data: items } = await supabase.rpc('search_menu_items', {
  query_embedding: await generateEmbedding("tacos picantes"), // Gemini embeddings
  restaurant_id: restaurantId,
  limit: 10,
  similarity_threshold: 0.7
});

// Returns: Tacos, Burritos, Quesadillas (semantically similar)
// Ignores exact keyword match, focuses on meaning
```

**Database setup:**
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column (1536 dimensions for Gemini)
ALTER TABLE menu_items ADD COLUMN embedding vector(1536);

-- Create HNSW index for fast similarity search
CREATE INDEX menu_items_embedding_idx ON menu_items
USING hnsw (embedding vector_cosine_ops);
```

---

## Connection Pool Configuration

### Environment Variables

```bash
# Database connection (transaction pooling for Edge)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key          # Client-side (RLS enforced)
SUPABASE_SERVICE_KEY=your-service-key    # Server-side (bypasses RLS)

# Connection pooler (port 6543 for Edge Functions)
# Format: postgres://postgres:[password]@db.[project-ref].supabase.co:6543/postgres
```

### Pool Size Optimization

| Environment | Pool Size | Port | Mode |
|-------------|-----------|------|------|
| Edge Functions | 1 | 6543 | Transaction |
| Long-running APIs | 10 | 5432 | Session |
| Background jobs | 5 | 6543 | Transaction |

**Weats.ai uses Edge Functions only** → Transaction pooling (port 6543, pool=1).

---

## Performance Best Practices

### 1. Use RPC for Complex Queries

```typescript
// ✅ GOOD: RPC with database-side logic (<10ms)
const { data } = await supabase.rpc('find_nearby_restaurants', { lat, lng, radius: 3 });

// ❌ BAD: Client-side filtering (slow, inefficient)
const { data } = await supabase.from('restaurants').select('*');
const nearby = data.filter(r => calculateDistance(lat, lng, r.lat, r.lng) < 3);
```

### 2. Batch Operations

```typescript
// ✅ GOOD: Single query with multiple inserts
await supabase.from('order_items').insert([
  { order_id, menu_item_id: 1, quantity: 2 },
  { order_id, menu_item_id: 3, quantity: 1 },
  { order_id, menu_item_id: 5, quantity: 3 }
]);

// ❌ BAD: Multiple sequential inserts
for (const item of items) {
  await supabase.from('order_items').insert(item);  // 3 round trips
}
```

### 3. Index Critical Columns

```sql
-- PostGIS spatial indexes (required for <10ms queries)
CREATE INDEX restaurants_location_idx ON restaurants USING gist(location);

-- Composite indexes for common queries
CREATE INDEX orders_customer_status_idx ON orders(customer_id, status);

-- Partial indexes for active records
CREATE INDEX restaurants_active_idx ON restaurants(is_active) WHERE is_active = TRUE;
```

---

## Weats.ai Database Schema

**10 core tables:**
- `customers` - Customer profiles, WhatsApp phone numbers
- `restaurants` - Restaurant profiles, location (PostGIS), menus
- `menu_items` - Menu items with embeddings (pgvector 1536-dim)
- `orders` - Order records, status lifecycle
- `order_items` - Order line items (many-to-many)
- `deliveries` - Delivery tracking with PostGIS location
- `delivery_workers` - Worker profiles, availability, location
- `payments` - Stripe payment records
- `conversations` - WhatsApp conversation history
- `messages` - Individual messages (linked to conversations)

**Reference:** `docs/implementation/week-1-database-spec.md`

---

## Related Documentation

- [01-setup-configuration.md](./01-setup-configuration.md) - Full Supabase setup
- [02-database-schema.md](./02-database-schema.md) - Complete schema DDL
- [03-pgvector-semantic-search.md](./03-pgvector-semantic-search.md) - Vector search setup
- [04-rls-security.md](./04-rls-security.md) - Row-Level Security policies
- [05-custom-functions-triggers.md](./05-custom-functions-triggers.md) - Database functions

---

**Last Updated**: 2025-10-12
**Database**: PostgreSQL 15.8 + PostGIS + pgvector 0.5.0
**Platform**: Supabase (Edge-compatible transaction pooling)
**Project**: Weats.ai (Three-AI Conversational Food Delivery)
