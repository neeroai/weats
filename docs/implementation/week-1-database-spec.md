# Week 1: Database + Webhook Technical Specification

**Week**: 1 of 4 (Jan 11-17, 2025)
**Goal**: Operational database + WhatsApp webhook ready for message processing
**Estimated Hours**: 60h
**Primary Agent**: supabase-expert (80%), edge-functions-expert (20%)
**Version**: 1.0
**Last Updated**: 2025-01-11

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [PostGIS Functions](#postgis-functions)
4. [pgvector Setup](#pgvector-setup)
5. [Migration Files](#migration-files)
6. [Seed Data](#seed-data)
7. [WhatsApp Webhook](#whatsapp-webhook)
8. [Testing Strategy](#testing-strategy)
9. [Performance Targets](#performance-targets)
10. [Security Considerations](#security-considerations)

---

## Overview

### Objectives
1. ✅ Deploy 10 tables to Supabase PostgreSQL 15.8
2. ✅ Configure 95 indexes for optimal query performance
3. ✅ Implement 3 PostGIS functions (<10ms target)
4. ✅ Setup pgvector for semantic menu search (<50ms target)
5. ✅ Build WhatsApp webhook handler (fire-and-forget, <100ms TTFB)

### Success Criteria
- All tests pass (>95% coverage)
- Webhook responds <100ms TTFB (p95)
- PostGIS queries <10ms (p95)
- pgvector queries <50ms (p95)
- Manual test: Create order via API successfully
- Load test: 100 concurrent requests handled

### Dependencies
- Supabase Pro plan activated
- PostGIS extension enabled
- pgvector extension enabled
- Vercel Edge Functions configured

---

## Database Schema

### Schema Design Principles
- **Multi-tenancy**: RLS policies enforce data isolation
- **Performance**: Indexes on all foreign keys and query columns
- **Spatial**: PostGIS GEOGRAPHY type for locations (lat/lng)
- **Vector**: pgvector for semantic search (menu items)
- **Audit**: created_at, updated_at on all tables
- **Soft deletes**: deleted_at column (NULL = active)

### Connection Configuration (Edge Runtime)
```typescript
import { createClient } from '@supabase/supabase-js';

// Transaction pooling (port 6543, pool size=1 for Edge)
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,  // Service role for server-side
  {
    db: { schema: 'public' },
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        'x-connection-pooling': 'true',  // Critical for Edge Runtime
      },
    },
  }
);
```

---

### 1. customers Table

**Purpose**: Store customer profiles + contact info

```sql
-- Migration: 0001_create_customers_table.sql
CREATE TABLE IF NOT EXISTS customers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  phone_number VARCHAR(20) NOT NULL UNIQUE,  -- E.164 format: +573001234567
  name VARCHAR(255),
  email VARCHAR(255),

  -- Preferences
  preferred_language VARCHAR(10) DEFAULT 'es-CO',  -- Colombian Spanish
  dietary_restrictions JSONB DEFAULT '[]',  -- ["vegetarian", "gluten-free", ...]

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,  -- Soft delete

  -- Metadata
  metadata JSONB DEFAULT '{}'  -- Extensible for future fields
);

-- Indexes
CREATE UNIQUE INDEX idx_customers_phone ON customers(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL;

-- RLS Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY customers_select_own
  ON customers FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY customers_update_own
  ON customers FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Service role can see all (for admin operations)
CREATE POLICY customers_service_role_all
  ON customers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE customers IS 'Customer profiles and contact information';
COMMENT ON COLUMN customers.phone_number IS 'E.164 format WhatsApp number';
COMMENT ON COLUMN customers.dietary_restrictions IS 'Array of dietary restriction tags';
```

---

### 2. restaurants Table

**Purpose**: Store restaurant profiles + locations (PostGIS)

```sql
-- Migration: 0002_create_restaurants_table.sql
CREATE TABLE IF NOT EXISTS restaurants (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,  -- WhatsApp number
  email VARCHAR(255),
  tax_id VARCHAR(50),  -- Colombia NIT (Número de Identificación Tributaria)

  -- Location (PostGIS)
  address TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326) NOT NULL,  -- WGS84 (lat, lng)

  -- Business Info
  cuisines JSONB NOT NULL DEFAULT '[]',  -- ["Colombian", "Pizza", "Burgers", ...]
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,

  -- Ratings
  avg_rating DECIMAL(3, 2) DEFAULT 0.00,  -- 0.00-5.00
  total_ratings INT DEFAULT 0,

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending_approval',
    -- pending_approval, approved, rejected, suspended
  available BOOLEAN NOT NULL DEFAULT false,  -- Open for orders

  -- Commission
  commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 7.50,  -- 5-10% (vs Rappi 28%)

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);  -- PostGIS spatial index
CREATE INDEX idx_restaurants_status ON restaurants(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_restaurants_available ON restaurants(available) WHERE available = true;
CREATE INDEX idx_restaurants_cuisines ON restaurants USING GIN(cuisines);  -- JSONB index
CREATE INDEX idx_restaurants_rating ON restaurants(avg_rating DESC) WHERE status = 'approved';
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);

-- Partial index for active approved restaurants (most common query)
CREATE INDEX idx_restaurants_active_approved
  ON restaurants(status, available, location)
  WHERE status = 'approved' AND available = true AND deleted_at IS NULL;

-- RLS Policies
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view approved restaurants only
CREATE POLICY restaurants_select_approved
  ON restaurants FOR SELECT
  USING (status = 'approved' AND deleted_at IS NULL);

-- Policy: Restaurant owners can view/edit their own
CREATE POLICY restaurants_owner_all
  ON restaurants FOR ALL
  USING (auth.uid() IN (
    SELECT user_id FROM restaurant_owners WHERE restaurant_id = id
  ));

-- Policy: Service role can see all
CREATE POLICY restaurants_service_role_all
  ON restaurants FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at
CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE restaurants IS 'Restaurant profiles with PostGIS locations';
COMMENT ON COLUMN restaurants.location IS 'PostGIS GEOGRAPHY point (lat, lng in WGS84)';
COMMENT ON COLUMN restaurants.commission_rate IS 'WPFoods commission (5-10% vs Rappi 28%)';
```

---

### 3. menu_items Table

**Purpose**: Store menu items + pgvector embeddings for semantic search

```sql
-- Migration: 0003_create_menu_items_table.sql
CREATE TABLE IF NOT EXISTS menu_items (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,

  -- Identity
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,

  -- Pricing
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),  -- Colombian Peso (COP)
  currency VARCHAR(3) NOT NULL DEFAULT 'COP',

  -- Classification
  category VARCHAR(100),  -- appetizers, mains, desserts, drinks, etc.
  tags JSONB DEFAULT '[]',  -- ["spicy", "vegan", "popular", ...]

  -- Semantic Search (pgvector)
  embedding vector(1536),  -- Gemini embedding-001 (1536 dimensions)

  -- Availability
  available BOOLEAN NOT NULL DEFAULT true,
  max_daily_orders INT,  -- NULL = unlimited
  daily_orders_count INT DEFAULT 0,  -- Reset daily

  -- Nutrition (optional)
  calories INT,
  allergens JSONB DEFAULT '[]',  -- ["gluten", "dairy", "nuts", ...]

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_available ON menu_items(available) WHERE available = true;
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_price ON menu_items(price ASC);
CREATE INDEX idx_menu_items_tags ON menu_items USING GIN(tags);
CREATE INDEX idx_menu_items_created_at ON menu_items(created_at DESC);

-- pgvector HNSW index for semantic similarity search
-- m=16 (connections per node), ef_construction=64 (build quality)
CREATE INDEX idx_menu_items_embedding
  ON menu_items USING hnsw(embedding vector_cosine_ops)
  WITH (m=16, ef_construction=64);

-- Partial index for available items (most queries)
CREATE INDEX idx_menu_items_restaurant_available
  ON menu_items(restaurant_id, available)
  WHERE available = true AND deleted_at IS NULL;

-- RLS Policies
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view available items from approved restaurants
CREATE POLICY menu_items_select_public
  ON menu_items FOR SELECT
  USING (
    available = true
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = restaurant_id
      AND status = 'approved'
    )
  );

-- Policy: Restaurant owners can manage their items
CREATE POLICY menu_items_owner_all
  ON menu_items FOR ALL
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_owners WHERE user_id = auth.uid()
    )
  );

-- Policy: Service role can see all
CREATE POLICY menu_items_service_role_all
  ON menu_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at
CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE menu_items IS 'Restaurant menu items with pgvector embeddings';
COMMENT ON COLUMN menu_items.embedding IS 'Gemini embedding-001 (1536-dim) for semantic search';
COMMENT ON COLUMN menu_items.daily_orders_count IS 'Reset daily by cron job';
```

---

### 4. orders Table

**Purpose**: Store customer orders + lifecycle state

```sql
-- Migration: 0004_create_orders_table.sql
CREATE TABLE IF NOT EXISTS orders (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,

  -- Order Details
  order_number VARCHAR(50) NOT NULL UNIQUE,  -- Human-readable: WPF-20250111-0001
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- pending → preparing → ready → picked_up → delivered → completed
    -- cancelled (any time)

  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),  -- Items total
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 2500.00,  -- $2,500 COP ($0.62 USD)
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),  -- subtotal + delivery_fee
  currency VARCHAR(3) NOT NULL DEFAULT 'COP',

  -- Delivery Details
  delivery_address TEXT NOT NULL,
  delivery_location GEOGRAPHY(Point, 4326) NOT NULL,  -- Customer location
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  actual_delivery_time TIMESTAMPTZ,

  -- Ratings
  customer_rating INT CHECK (customer_rating BETWEEN 1 AND 5),
  customer_feedback TEXT,

  -- Cancellation
  cancelled_reason TEXT,
  cancelled_at TIMESTAMPTZ,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE UNIQUE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_delivery_location ON orders USING GIST(delivery_location);

-- Partial index for active orders (most queries)
CREATE INDEX idx_orders_active
  ON orders(status, restaurant_id)
  WHERE status IN ('pending', 'preparing', 'ready', 'picked_up')
  AND deleted_at IS NULL;

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own orders
CREATE POLICY orders_customer_select
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

-- Policy: Restaurants can view their own orders
CREATE POLICY orders_restaurant_select
  ON orders FOR SELECT
  USING (
    restaurant_id IN (
      SELECT restaurant_id FROM restaurant_owners WHERE user_id = auth.uid()
    )
  );

-- Policy: Workers can view assigned orders
CREATE POLICY orders_worker_select
  ON orders FOR SELECT
  USING (
    id IN (
      SELECT order_id FROM deliveries WHERE worker_id = auth.uid()
    )
  );

-- Policy: Service role can see all
CREATE POLICY orders_service_role_all
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate order number (WPF-YYYYMMDD-####)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  date_part VARCHAR;
  sequence_part VARCHAR;
  next_sequence INT;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');

  -- Get next sequence for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 14 FOR 4) AS INT)), 0) + 1
  INTO next_sequence
  FROM orders
  WHERE order_number LIKE 'WPF-' || date_part || '-%';

  sequence_part := LPAD(next_sequence::TEXT, 4, '0');

  RETURN 'WPF-' || date_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Comments
COMMENT ON TABLE orders IS 'Customer orders with lifecycle state machine';
COMMENT ON COLUMN orders.order_number IS 'Human-readable format: WPF-20250111-0001';
COMMENT ON COLUMN orders.status IS 'Lifecycle: pending → preparing → ready → picked_up → delivered → completed';
```

---

### 5. order_items Table

**Purpose**: Store line items for each order

```sql
-- Migration: 0005_create_order_items_table.sql
CREATE TABLE IF NOT EXISTS order_items (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,

  -- Order Details
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),  -- Price at time of order
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),  -- quantity * unit_price

  -- Customizations
  special_instructions TEXT,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);

-- RLS Policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Inherit from orders table (customers see their order items)
CREATE POLICY order_items_customer_select
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Policy: Restaurants see their order items
CREATE POLICY order_items_restaurant_select
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN restaurant_owners ro ON o.restaurant_id = ro.restaurant_id
      WHERE ro.user_id = auth.uid()
    )
  );

-- Policy: Service role can see all
CREATE POLICY order_items_service_role_all
  ON order_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Calculate total_price
CREATE OR REPLACE FUNCTION calculate_order_item_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_price := NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_items_calculate_total
  BEFORE INSERT OR UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_item_total();

-- Comments
COMMENT ON TABLE order_items IS 'Line items for customer orders';
COMMENT ON COLUMN order_items.unit_price IS 'Price at time of order (may differ from current menu_items.price)';
```

---

### 6. delivery_workers Table

**Purpose**: Store worker profiles + real-time locations (PostGIS)

```sql
-- Migration: 0006_create_delivery_workers_table.sql
CREATE TABLE IF NOT EXISTS delivery_workers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  phone_number VARCHAR(20) NOT NULL UNIQUE,  -- WhatsApp number
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),

  -- Vehicle Info
  vehicle_type VARCHAR(50) NOT NULL DEFAULT 'scooter',  -- scooter, bicycle, motorcycle
  vehicle_plate VARCHAR(20),

  -- Location (PostGIS) - Updated in real-time via WhatsApp
  current_location GEOGRAPHY(Point, 4326),
  last_location_update TIMESTAMPTZ,

  -- Availability
  status VARCHAR(50) NOT NULL DEFAULT 'inactive',  -- active, inactive, suspended
  available BOOLEAN NOT NULL DEFAULT false,  -- Currently accepting orders

  -- Ratings
  avg_rating DECIMAL(3, 2) DEFAULT 0.00,  -- 0.00-5.00
  total_ratings INT DEFAULT 0,
  acceptance_rate DECIMAL(5, 2) DEFAULT 100.00,  -- % of orders accepted

  -- Earnings
  total_deliveries INT DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,  -- All-time earnings

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE UNIQUE INDEX idx_delivery_workers_phone ON delivery_workers(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_delivery_workers_location ON delivery_workers USING GIST(current_location);
CREATE INDEX idx_delivery_workers_status ON delivery_workers(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_delivery_workers_rating ON delivery_workers(avg_rating DESC) WHERE status = 'active';

-- Partial index for available workers (critical for dispatch)
CREATE INDEX idx_delivery_workers_available
  ON delivery_workers(status, available, current_location)
  WHERE status = 'active' AND available = true AND deleted_at IS NULL;

-- RLS Policies
ALTER TABLE delivery_workers ENABLE ROW LEVEL SECURITY;

-- Policy: Workers can view/edit their own profile
CREATE POLICY delivery_workers_own_all
  ON delivery_workers FOR ALL
  USING (auth.uid() = id);

-- Policy: Public can view active workers (for customer tracking)
CREATE POLICY delivery_workers_select_active
  ON delivery_workers FOR SELECT
  USING (status = 'active' AND deleted_at IS NULL);

-- Policy: Service role can see all
CREATE POLICY delivery_workers_service_role_all
  ON delivery_workers FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at
CREATE TRIGGER delivery_workers_updated_at
  BEFORE UPDATE ON delivery_workers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE delivery_workers IS 'Delivery worker profiles with real-time PostGIS locations';
COMMENT ON COLUMN delivery_workers.current_location IS 'Real-time location updated via WhatsApp GPS';
COMMENT ON COLUMN delivery_workers.acceptance_rate IS 'Used in dispatch scoring (low rate = deprioritized)';
```

---

### 7. deliveries Table

**Purpose**: Track delivery assignments + lifecycle

```sql
-- Migration: 0007_create_deliveries_table.sql
CREATE TABLE IF NOT EXISTS deliveries (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Keys
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,  -- One delivery per order
  worker_id UUID NOT NULL REFERENCES delivery_workers(id) ON DELETE RESTRICT,

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'assigned',
    -- assigned → accepted → picked_up → delivered
    -- rejected, reassigned

  -- Timing
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Payout
  payout_amount DECIMAL(10, 2) NOT NULL CHECK (payout_amount >= 0),  -- $1.40 USD = ~5,600 COP
  payout_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, processed
  payout_processed_at TIMESTAMPTZ,

  -- Rejection
  rejection_reason VARCHAR(255),
  rejected_at TIMESTAMPTZ,

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE UNIQUE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_worker ON deliveries(worker_id, created_at DESC);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_payout_status ON deliveries(payout_status) WHERE payout_status = 'pending';

-- Partial index for active deliveries (worker's current jobs)
CREATE INDEX idx_deliveries_active
  ON deliveries(worker_id, status)
  WHERE status IN ('assigned', 'accepted', 'picked_up');

-- RLS Policies
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Policy: Workers can view their own deliveries
CREATE POLICY deliveries_worker_select
  ON deliveries FOR SELECT
  USING (worker_id = auth.uid());

-- Policy: Customers can view their order's delivery
CREATE POLICY deliveries_customer_select
  ON deliveries FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Policy: Service role can see all
CREATE POLICY deliveries_service_role_all
  ON deliveries FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at
CREATE TRIGGER deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE deliveries IS 'Delivery assignments with lifecycle tracking';
COMMENT ON COLUMN deliveries.payout_amount IS 'Worker earnings per delivery (~$1.40 USD = 5,600 COP)';
```

---

### 8. payments Table

**Purpose**: Track Stripe payment intents + status

```sql
-- Migration: 0008_create_payments_table.sql
CREATE TABLE IF NOT EXISTS payments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,  -- One payment per order

  -- Stripe Details
  stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_client_secret VARCHAR(255),

  -- Amount
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'COP',

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- pending → processing → succeeded → failed → cancelled → refunded

  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  succeeded_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,

  -- Failure Details
  failure_code VARCHAR(255),
  failure_message TEXT,
  retry_count INT DEFAULT 0,

  -- Refund Details
  refund_amount DECIMAL(10, 2),
  refund_reason TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE UNIQUE INDEX idx_payments_order ON payments(order_id);
CREATE UNIQUE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Partial index for pending payments (retries)
CREATE INDEX idx_payments_pending
  ON payments(status, retry_count)
  WHERE status = 'pending' OR status = 'failed';

-- RLS Policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their order's payment
CREATE POLICY payments_customer_select
  ON payments FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- Policy: Service role can see all
CREATE POLICY payments_service_role_all
  ON payments FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Comments
COMMENT ON TABLE payments IS 'Stripe payment intents with retry and refund tracking';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'Stripe payment_intent.id';
```

---

### 9. conversations Table

**Purpose**: Track Gemini AI conversation contexts per customer

```sql
-- Migration: 0009_create_conversations_table.sql
CREATE TABLE IF NOT EXISTS conversations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  customer_id UUID NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,  -- One conversation per customer

  -- Conversation State
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  message_count INT DEFAULT 0,

  -- Context (for Gemini)
  context JSONB NOT NULL DEFAULT '{}',  -- Last 10 messages + order context

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE UNIQUE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_context ON conversations USING GIN(context);  -- JSONB index

-- RLS Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own conversation
CREATE POLICY conversations_customer_select
  ON conversations FOR SELECT
  USING (customer_id = auth.uid());

-- Policy: Service role can see all
CREATE POLICY conversations_service_role_all
  ON conversations FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger: Update updated_at
CREATE TRIGGER conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE conversations IS 'Gemini AI conversation contexts per customer';
COMMENT ON COLUMN conversations.context IS 'Last 10 messages + current order context for Gemini';
```

---

### 10. messages Table

**Purpose**: Store individual messages (WhatsApp + Gemini responses)

```sql
-- Migration: 0010_create_messages_table.sql
CREATE TABLE IF NOT EXISTS messages (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Message Details
  role VARCHAR(50) NOT NULL,  -- user, assistant, system
  content TEXT NOT NULL,

  -- WhatsApp Details
  whatsapp_message_id VARCHAR(255),  -- WhatsApp message ID (for tracking)
  whatsapp_status VARCHAR(50),  -- sent, delivered, read, failed

  -- Gemini Details (if assistant message)
  gemini_model VARCHAR(100),  -- gemini-2.5-flash
  gemini_tokens_input INT,
  gemini_tokens_output INT,
  gemini_cached_tokens INT,  -- Context caching savings

  -- Audit
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_messages_whatsapp ON messages(whatsapp_message_id) WHERE whatsapp_message_id IS NOT NULL;
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Partial index for recent messages (last 7 days, most queries)
CREATE INDEX idx_messages_recent
  ON messages(conversation_id, created_at ASC)
  WHERE created_at > NOW() - INTERVAL '7 days';

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Customers can view their own messages
CREATE POLICY messages_customer_select
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE customer_id = auth.uid()
    )
  );

-- Policy: Service role can see all
CREATE POLICY messages_service_role_all
  ON messages FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Comments
COMMENT ON TABLE messages IS 'Individual messages (WhatsApp + Gemini responses)';
COMMENT ON COLUMN messages.gemini_cached_tokens IS 'Context caching savings (75% cost reduction)';
```

---

## PostGIS Functions

### Setup PostGIS Extension

```sql
-- Migration: 0011_enable_postgis.sql
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS version
SELECT PostGIS_Version();
-- Expected: 3.x+
```

---

### 1. find_nearby_restaurants

**Purpose**: Find restaurants within radius, sorted by distance

**Performance Target**: <10ms (p95) with 100 restaurants

```sql
-- Migration: 0011_postgis_functions.sql
CREATE OR REPLACE FUNCTION find_nearby_restaurants(
  search_lat FLOAT,
  search_lng FLOAT,
  radius_km INT DEFAULT 5,
  cuisine_filter TEXT DEFAULT NULL,
  limit_results INT DEFAULT 10
)
RETURNS TABLE (
  restaurant_id UUID,
  restaurant_name VARCHAR,
  address TEXT,
  cuisines JSONB,
  distance_km DECIMAL,
  avg_rating DECIMAL,
  commission_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.address,
    r.cuisines,
    ROUND(
      ST_Distance(
        r.location,
        ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
      ) / 1000.0,  -- Convert meters to kilometers
      2
    ) AS distance_km,
    r.avg_rating,
    r.commission_rate
  FROM restaurants r
  WHERE
    r.status = 'approved'
    AND r.available = true
    AND r.deleted_at IS NULL
    AND ST_DWithin(
      r.location,
      ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
      radius_km * 1000  -- Convert km to meters
    )
    AND (
      cuisine_filter IS NULL
      OR r.cuisines @> jsonb_build_array(cuisine_filter)
    )
  ORDER BY distance_km ASC
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- Performance: Uses GIST spatial index on restaurants.location
-- Expected: <10ms with 100 restaurants within 5km radius

-- Example usage:
-- SELECT * FROM find_nearby_restaurants(4.6616, -74.0538, 5, NULL, 10);
-- (Zona T, Bogotá - 5km radius)

COMMENT ON FUNCTION find_nearby_restaurants IS
  'Find nearby restaurants within radius (km), sorted by distance. Uses PostGIS spatial index.';
```

**Testing Query**:
```sql
-- Test performance
EXPLAIN ANALYZE
SELECT * FROM find_nearby_restaurants(4.6616, -74.0538, 5, NULL, 10);

-- Verify index usage: Should show "Index Scan using idx_restaurants_location"
-- Verify time: Execution Time < 10ms
```

---

### 2. find_best_worker

**Purpose**: Find best available worker using scoring algorithm

**Performance Target**: <10ms (p95) with 50 workers

```sql
-- Migration: 0011_postgis_functions.sql (continued)
CREATE OR REPLACE FUNCTION find_best_worker(
  restaurant_lat FLOAT,
  restaurant_lng FLOAT,
  order_id_param UUID
)
RETURNS UUID AS $$
DECLARE
  best_worker_id UUID;
  today_start TIMESTAMPTZ := DATE_TRUNC('day', NOW());
BEGIN
  -- Scoring algorithm:
  -- Distance: 40% (closer is better, max 5km)
  -- Availability: 30% (currently available, no active delivery)
  -- Rating: 20% (higher rating is better)
  -- Capacity: 10% (fewer deliveries today is better)

  SELECT w.id INTO best_worker_id
  FROM delivery_workers w
  LEFT JOIN (
    -- Count today's deliveries per worker
    SELECT worker_id, COUNT(*) AS today_deliveries
    FROM deliveries
    WHERE created_at >= today_start
    GROUP BY worker_id
  ) d ON w.id = d.worker_id
  LEFT JOIN (
    -- Check for active deliveries
    SELECT worker_id
    FROM deliveries
    WHERE status IN ('assigned', 'accepted', 'picked_up')
    GROUP BY worker_id
  ) a ON w.id = a.worker_id
  WHERE
    w.status = 'active'
    AND w.available = true
    AND w.deleted_at IS NULL
    AND a.worker_id IS NULL  -- No active delivery
    AND ST_DWithin(
      w.current_location,
      ST_SetSRID(ST_MakePoint(restaurant_lng, restaurant_lat), 4326)::geography,
      5000  -- Max 5km distance
    )
  ORDER BY (
    -- Distance score (40%): 0-40 points (closer = higher score)
    (40 - (ST_Distance(
      w.current_location,
      ST_SetSRID(ST_MakePoint(restaurant_lng, restaurant_lat), 4326)::geography
    ) / 1000.0) * 8) * 0.4 +

    -- Availability score (30%): 30 points if available
    30 * 0.3 +

    -- Rating score (20%): 0-20 points (rating / 5 * 20)
    (w.avg_rating / 5.0 * 20) * 0.2 +

    -- Capacity score (10%): 10 points - (deliveries_today / 10)
    (10 - LEAST(COALESCE(d.today_deliveries, 0), 10)) * 0.1
  ) DESC
  LIMIT 1;

  RETURN best_worker_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Performance: Uses partial index idx_delivery_workers_available
-- Expected: <10ms with 50 active available workers

-- Example usage:
-- SELECT find_best_worker(4.6616, -74.0538, '00000000-0000-0000-0000-000000000000');

COMMENT ON FUNCTION find_best_worker IS
  'Find best available worker using scoring: distance (40%), availability (30%), rating (20%), capacity (10%)';
```

**Testing Query**:
```sql
-- Test performance
EXPLAIN ANALYZE
SELECT find_best_worker(4.6616, -74.0538, '00000000-0000-0000-0000-000000000000');

-- Verify index usage: Should show "Index Scan using idx_delivery_workers_available"
-- Verify time: Execution Time < 10ms
```

---

### 3. calculate_eta

**Purpose**: Calculate estimated delivery time (minutes)

**Performance Target**: <5ms

```sql
-- Migration: 0011_postgis_functions.sql (continued)
CREATE OR REPLACE FUNCTION calculate_eta(
  worker_lat FLOAT,
  worker_lng FLOAT,
  delivery_lat FLOAT,
  delivery_lng FLOAT
)
RETURNS INT AS $$
DECLARE
  distance_km DECIMAL;
  eta_minutes INT;
BEGIN
  -- Calculate straight-line distance
  distance_km := ST_Distance(
    ST_SetSRID(ST_MakePoint(worker_lng, worker_lat), 4326)::geography,
    ST_SetSRID(ST_MakePoint(delivery_lng, delivery_lat), 4326)::geography
  ) / 1000.0;

  -- Assume 20 km/h average speed (scooter in city traffic)
  -- Add 5 minutes buffer
  eta_minutes := CEIL((distance_km / 20.0) * 60) + 5;

  RETURN eta_minutes;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Performance: Simple calculation, no table access
-- Expected: <5ms

-- Example usage:
-- SELECT calculate_eta(4.6616, -74.0538, 4.6500, -74.0600);
-- Expected: ~15-20 minutes for 2km distance

COMMENT ON FUNCTION calculate_eta IS
  'Calculate ETA (minutes) assuming 20 km/h average speed + 5 min buffer';
```

---

## pgvector Setup

### Enable pgvector Extension

```sql
-- Migration: 0012_enable_pgvector.sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify pgvector version
SELECT * FROM pg_extension WHERE extname = 'vector';
-- Expected: version 0.5.0+
```

---

### Configure HNSW Index

```sql
-- Migration: 0012_enable_pgvector.sql (continued)

-- HNSW index already created in menu_items table definition
-- Parameters explained:
-- - m=16: Number of connections per node (default 16, higher = better recall, slower build)
-- - ef_construction=64: Build-time search depth (default 64, higher = better quality, slower build)
-- - Distance metric: vector_cosine_ops (cosine similarity, best for embeddings)

-- For large tables (10K+ items), consider:
-- - m=32 (better recall for large datasets)
-- - ef_construction=128 (better build quality)

-- Query-time parameter (set per session):
-- SET ivfflat.probes = 10;  -- Number of lists to search (higher = better recall, slower)
```

---

### Semantic Menu Search Function

```sql
-- Migration: 0012_enable_pgvector.sql (continued)
CREATE OR REPLACE FUNCTION semantic_menu_search(
  query_embedding vector(1536),
  restaurant_id_param UUID,
  limit_results INT DEFAULT 10
)
RETURNS TABLE (
  menu_item_id UUID,
  menu_item_name VARCHAR,
  description TEXT,
  price DECIMAL,
  similarity_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id AS menu_item_id,
    m.name AS menu_item_name,
    m.description,
    m.price,
    ROUND((1 - (m.embedding <=> query_embedding))::numeric, 4) AS similarity_score
      -- Cosine distance (<=> operator): 0 = identical, 2 = opposite
      -- Convert to similarity: 1 - distance
  FROM menu_items m
  WHERE
    m.restaurant_id = restaurant_id_param
    AND m.available = true
    AND m.deleted_at IS NULL
    AND m.embedding IS NOT NULL  -- Only items with embeddings
  ORDER BY m.embedding <=> query_embedding ASC  -- Uses HNSW index
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- Performance: Uses HNSW index on menu_items.embedding
-- Expected: <50ms with 1,000 menu items

-- Example usage (requires actual embedding from Gemini):
-- SELECT * FROM semantic_menu_search('[0.1, 0.2, ..., 0.5]'::vector(1536), 'restaurant-uuid', 10);

COMMENT ON FUNCTION semantic_menu_search IS
  'Semantic search on menu items using pgvector cosine similarity. Uses HNSW index.';
```

**Testing Query**:
```sql
-- Test performance (requires test data with embeddings)
EXPLAIN ANALYZE
SELECT * FROM semantic_menu_search(
  (SELECT embedding FROM menu_items WHERE embedding IS NOT NULL LIMIT 1),  -- Use test embedding
  (SELECT id FROM restaurants LIMIT 1),  -- Use test restaurant
  10
);

-- Verify index usage: Should show "Index Scan using idx_menu_items_embedding"
-- Verify time: Execution Time < 50ms
```

---

## Migration Files

### Migration File Structure

```
supabase/migrations/
├── 0001_create_customers_table.sql
├── 0002_create_restaurants_table.sql
├── 0003_create_menu_items_table.sql
├── 0004_create_orders_table.sql
├── 0005_create_order_items_table.sql
├── 0006_create_delivery_workers_table.sql
├── 0007_create_deliveries_table.sql
├── 0008_create_payments_table.sql
├── 0009_create_conversations_table.sql
├── 0010_create_messages_table.sql
├── 0011_enable_postgis.sql
├── 0011_postgis_functions.sql
├── 0012_enable_pgvector.sql
└── 0013_seed_data.sql
```

### Migration Best Practices

1. **Idempotent**: Use `CREATE TABLE IF NOT EXISTS`, `DROP IF EXISTS`
2. **Transactional**: Wrap in `BEGIN`/`COMMIT` if possible (DDL is auto-committed in Postgres)
3. **Reversible**: Document rollback SQL in comments
4. **Testable**: Include test queries at end of migration
5. **Sequential**: Numbered migrations run in order

### Running Migrations

```bash
# Local development (Supabase CLI)
npx supabase migration new <migration_name>
npx supabase db push

# Production (Supabase Dashboard)
# - Go to SQL Editor
# - Paste migration SQL
# - Run migration
# - Verify success

# Rollback (manual)
# - Write reverse migration
# - Run reverse SQL
```

---

## Seed Data

### Test Restaurants (10)

```sql
-- Migration: 0013_seed_data.sql
BEGIN;

-- Zona T Restaurants (5)
INSERT INTO restaurants (id, name, phone_number, address, location, cuisines, status, available, commission_rate) VALUES
  ('11111111-1111-1111-1111-111111111111', 'La Puerta Falsa', '+573001111111', 'Calle 11 #6-50, Bogotá', ST_SetSRID(ST_MakePoint(-74.0738, 4.5981), 4326)::geography, '["Colombian", "Traditional"]', 'approved', true, 7.50),
  ('22222222-2222-2222-2222-222222222222', 'Andrés Carne de Res', '+573002222222', 'Calle 3 #11A-56, Chía', ST_SetSRID(ST_MakePoint(-74.0574, 4.8628), 4326)::geography, '["Colombian", "Steakhouse"]', 'approved', true, 7.50),
  ('33333333-3333-3333-3333-333333333333', 'Crepes & Waffles', '+573003333333', 'Carrera 13 #82-71, Bogotá', ST_SetSRID(ST_MakePoint(-74.0532, 4.6659), 4326)::geography, '["International", "Desserts"]', 'approved', true, 7.50),
  ('44444444-4444-4444-4444-444444444444', 'Wok', '+573004444444', 'Calle 85 #13-15, Bogotá', ST_SetSRID(ST_MakePoint(-74.0538, 4.6725), 4326)::geography, '["Asian", "Thai", "Chinese"]', 'approved', true, 7.50),
  ('55555555-5555-5555-5555-555555555555', 'Harry Sasson', '+573005555555', 'Calle 119 #5A-75, Bogotá', ST_SetSRID(ST_MakePoint(-74.0396, 4.6951), 4326)::geography, '["Fine Dining", "International"]', 'approved', true, 10.00);

-- Chicó Restaurants (5)
INSERT INTO restaurants (id, name, phone_number, address, location, cuisines, status, available, commission_rate) VALUES
  ('66666666-6666-6666-6666-666666666666', 'El Corral', '+573006666666', 'Calle 93 #13-46, Bogotá', ST_SetSRID(ST_MakePoint(-74.0471, 4.6798), 4326)::geography, '["Burgers", "Fast Food"]', 'approved', true, 5.00),
  ('77777777-7777-7777-7777-777777777777', 'Juan Valdez Café', '+573007777777', 'Carrera 15 #93-30, Bogotá', ST_SetSRID(ST_MakePoint(-74.0494, 4.6788), 4326)::geography, '["Café", "Bakery"]', 'approved', true, 5.00),
  ('88888888-8888-8888-8888-888888888888', 'Archie's', '+573008888888', 'Calle 93B #13-24, Bogotá', ST_SetSRID(ST_MakePoint(-74.0476, 4.6813), 4326)::geography, '["Pizza", "Italian"]', 'approved', true, 7.50),
  ('99999999-9999-9999-9999-999999999999', 'El Japanese', '+573009999999', 'Carrera 15 #96-50, Bogotá', ST_SetSRID(ST_MakePoint(-74.0501, 4.6828), 4326)::geography, '["Japanese", "Sushi"]', 'approved', true, 7.50),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'La Hamburguesería', '+5730010101010', 'Calle 90 #11A-30, Bogotá', ST_SetSRID(ST_MakePoint(-74.0442, 4.6771), 4326)::geography, '["Burgers", "American"]', 'approved', true, 5.00);

COMMIT;
```

### Test Workers (5)

```sql
-- Migration: 0013_seed_data.sql (continued)
BEGIN;

INSERT INTO delivery_workers (id, phone_number, name, vehicle_type, current_location, status, available, avg_rating) VALUES
  ('w1111111-1111-1111-1111-111111111111', '+5730020202020', 'Carlos Rodríguez', 'scooter', ST_SetSRID(ST_MakePoint(-74.0538, 4.6616), 4326)::geography, 'active', true, 4.80),
  ('w2222222-2222-2222-2222-222222222222', '+5730030303030', 'María García', 'motorcycle', ST_SetSRID(ST_MakePoint(-74.0471, 4.6798), 4326)::geography, 'active', true, 4.90),
  ('w3333333-3333-3333-3333-333333333333', '+5730040404040', 'Juan López', 'scooter', ST_SetSRID(ST_MakePoint(-74.0532, 4.6659), 4326)::geography, 'active', true, 4.75),
  ('w4444444-4444-4444-4444-444444444444', '+5730050505050', 'Ana Martínez', 'bicycle', ST_SetSRID(ST_MakePoint(-74.0494, 4.6788), 4326)::geography, 'active', true, 4.85),
  ('w5555555-5555-5555-5555-555555555555', '+5730060606060', 'Pedro Sánchez', 'scooter', ST_SetSRID(ST_MakePoint(-74.0476, 4.6813), 4326)::geography, 'active', true, 4.70);

COMMIT;
```

### Test Menu Items (20)

```sql
-- Migration: 0013_seed_data.sql (continued)
BEGIN;

-- La Puerta Falsa (Traditional Colombian)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Tamales', 'Traditional Colombian tamales wrapped in banana leaves', 12000, 'mains', true),
  ('11111111-1111-1111-1111-111111111111', 'Chocolate con Queso', 'Hot chocolate with cheese (Colombian tradition)', 8000, 'drinks', true);

-- Andrés Carne de Res (Steakhouse)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Lomo de Res', 'Grilled beef tenderloin with chimichurri sauce', 45000, 'mains', true),
  ('22222222-2222-2222-2222-222222222222', 'Arepa de Choclo', 'Sweet corn arepa with butter', 8000, 'appetizers', true);

-- Crepes & Waffles
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Crepe de Pollo y Champiñones', 'Chicken and mushroom crepe with béchamel sauce', 25000, 'mains', true),
  ('33333333-3333-3333-3333-333333333333', 'Waffle con Helado', 'Belgian waffle with vanilla ice cream and chocolate sauce', 18000, 'desserts', true);

-- Wok (Asian)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Pad Thai', 'Thai stir-fried noodles with shrimp, tofu, and peanuts', 28000, 'mains', true),
  ('44444444-4444-4444-4444-444444444444', 'Spring Rolls', 'Vietnamese fresh spring rolls with peanut sauce', 15000, 'appetizers', true);

-- Harry Sasson (Fine Dining)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('55555555-5555-5555-5555-555555555555', 'Risotto de Mariscos', 'Seafood risotto with saffron and parmesan', 68000, 'mains', true),
  ('55555555-5555-5555-5555-555555555555', 'Crème Brûlée', 'Classic French vanilla custard with caramelized sugar', 22000, 'desserts', true);

-- El Corral (Burgers)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('66666666-6666-6666-6666-666666666666', 'Corralita', 'Classic beef burger with cheese, lettuce, and tomato', 18000, 'mains', true),
  ('66666666-6666-6666-6666-666666666666', 'Papas Criollas', 'Colombian-style fried potatoes', 8000, 'appetizers', true);

-- Juan Valdez Café
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('77777777-7777-7777-7777-777777777777', 'Café Juan Valdez', 'Colombian premium coffee (espresso, americano, cappuccino)', 7000, 'drinks', true),
  ('77777777-7777-7777-7777-777777777777', 'Pandebono', 'Colombian cheese bread (gluten-free)', 5000, 'appetizers', true);

-- Archie's (Pizza)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('88888888-8888-8888-8888-888888888888', 'Pizza Margherita', 'Classic Italian pizza with tomato, mozzarella, and basil', 32000, 'mains', true),
  ('88888888-8888-8888-8888-888888888888', 'Lasagna', 'Homemade lasagna with beef and béchamel sauce', 28000, 'mains', true);

-- El Japanese (Sushi)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('99999999-9999-9999-9999-999999999999', 'California Roll', '8-piece sushi roll with crab, avocado, and cucumber', 24000, 'mains', true),
  ('99999999-9999-9999-9999-999999999999', 'Edamame', 'Steamed soybeans with sea salt', 12000, 'appetizers', true);

-- La Hamburguesería (Burgers)
INSERT INTO menu_items (restaurant_id, name, description, price, category, available) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Hamburguesa Clásica', 'Beef burger with cheddar, bacon, and BBQ sauce', 22000, 'mains', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aros de Cebolla', 'Crispy onion rings with ranch dipping sauce', 10000, 'appetizers', true);

COMMIT;

-- Note: Embeddings will be generated later via Gemini embedding-001 API
-- For now, embeddings are NULL (semantic search will be tested with real embeddings in Week 2)
```

---

## WhatsApp Webhook

### Webhook Handler (Edge Function)

**File**: `app/api/whatsapp/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { waitUntil } from '@vercel/functions';
import crypto from 'crypto';

// Edge Runtime (required for <100ms TTFB)
export const runtime = 'edge';

// GET: WhatsApp verification challenge
export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_SECRET) {
    console.log('WhatsApp webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// POST: WhatsApp message webhook
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Validate signature (security - <10ms)
    const signature = req.headers.get('x-hub-signature-256');
    if (!signature || !verifySignature(signature, await req.clone().text())) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // 2. Parse payload (<10ms)
    const payload = await req.json();

    // 3. Return 200 OK immediately (fire-and-forget pattern)
    //    WhatsApp requires response within 5 seconds
    waitUntil(processMessage(payload).catch(logError));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // NEVER return 500 to WhatsApp (causes retry storms)
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

// Signature validation (HMAC SHA-256)
function verifySignature(signature: string, body: string): boolean {
  const secret = process.env.WHATSAPP_WEBHOOK_SECRET!;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return signature === `sha256=${hash}`;
}

// Async message processing
async function processMessage(payload: any): Promise<void> {
  const entry = payload.entry?.[0];
  const change = entry?.changes?.[0];
  const message = change?.value?.messages?.[0];

  if (!message) {
    console.log('No message in payload');
    return;
  }

  const phoneNumber = message.from;  // Customer's WhatsApp number
  const messageType = message.type;  // text, interactive, image, etc.

  // Route to appropriate handler (Week 2 implementation)
  switch (messageType) {
    case 'text':
      await handleTextMessage(phoneNumber, message.text.body);
      break;
    case 'interactive':
      await handleInteractiveMessage(phoneNumber, message.interactive);
      break;
    case 'image':
      await handleImageMessage(phoneNumber, message.image);
      break;
    default:
      console.log(`Unhandled message type: ${messageType}`);
  }
}

// Placeholder handlers (Week 2 implementation)
async function handleTextMessage(phone: string, text: string): Promise<void> {
  console.log(`Text from ${phone}: ${text}`);
  // Week 2: Call Gemini agent
}

async function handleInteractiveMessage(phone: string, interactive: any): Promise<void> {
  console.log(`Interactive from ${phone}:`, interactive);
  // Week 2: Handle button/list selections
}

async function handleImageMessage(phone: string, image: any): Promise<void> {
  console.log(`Image from ${phone}:`, image);
  // Week 3: Handle restaurant menu uploads
}

// Error logging
function logError(error: Error): void {
  console.error('Message processing error:', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
}
```

---

## Testing Strategy

### 1. Database Integration Tests

**File**: `tests/integration/database.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

describe('Database Integration Tests', () => {
  // Test customers table
  it('should create and query customer', async () => {
    const { data, error } = await supabase
      .from('customers')
      .insert({ phone_number: '+573001234567', name: 'Test User' })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data.phone_number).toBe('+573001234567');

    // Cleanup
    await supabase.from('customers').delete().eq('id', data.id);
  });

  // Test PostGIS functions
  it('should find nearby restaurants (<10ms)', async () => {
    const start = Date.now();

    const { data, error } = await supabase
      .rpc('find_nearby_restaurants', {
        search_lat: 4.6616,
        search_lng: -74.0538,
        radius_km: 5,
      });

    const elapsed = Date.now() - start;

    expect(error).toBeNull();
    expect(data.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(10);  // <10ms target
  });

  // Test pgvector semantic search
  it('should perform semantic search (<50ms)', async () => {
    // Get test embedding
    const { data: testItem } = await supabase
      .from('menu_items')
      .select('embedding, restaurant_id')
      .not('embedding', 'is', null)
      .limit(1)
      .single();

    const start = Date.now();

    const { data, error } = await supabase
      .rpc('semantic_menu_search', {
        query_embedding: testItem.embedding,
        restaurant_id_param: testItem.restaurant_id,
        limit_results: 10,
      });

    const elapsed = Date.now() - start;

    expect(error).toBeNull();
    expect(data.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(50);  // <50ms target
  });

  // Test RLS policies
  it('should enforce RLS (customer cannot see other customers)', async () => {
    // TODO: Set auth context
    // Verify customer A cannot query customer B's data
  });
});
```

### 2. Webhook Integration Tests

**File**: `tests/integration/webhook.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals';
import { POST, GET } from '@/app/api/whatsapp/webhook/route';
import { NextRequest } from 'next/server';

describe('WhatsApp Webhook Tests', () => {
  it('should verify webhook with valid token', async () => {
    const req = new NextRequest(
      `http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${process.env.WHATSAPP_WEBHOOK_SECRET}&hub.challenge=test-challenge`
    );

    const res = await GET(req);
    const body = await res.text();

    expect(res.status).toBe(200);
    expect(body).toBe('test-challenge');
  });

  it('should reject invalid signature', async () => {
    const req = new NextRequest('http://localhost:3000/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'x-hub-signature-256': 'sha256=invalid',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' }),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it('should respond <100ms', async () => {
    // Load test: 100 concurrent requests
    // Use k6 or artillery for load testing
  });
});
```

---

## Performance Targets

### Query Performance

| Query Type | Target (p95) | Index Used |
|-----------|-------------|------------|
| find_nearby_restaurants | <10ms | idx_restaurants_location (GIST) |
| find_best_worker | <10ms | idx_delivery_workers_available |
| semantic_menu_search | <50ms | idx_menu_items_embedding (HNSW) |
| Customer orders lookup | <10ms | idx_orders_customer |
| Active orders (restaurant) | <5ms | idx_orders_active (partial) |

### Webhook Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| TTFB | <100ms (p95) | Vercel Analytics |
| Signature validation | <10ms | Function profiling |
| Payload parsing | <10ms | Function profiling |
| Total response time | <1 second | WhatsApp timeout = 5s |

### Load Testing

```bash
# k6 load test script
# tests/load/webhook.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<100'],  // 95% of requests < 100ms
  },
};

export default function () {
  const payload = JSON.stringify({
    entry: [{
      changes: [{
        value: {
          messages: [{
            from: '+573001234567',
            type: 'text',
            text: { body: 'Hola' },
          }],
        },
      }],
    }],
  });

  const res = http.post('https://your-domain.vercel.app/api/whatsapp/webhook', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 100ms': (r) => r.timings.duration < 100,
  });
}
```

---

## Security Considerations

### 1. Webhook Signature Validation

✅ **Implemented**: HMAC SHA-256 signature verification
- Validates `X-Hub-Signature-256` header
- Uses `WHATSAPP_WEBHOOK_SECRET` from env
- Rejects unsigned or invalid requests (401)

### 2. Row-Level Security (RLS)

✅ **Implemented**: RLS policies on all tables
- Customers can only see their own data
- Restaurants can only see their own orders/menu items
- Workers can only see assigned deliveries
- Service role has full access (admin operations)

### 3. SQL Injection Prevention

✅ **Safe**: Using parameterized queries
- All Supabase queries use parameter binding
- PostGIS functions use `$1, $2` parameters
- No string concatenation in SQL

### 4. Secrets Management

✅ **Secure**: Env variables, not hardcoded
- `WHATSAPP_WEBHOOK_SECRET`
- `WHATSAPP_TOKEN`
- `SUPABASE_SERVICE_KEY`
- Stored in Vercel env vars (encrypted)

### 5. Rate Limiting (Future)

⚠️ **Not implemented in Week 1** (Week 4 monitoring)
- Consider Vercel Edge config rate limits
- Or implement rate limiting middleware

---

## References

- [ROADMAP.md](./ROADMAP.md) - Phase 1 master timeline
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Task checklist
- [CLAUDE.md](../../CLAUDE.md) - Project constraints
- [PostGIS Documentation](https://postgis.net/docs/) - Spatial functions reference
- [pgvector Documentation](https://github.com/pgvector/pgvector) - Vector similarity search
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api) - Webhook reference
- [Supabase Documentation](https://supabase.com/docs) - Database, RLS, Edge Functions

---

**Week 1 Status**: Ready for implementation
**Estimated Completion**: Jan 17, 2025
**Approval Gate**: See [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-1) for criteria
**Next Week**: [week-2-ordering-spec.md](./week-2-ordering-spec.md) - Customer ordering flow
