# Weats Phase 1 MVP - Implementation Checklist

**Version**: 1.0
**Status**: Ready for Execution
**Timeline**: 4 weeks (2025-01-11 to 2025-02-08)
**Total Tasks**: 75
**Last Updated**: 2025-01-11

---

## Table of Contents

1. [How to Use This Checklist](#how-to-use-this-checklist)
2. [Week 1: Foundation Layer](#week-1-foundation-layer)
3. [Week 2: Customer Experience](#week-2-customer-experience)
4. [Week 3: Supply Side](#week-3-supply-side)
5. [Week 4: Payments + Launch](#week-4-payments--launch)
6. [Progress Summary](#progress-summary)

---

## How to Use This Checklist

### Task Format
Each task includes:
- **[ ]** Checkbox (mark when complete)
- **Priority**: P0 (Critical), P1 (High), P2 (Medium)
- **Estimated Hours**: Time to complete
- **Dependencies**: What must be done first
- **Success Criteria**: How to verify completion
- **Testing**: Test requirements
- **Owner**: Which specialized agent to use

### Workflow
1. Complete tasks **sequentially within each section** (respect dependencies)
2. Mark checkbox **[ ]** → **[x]** when task is 100% complete
3. Run tests **immediately** after completing each task
4. **Do not skip** to next week until approval gate passed
5. Update this file in git after each task completion

### Priority Levels
- **P0 (Critical)**: Must complete for launch - no exceptions
- **P1 (High)**: Should complete for launch - can be manual workaround
- **P2 (Medium)**: Nice-to-have - can be post-launch

---

## Week 1: Foundation Layer
**Timeline**: Jan 11-17, 2025
**Goal**: Operational database + WhatsApp webhook ready for message processing
**Estimated Hours**: 60h
**Primary Agent**: supabase-expert (80%), edge-functions-expert (20%)

### 1.1 Database Schema Setup

#### [ ] 1.1.1 Create customers table
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: None (start here)
- **Success Criteria**:
  - Table created with all columns (id, phone_number, name, created_at, etc.)
  - Indexes on phone_number (unique), created_at
  - RLS policy: Users can only see their own data
- **Testing**:
  - Insert test customer
  - Verify RLS (user A cannot see user B's data)
  - Query performance <10ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0001_create_customers_table.sql`

#### [ ] 1.1.2 Create restaurants table
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: None
- **Success Criteria**:
  - Table with columns (id, name, address, location GEOGRAPHY(Point, 4326), etc.)
  - PostGIS spatial index on location column
  - Indexes on status, created_at
  - RLS policy: Public read (approved only), owner write
- **Testing**:
  - Insert test restaurant with location (Bogotá coordinates)
  - Verify spatial index (EXPLAIN ANALYZE)
  - Query nearby restaurants <10ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0002_create_restaurants_table.sql`

#### [ ] 1.1.3 Create menu_items table
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.2 (restaurants table)
- **Success Criteria**:
  - Table with columns (id, restaurant_id FK, name, price, description, embedding vector(1536), etc.)
  - Foreign key to restaurants (ON DELETE CASCADE)
  - Indexes on restaurant_id, available, created_at
  - pgvector HNSW index on embedding column (m=16, ef_construction=64)
- **Testing**:
  - Insert test menu items for test restaurant
  - Verify FK constraint (cannot insert with invalid restaurant_id)
  - Vector similarity search <50ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0003_create_menu_items_table.sql`

#### [ ] 1.1.4 Create orders table
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 1.1.1, 1.1.2 (customers, restaurants)
- **Success Criteria**:
  - Table with columns (id, customer_id FK, restaurant_id FK, status, total, etc.)
  - Foreign keys to customers, restaurants (ON DELETE RESTRICT)
  - Indexes on customer_id, restaurant_id, status, created_at
  - Partial index on status (WHERE status IN ('pending', 'preparing'))
  - RLS policy: Customer sees own orders, restaurant sees own orders
- **Testing**:
  - Insert test order
  - Verify FK constraints
  - Query customer orders <10ms
  - Query active orders (partial index) <5ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0004_create_orders_table.sql`

#### [ ] 1.1.5 Create order_items table
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.3, 1.1.4 (menu_items, orders)
- **Success Criteria**:
  - Table with columns (id, order_id FK, menu_item_id FK, quantity, price, etc.)
  - Foreign keys to orders, menu_items (ON DELETE CASCADE)
  - Indexes on order_id
- **Testing**:
  - Insert test order items for test order
  - Verify FK constraints
  - Query order items for order <5ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0005_create_order_items_table.sql`

#### [ ] 1.1.6 Create delivery_workers table
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: None
- **Success Criteria**:
  - Table with columns (id, phone_number, name, current_location GEOGRAPHY(Point, 4326), status, etc.)
  - PostGIS spatial index on current_location column
  - Indexes on phone_number (unique), status, available
  - Partial index on available workers (WHERE status = 'active' AND available = true)
- **Testing**:
  - Insert test worker with location
  - Verify spatial index
  - Query available workers <10ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0006_create_delivery_workers_table.sql`

#### [ ] 1.1.7 Create deliveries table
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 1.1.4, 1.1.6 (orders, delivery_workers)
- **Success Criteria**:
  - Table with columns (id, order_id FK, worker_id FK, status, pickup_time, delivery_time, etc.)
  - Foreign keys to orders, delivery_workers (ON DELETE RESTRICT)
  - Indexes on order_id (unique), worker_id, status, created_at
  - Partial index on active deliveries (WHERE status IN ('assigned', 'picked_up'))
- **Testing**:
  - Insert test delivery
  - Verify FK constraints
  - Query worker active deliveries <10ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0007_create_deliveries_table.sql`

#### [ ] 1.1.8 Create payments table
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.4 (orders)
- **Success Criteria**:
  - Table with columns (id, order_id FK, stripe_payment_intent_id, amount, status, etc.)
  - Foreign key to orders (ON DELETE RESTRICT)
  - Indexes on order_id (unique), stripe_payment_intent_id (unique), status
  - Partial index on pending payments (WHERE status = 'pending')
- **Testing**:
  - Insert test payment
  - Verify FK constraints
  - Query order payment <5ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0008_create_payments_table.sql`

#### [ ] 1.1.9 Create conversations table
- **Priority**: P1
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.1 (customers)
- **Success Criteria**:
  - Table with columns (id, customer_id FK, last_message_at, context JSONB, etc.)
  - Foreign key to customers (ON DELETE CASCADE)
  - Indexes on customer_id (unique), last_message_at
  - GIN index on context JSONB column
- **Testing**:
  - Insert test conversation
  - Verify FK constraints
  - Query customer conversation <5ms
  - JSONB query <10ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0009_create_conversations_table.sql`

#### [ ] 1.1.10 Create messages table
- **Priority**: P1
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.9 (conversations)
- **Success Criteria**:
  - Table with columns (id, conversation_id FK, role, content, created_at, etc.)
  - Foreign key to conversations (ON DELETE CASCADE)
  - Indexes on conversation_id, created_at
  - Partial index on recent messages (WHERE created_at > NOW() - INTERVAL '7 days')
- **Testing**:
  - Insert test messages
  - Verify FK constraints
  - Query recent messages for conversation <10ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0010_create_messages_table.sql`

### 1.2 PostGIS Functions

#### [ ] 1.2.1 Implement find_nearby_restaurants function
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: 1.1.2 (restaurants table)
- **Success Criteria**:
  - Function signature: `find_nearby_restaurants(lat FLOAT, lng FLOAT, radius_km INT) RETURNS TABLE`
  - Uses ST_DWithin for performance (spatial index)
  - Returns: restaurant_id, name, distance_km, avg_rating
  - Filters: only approved restaurants, only available
  - Sorts by distance ASC
  - Query time <10ms for radius 5km
- **Testing**:
  - Query from Zona T location (4.6616, -74.0538)
  - Verify results within radius
  - EXPLAIN ANALYZE shows index usage
  - Performance <10ms with 100 restaurants
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0011_postgis_functions.sql`

#### [ ] 1.2.2 Implement find_best_worker function
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: 1.1.6 (delivery_workers table)
- **Success Criteria**:
  - Function signature: `find_best_worker(restaurant_lat FLOAT, restaurant_lng FLOAT, order_id UUID) RETURNS UUID`
  - Scoring algorithm:
    - Distance: 40% (closer is better, <5km only)
    - Availability: 30% (currently available, no active delivery)
    - Rating: 20% (higher rating is better)
    - Capacity: 10% (fewer total deliveries today)
  - Returns: worker_id (best match) or NULL if none available
  - Query time <10ms
- **Testing**:
  - Query with restaurant location
  - Verify scoring (closest available worker selected)
  - EXPLAIN ANALYZE shows index usage
  - Performance <10ms with 50 workers
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0011_postgis_functions.sql`

#### [ ] 1.2.3 Implement calculate_eta function
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 1.1.6 (delivery_workers table)
- **Success Criteria**:
  - Function signature: `calculate_eta(worker_lat FLOAT, worker_lng FLOAT, delivery_lat FLOAT, delivery_lng FLOAT) RETURNS INT`
  - Calculates straight-line distance (ST_Distance)
  - Assumes 20 km/h average speed (scooter)
  - Returns: ETA in minutes
  - Adds 5 minutes buffer
- **Testing**:
  - Calculate ETA for 5km distance (should return ~20 minutes)
  - Verify accuracy (±2 minutes)
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0011_postgis_functions.sql`

### 1.3 pgvector Setup

#### [ ] 1.3.1 Enable pgvector extension
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: None
- **Success Criteria**:
  - pgvector extension enabled
  - Verify: `SELECT * FROM pg_extension WHERE extname = 'vector';`
- **Testing**:
  - Can create vector columns
  - Can perform vector operations
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0012_enable_pgvector.sql`

#### [ ] 1.3.2 Configure HNSW index for menu_items embeddings
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.3, 1.3.1 (menu_items table, pgvector extension)
- **Success Criteria**:
  - HNSW index created on embedding column
  - Parameters: m=16 (connections), ef_construction=64 (build quality)
  - Distance metric: cosine (menu item similarity)
- **Testing**:
  - Insert 100 test menu items with random embeddings
  - Semantic search query <50ms
  - EXPLAIN ANALYZE shows index usage
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0012_enable_pgvector.sql`

#### [ ] 1.3.3 Implement semantic_menu_search function
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 1.3.2 (HNSW index)
- **Success Criteria**:
  - Function signature: `semantic_menu_search(query_embedding vector(1536), restaurant_id UUID, limit INT) RETURNS TABLE`
  - Uses HNSW index for fast similarity search
  - Returns: menu_item_id, name, price, similarity_score
  - Filters: only available items, specific restaurant
  - Sorts by similarity DESC
  - Query time <50ms
- **Testing**:
  - Query with test embedding
  - Verify top results are similar
  - Performance <50ms with 1,000 menu items
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0012_enable_pgvector.sql`

### 1.4 Seed Data

#### [ ] 1.4.1 Load test restaurants (10)
- **Priority**: P1
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.2 (restaurants table)
- **Success Criteria**:
  - 10 restaurants in Bogotá (Zona T + Chicó)
  - Realistic data: names, addresses, coordinates, cuisines
  - Status: approved, available
- **Testing**:
  - Query all restaurants
  - Verify locations correct (Google Maps check)
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0013_seed_data.sql`

#### [ ] 1.4.2 Load test workers (5)
- **Priority**: P1
- **Estimated Hours**: 1h
- **Dependencies**: 1.1.6 (delivery_workers table)
- **Success Criteria**:
  - 5 workers in Bogotá
  - Realistic data: names, phone numbers, locations
  - Status: active, available
- **Testing**:
  - Query all workers
  - Verify locations correct
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0013_seed_data.sql`

#### [ ] 1.4.3 Load test menu items (20)
- **Priority**: P1
- **Estimated Hours**: 2h
- **Dependencies**: 1.1.3, 1.4.1 (menu_items table, test restaurants)
- **Success Criteria**:
  - 20 menu items across 10 restaurants
  - Realistic data: names, prices, descriptions
  - Embeddings: Generate with Gemini (embedding model)
- **Testing**:
  - Query menu items per restaurant
  - Semantic search works
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0013_seed_data.sql`

### 1.5 WhatsApp Webhook Handler

#### [ ] 1.5.1 Create webhook Edge Function
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: None
- **Success Criteria**:
  - Edge Function at `/api/whatsapp/webhook`
  - Handles GET (verification) and POST (messages)
  - Edge Runtime compatible (no Node.js modules)
  - Responds <100ms (fire-and-forget pattern)
- **Testing**:
  - WhatsApp verification challenge passes
  - Handles test message payload
  - Response time <100ms (p95)
- **Owner**: edge-functions-expert
- **File**: `app/api/whatsapp/webhook/route.ts`

#### [ ] 1.5.2 Implement signature validation
- **Priority**: P0 (Security)
- **Estimated Hours**: 2h
- **Dependencies**: 1.5.1 (webhook function)
- **Success Criteria**:
  - Validates X-Hub-Signature-256 header
  - Uses WHATSAPP_WEBHOOK_SECRET from env
  - Rejects invalid signatures (returns 401)
  - No performance impact (<10ms validation)
- **Testing**:
  - Valid signature → accepted
  - Invalid signature → rejected (401)
  - Missing signature → rejected (401)
- **Owner**: edge-functions-expert
- **File**: `app/api/whatsapp/webhook/route.ts`

#### [ ] 1.5.3 Implement fire-and-forget pattern
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 1.5.1 (webhook function)
- **Success Criteria**:
  - Uses Vercel `waitUntil` for async processing
  - Returns 200 OK within 1 second (validation only)
  - Message processing happens asynchronously
  - Errors logged, not returned to WhatsApp (no 500s)
- **Testing**:
  - Webhook responds <1 second
  - Processing completes successfully (check logs)
  - Errors handled gracefully (no retries from WhatsApp)
- **Owner**: edge-functions-expert
- **File**: `app/api/whatsapp/webhook/route.ts`

#### [ ] 1.5.4 Implement message routing logic
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: 1.5.3 (fire-and-forget)
- **Success Criteria**:
  - Routes by message type: text, interactive, media
  - Extracts: sender phone, message content, message type
  - Saves to database (messages table)
  - Calls appropriate handler (to be implemented Week 2)
- **Testing**:
  - Text message routed correctly
  - Interactive message (button click) routed correctly
  - Media message (image) routed correctly
- **Owner**: edge-functions-expert
- **File**: `app/api/whatsapp/webhook/route.ts`

#### [ ] 1.5.5 Implement error handling
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: 1.5.4 (message routing)
- **Success Criteria**:
  - Try-catch around all async operations
  - Structured logging (error message, context, timestamp)
  - Never returns 500 to WhatsApp (always 200)
  - Failed messages logged for manual review
- **Testing**:
  - Trigger error (invalid message payload)
  - Verify 200 response (not 500)
  - Verify error logged
- **Owner**: edge-functions-expert
- **File**: `app/api/whatsapp/webhook/route.ts`

### 1.6 Testing + Documentation

#### [ ] 1.6.1 Write database integration tests
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: All 1.1.x, 1.2.x, 1.3.x tasks
- **Success Criteria**:
  - Tests for all tables (CRUD operations)
  - Tests for PostGIS functions (<10ms validation)
  - Tests for pgvector functions (<50ms validation)
  - Tests for RLS policies
  - >95% test coverage (database layer)
- **Testing**:
  - `pnpm test` passes all database tests
- **Owner**: general-purpose
- **File**: `tests/integration/database.test.ts`

#### [ ] 1.6.2 Write webhook integration tests
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: All 1.5.x tasks
- **Success Criteria**:
  - Tests for signature validation
  - Tests for message routing (text, interactive, media)
  - Tests for error handling (invalid payload)
  - Load test (100 concurrent requests <100ms)
  - >90% test coverage (webhook handler)
- **Testing**:
  - `pnpm test` passes all webhook tests
  - Load test: `k6 run tests/load/webhook.js`
- **Owner**: general-purpose
- **File**: `tests/integration/webhook.test.ts`

#### [ ] 1.6.3 Generate OpenAPI spec for webhook
- **Priority**: P2
- **Estimated Hours**: 2h
- **Dependencies**: 1.5.4 (message routing)
- **Success Criteria**:
  - OpenAPI 3.0 spec documents webhook endpoint
  - Request/response schemas defined
  - Signature validation documented
- **Testing**:
  - Spec validates (swagger-cli)
  - Documentation renders correctly (Swagger UI)
- **Owner**: general-purpose
- **File**: `docs/api/webhook.openapi.yaml`

### 1.7 Approval Gate 1

#### [ ] 1.7.1 Run all tests (>95% pass rate)
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 1.6.1, 1.6.2 (all tests written)
- **Success Criteria**:
  - `pnpm test` → all tests pass
  - Test coverage >95% (database + webhook)
- **Testing**: Self-testing
- **Owner**: Technical Lead

#### [ ] 1.7.2 Performance validation
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: All Week 1 tasks
- **Success Criteria**:
  - Webhook TTFB <100ms (p95)
  - PostGIS queries <10ms (p95)
  - pgvector queries <50ms (p95)
- **Testing**:
  - Load test: `k6 run tests/load/webhook.js`
  - Query performance: `EXPLAIN ANALYZE` all functions
- **Owner**: Technical Lead

#### [ ] 1.7.3 Manual test: Create order via API
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: All Week 1 tasks
- **Success Criteria**:
  - Can create customer, restaurant, menu items, order via Supabase API
  - Can assign order to worker via dispatch function
  - All relationships correct (FK constraints enforced)
- **Testing**: Manual testing
- **Owner**: Technical Lead

#### [ ] 1.7.4 Security audit
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: All Week 1 tasks
- **Success Criteria**:
  - RLS policies prevent unauthorized access
  - Webhook signature validation works
  - No SQL injection vulnerabilities
  - No exposed secrets
- **Testing**: Security review by code-reviewer agent
- **Owner**: code-reviewer

#### [ ] 1.7.5 Gate 1 approval decision
- **Priority**: P0
- **Estimated Hours**: 0.5h
- **Dependencies**: 1.7.1-1.7.4 (all validations pass)
- **Success Criteria**:
  - Technical Lead approves Week 1 completion
  - All P0 tasks completed
  - All tests pass
  - Performance validated
- **Testing**: Manual approval
- **Owner**: Technical Lead
- **Rollback Plan**: If gate fails, revert migrations and fix issues

---

## Week 2: Customer Experience
**Timeline**: Jan 18-24, 2025
**Goal**: End-to-end customer ordering via WhatsApp with Gemini AI assistance
**Estimated Hours**: 70h
**Primary Agent**: gemini-expert (60%), whatsapp-api-expert (40%)

### 2.1 Gemini Agent Core

#### [ ] 2.1.1 Create Gemini API client wrapper
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: None
- **Success Criteria**:
  - Edge Runtime compatible
  - Handles API errors gracefully
  - Tracks usage (requests, tokens)
  - Context caching enabled (75% cost savings)
- **Testing**:
  - Can call Gemini API successfully
  - Error handling works (rate limit, API error)
  - Usage tracked correctly
- **Owner**: gemini-expert
- **File**: `lib/gemini-client.ts`

#### [ ] 2.1.2 **BUG-P0-001 FIX**: Migrate usage tracking to Supabase
- **Priority**: P0 (CRITICAL)
- **Estimated Hours**: 3h
- **Dependencies**: 2.1.1 (Gemini client), Week 1 Database
- **Success Criteria**:
  - Create `gemini_usage` table (date, requests, tokens)
  - Implement `increment_gemini_usage()` RPC function (atomic increment)
  - Hard limit: Reject at 1,350 requests/day (buffer before 1,400)
  - Alert at 1,200 requests/day (85% threshold)
  - Survives Edge Function cold starts
- **Testing**:
  - Call API 10 times, verify count = 10 in table
  - Restart Edge Function (cold start), verify count persists
  - Attempt 1,351st request → rejected (limit enforced)
- **Owner**: gemini-expert
- **File**: `lib/gemini-client.ts`, `supabase/migrations/0014_gemini_usage_tracking.sql`

#### [ ] 2.1.3 Implement system prompt (Colombian Spanish)
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: None
- **Success Criteria**:
  - System prompt defines: role, context, tone, constraints
  - Colombian Spanish (vos, parcero, friendly tone)
  - Food delivery domain expertise
  - Tools usage instructions
  - Max token limit: 1,000 tokens
- **Testing**:
  - Generate response, verify Colombian Spanish used
  - Verify tool calling works correctly
- **Owner**: gemini-expert
- **File**: `lib/gemini-agents.ts`

#### [ ] 2.1.4 Implement context management
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 2.1.3 (system prompt), Week 1 conversations/messages tables
- **Success Criteria**:
  - Loads last 10 messages from database
  - Includes system prompt (cached for 75% savings)
  - Total context <8,000 tokens
  - Updates conversation after each turn
- **Testing**:
  - 11th message: verify oldest message dropped
  - Context caching: verify cost savings (check API usage)
- **Owner**: gemini-expert
- **File**: `lib/gemini-agents.ts`

### 2.2 Gemini Tools Implementation

#### [ ] 2.2.1 Implement search_restaurants tool
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: Week 1 PostGIS functions
- **Success Criteria**:
  - Tool schema: `search_restaurants(lat: float, lng: float, cuisine?: string, radius_km: int = 5)`
  - Calls `find_nearby_restaurants` function
  - Filters by cuisine if specified
  - Returns: restaurant_id, name, distance_km, avg_rating, cuisines
  - Max results: 10
- **Testing**:
  - Call with customer location → returns nearby restaurants
  - Call with cuisine filter → only matching restaurants
- **Owner**: gemini-expert
- **File**: `lib/gemini-tools.ts`

#### [ ] 2.2.2 Implement get_menu tool
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: Week 1 menu_items table
- **Success Criteria**:
  - Tool schema: `get_menu(restaurant_id: string, query?: string)`
  - If query: Use semantic search (pgvector)
  - If no query: Return all menu items
  - Returns: menu_item_id, name, price, description, available
  - Max results: 20
- **Testing**:
  - Call with restaurant_id → returns menu items
  - Call with query "pizza" → returns pizza items (semantic match)
- **Owner**: gemini-expert
- **File**: `lib/gemini-tools.ts`

#### [ ] 2.2.3 Implement create_order tool
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: Week 1 orders/order_items tables
- **Success Criteria**:
  - Tool schema: `create_order(customer_id: string, restaurant_id: string, items: {menu_item_id, quantity}[], delivery_address: string, delivery_location: {lat, lng})`
  - Validates: customer exists, restaurant exists, menu items exist and available
  - Calculates total price (menu item prices × quantities)
  - Creates order + order_items in transaction
  - Returns: order_id, total, estimated_delivery_time
- **Testing**:
  - Create test order → success
  - Invalid restaurant_id → error returned
  - Invalid menu_item_id → error returned
- **Owner**: gemini-expert
- **File**: `lib/gemini-tools.ts`

#### [ ] 2.2.4 Implement track_delivery tool
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: Week 1 deliveries table
- **Success Criteria**:
  - Tool schema: `track_delivery(order_id: string)`
  - Returns: status, worker_name, worker_phone, current_location, eta_minutes
  - If no delivery assigned: Returns "Order being prepared"
- **Testing**:
  - Track order with delivery → returns worker info + location
  - Track order without delivery → returns preparing status
- **Owner**: gemini-expert
- **File**: `lib/gemini-tools.ts`

#### [ ] 2.2.5 Implement customer_support tool
- **Priority**: P2
- **Estimated Hours**: 2h
- **Dependencies**: None
- **Success Criteria**:
  - Tool schema: `customer_support(issue: string, order_id?: string)`
  - Returns: support message (Gemini generates)
  - If order_id: Includes order details
  - Escalates to human if: refund request, serious complaint
- **Testing**:
  - Call with generic issue → support message returned
  - Call with refund request → escalation triggered
- **Owner**: gemini-expert
- **File**: `lib/gemini-tools.ts`

### 2.3 Error Handling + Fallbacks

#### [ ] 2.3.1 Implement Gemini error handling
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 2.1.1 (Gemini client)
- **Success Criteria**:
  - Handles: rate limit (429), API error (500), timeout (>30s)
  - Retry logic: 3 attempts with exponential backoff
  - Fallback: If all retries fail, return generic error message
- **Testing**:
  - Trigger rate limit → retries work
  - Trigger API error → falls back gracefully
- **Owner**: gemini-expert
- **File**: `lib/gemini-client.ts`

#### [ ] 2.3.2 Implement multi-provider fallback chain (future-proofing)
- **Priority**: P2
- **Estimated Hours**: 4h
- **Dependencies**: 2.3.1 (error handling)
- **Success Criteria**:
  - Fallback chain: Gemini (FREE) → GPT-4o-mini ($0.000150/1K tokens) → Claude ($0.000800/1K tokens)
  - Only falls back if Gemini fails (not for rate limit - must respect 1,400/day)
  - Tracks fallback usage separately
- **Testing**:
  - Simulate Gemini failure → falls back to GPT-4o-mini
  - Verify fallback usage tracked
- **Owner**: gemini-expert
- **File**: `lib/gemini-client.ts`

### 2.4 WhatsApp Interactive Messages

#### [ ] 2.4.1 Implement catalog messages (restaurant browse)
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: None
- **Success Criteria**:
  - WhatsApp catalog API integration
  - Displays: restaurant image, name, cuisine, rating, distance
  - Max 10 restaurants per catalog
  - Tappable → sends restaurant_id back to webhook
- **Testing**:
  - Send catalog message → received correctly in WhatsApp
  - Tap restaurant → restaurant_id received in webhook
- **Owner**: whatsapp-api-expert
- **File**: `lib/whatsapp.ts`

#### [ ] 2.4.2 Implement button messages (cart actions)
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: None
- **Success Criteria**:
  - WhatsApp button template API integration
  - 3-button layout: "Add to Cart", "View Cart", "Checkout"
  - Button payloads: action + item_id
  - Handles button click in webhook
- **Testing**:
  - Send button message → received correctly
  - Click button → action received in webhook
- **Owner**: whatsapp-api-expert
- **File**: `lib/whatsapp.ts`

#### [ ] 2.4.3 Implement list messages (menu items)
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: None
- **Success Criteria**:
  - WhatsApp list template API integration
  - Displays: menu item name, price, description
  - Sections: appetizers, mains, desserts, drinks
  - Max 10 items per section
  - Tappable → sends menu_item_id back to webhook
- **Testing**:
  - Send list message → received correctly
  - Tap menu item → menu_item_id received in webhook
- **Owner**: whatsapp-api-expert
- **File**: `lib/whatsapp.ts`

#### [ ] 2.4.4 Implement order confirmation message
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 2.2.3 (create_order tool)
- **Success Criteria**:
  - Receipt-style format:
    - Order summary (items, quantities, prices)
    - Subtotal, delivery fee, total
    - Delivery address
    - Estimated delivery time
  - Buttons: "Track Order", "Contact Support"
- **Testing**:
  - Place order → confirmation message received correctly
- **Owner**: whatsapp-api-expert
- **File**: `lib/whatsapp.ts`

### 2.5 WhatsApp 24h Window Optimization

#### [ ] 2.5.1 Create messaging_windows table
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: Week 1 Database
- **Success Criteria**:
  - Table: `messaging_windows(phone_number, last_user_message_at, window_expires_at)`
  - Indexes: phone_number (unique)
  - Tracks 24h window per customer
- **Testing**:
  - Insert test window
  - Query window status <5ms
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0015_messaging_windows.sql`

#### [ ] 2.5.2 Implement window tracking logic
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 2.5.1 (messaging_windows table)
- **Success Criteria**:
  - Function: `get_messaging_window(phone_number) → {is_open: boolean, expires_at: timestamp}`
  - Updates window on every user message (resets 24h)
  - Checks window before sending message
  - If window closed: Return error (requires template message)
- **Testing**:
  - Send user message → window opened for 24h
  - 25 hours later → window closed
- **Owner**: whatsapp-api-expert
- **File**: `lib/messaging-windows.ts`

#### [ ] 2.5.3 Implement template message fallback
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 2.5.2 (window tracking)
- **Success Criteria**:
  - If window closed, cannot send free message
  - Fallback: Send template message (pre-approved by Meta)
  - Template: "Your order from {{restaurant}} is ready for delivery"
  - Cost: $0.0125-0.0667 per template message (acceptable for critical notifications)
- **Testing**:
  - Window closed → template message sent successfully
- **Owner**: whatsapp-api-expert
- **File**: `lib/messaging-windows.ts`

### 2.6 Order Processing

#### [ ] 2.6.1 Implement order lifecycle state machine
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: Week 1 orders table
- **Success Criteria**:
  - States: pending → preparing → ready → picked_up → delivered → completed
  - Transitions: Defined rules (cannot skip states)
  - Triggers: Webhooks (restaurant confirms, worker picks up, etc.)
  - Notifications: WhatsApp message on each state change
- **Testing**:
  - Transition through all states → success
  - Invalid transition → error
- **Owner**: backend-developer
- **File**: `lib/order-processing.ts`

#### [ ] 2.6.2 Implement restaurant order notification
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 2.6.1 (order lifecycle)
- **Success Criteria**:
  - When order created → send WhatsApp to restaurant
  - Message: Order details + buttons ("Accept", "Reject")
  - Accept → order status = preparing
  - Reject → order status = cancelled, customer notified
- **Testing**:
  - Create order → restaurant receives notification
  - Accept order → status updated
- **Owner**: whatsapp-api-expert
- **File**: `lib/order-processing.ts`

### 2.7 Testing + Documentation

#### [ ] 2.7.1 Write Gemini agent unit tests
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: All 2.1.x, 2.2.x tasks
- **Success Criteria**:
  - 15 test cases:
    - System prompt loading
    - Context management (10 messages limit)
    - Tool calling (all 5 tools)
    - Error handling (rate limit, API error)
    - Usage tracking (BUG-P0-001 fix verification)
  - >90% test coverage (Gemini agent)
- **Testing**:
  - `pnpm test` passes all agent tests
- **Owner**: general-purpose
- **File**: `tests/unit/gemini-agent.test.ts`

#### [ ] 2.7.2 Write ordering flow integration tests
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: All Week 2 tasks
- **Success Criteria**:
  - 5 E2E test flows:
    - Search restaurants → get menu → create order
    - Create order → track delivery
    - Error: invalid restaurant
    - Error: unavailable menu item
    - Gemini rate limit → fallback to GPT-4o-mini
  - >80% test coverage (ordering flow)
- **Testing**:
  - `pnpm test` passes all integration tests
- **Owner**: general-purpose
- **File**: `tests/integration/ordering-flow.test.ts`

#### [ ] 2.7.3 Unit economics validation (AI cost)
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: 2.7.2 (ordering tests)
- **Success Criteria**:
  - Track AI cost per test order
  - Verify <$0.0005/order (Gemini FREE tier + context caching)
  - Verify <1,400 requests/day (BUG-P0-001 fix working)
- **Testing**:
  - Run 100 test orders → verify total AI cost <$0.05
- **Owner**: business-analyst
- **File**: Dashboard tracking

### 2.8 Approval Gate 2

#### [ ] 2.8.1 Run all tests (>90% pass rate)
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 2.7.1, 2.7.2 (all tests written)
- **Success Criteria**:
  - `pnpm test` → all tests pass
  - Test coverage >90% (Gemini agent + ordering flow)
- **Testing**: Self-testing
- **Owner**: Technical Lead

#### [ ] 2.8.2 Complete 10 test orders via WhatsApp
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: All Week 2 tasks
- **Success Criteria**:
  - 3 different users (test accounts)
  - Each user completes order: search → menu → add items → checkout
  - All orders processed correctly (100% accuracy)
- **Testing**: Manual testing
- **Owner**: Product Manager

#### [ ] 2.8.3 Verify Gemini FREE tier compliance
- **Priority**: P0 (CRITICAL)
- **Estimated Hours**: 1h
- **Dependencies**: 2.1.2 (BUG-P0-001 fix)
- **Success Criteria**:
  - BUG-P0-001 fix verified: Usage tracking persists after cold start
  - Gemini usage <1,400 requests/day (check Supabase table)
  - Hard limit enforced (1,351st request rejected)
- **Testing**:
  - Check `gemini_usage` table
  - Restart Edge Function → verify count persists
- **Owner**: Technical Lead

#### [ ] 2.8.4 Unit economics validation (WhatsApp cost)
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 2.5.2 (window tracking)
- **Success Criteria**:
  - WhatsApp cost <$0.03/order (90%+ free messages)
  - AI cost <$0.0005/order (Gemini FREE tier)
  - Total messaging + AI cost <$0.035/order
- **Testing**:
  - Review cost dashboard
  - Verify costs within target
- **Owner**: Product Manager

#### [ ] 2.8.5 Gate 2 approval decision
- **Priority**: P0
- **Estimated Hours**: 0.5h
- **Dependencies**: 2.8.1-2.8.4 (all validations pass)
- **Success Criteria**:
  - Product Manager + Technical Lead approve Week 2 completion
  - All P0 tasks completed
  - All tests pass
  - Test orders successful
  - Unit economics validated
- **Testing**: Manual approval
- **Owner**: Product Manager + Technical Lead
- **Rollback Plan**: If gate fails, disable Gemini (use GPT-4o-mini only), fix issues

---

## Week 3: Supply Side
**Timeline**: Jan 25-31, 2025
**Goal**: Restaurants and workers can be onboarded, orders dispatched automatically
**Estimated Hours**: 65h
**Primary Agent**: whatsapp-api-expert (50%), supabase-expert (30%), gemini-expert (20%)

### 3.1 Restaurant Onboarding

#### [ ] 3.1.1 Design 30-second onboarding conversation flow
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: None
- **Success Criteria**:
  - 5 steps: welcome → business info → menu upload → approval → activation
  - WhatsApp conversational flow (Gemini agent)
  - Total time <30 seconds (target)
  - Data collected: name, address, tax ID, phone, cuisines
- **Testing**:
  - Mock onboarding conversation
  - Verify data collected correctly
- **Owner**: whatsapp-api-expert
- **File**: `lib/restaurant-onboarding.ts`

#### [ ] 3.1.2 Implement business info collection step
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: 3.1.1 (flow design)
- **Success Criteria**:
  - Gemini agent asks: name, address, tax ID, phone, cuisines
  - Validates: all fields required, tax ID format (Colombia NIT)
  - Extracts structured data from conversational input
  - Saves to database (restaurants table, status = pending_approval)
- **Testing**:
  - Complete business info step → data saved correctly
  - Invalid tax ID → validation error
- **Owner**: whatsapp-api-expert, gemini-expert
- **File**: `lib/restaurant-onboarding.ts`

#### [ ] 3.1.3 Implement menu upload step
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: 3.1.2 (business info), Gemini Vision API
- **Success Criteria**:
  - Accepts: PDF menu, images (JPEG/PNG), text list
  - Gemini Vision extracts: menu item name, price, description
  - Structured output: JSON array of menu items
  - Saves to database (menu_items table)
  - Generates embeddings for semantic search (Gemini embedding model)
- **Testing**:
  - Upload PDF menu → items extracted correctly (>80% accuracy)
  - Upload menu image → items extracted correctly
  - Upload text list → items parsed correctly
- **Owner**: gemini-expert
- **File**: `lib/menu-extraction.ts`

#### [ ] 3.1.4 Implement admin approval interface (manual for MVP)
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: 3.1.3 (menu upload)
- **Success Criteria**:
  - Admin receives notification (WhatsApp or email)
  - Admin reviews: business info, menu items
  - Approval options: approve, reject (with reason)
  - Approve → restaurant status = approved, available
  - Reject → restaurant notified via WhatsApp
- **Testing**:
  - Complete onboarding → admin receives notification
  - Approve restaurant → status updated
- **Owner**: whatsapp-api-expert
- **File**: `lib/restaurant-onboarding.ts`

#### [ ] 3.1.5 Implement activation confirmation
- **Priority**: P1
- **Estimated Hours**: 2h
- **Dependencies**: 3.1.4 (admin approval)
- **Success Criteria**:
  - Restaurant receives WhatsApp: "You're live on Weats!"
  - Instructions: How to receive/accept orders
  - Test order: Send test order to verify setup
- **Testing**:
  - Approve restaurant → confirmation message received
- **Owner**: whatsapp-api-expert
- **File**: `lib/restaurant-onboarding.ts`

### 3.2 Worker Dispatch System

#### [ ] 3.2.1 Optimize find_best_worker PostGIS query
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: Week 1 PostGIS functions
- **Success Criteria**:
  - Query time <10ms (p95) with 50 workers
  - EXPLAIN ANALYZE shows spatial index usage
  - Scoring algorithm validated (distance 40%, availability 30%, rating 20%, capacity 10%)
- **Testing**:
  - Query with 50 workers → <10ms
  - Verify correct worker selected (closest available)
- **Owner**: supabase-expert
- **File**: `supabase/migrations/0011_postgis_functions.sql` (optimization)

#### [ ] 3.2.2 Implement real-time worker assignment
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: 3.2.1 (dispatch query), Week 1 deliveries table
- **Success Criteria**:
  - When order ready → call `find_best_worker`
  - Create delivery record (order_id, worker_id, status = assigned)
  - Update worker status (available = false)
  - Notify worker via WhatsApp
  - Timeout: If worker doesn't accept in 2 minutes → reassign to next worker
- **Testing**:
  - Order ready → worker assigned <10ms
  - Worker doesn't respond → reassigned after 2 minutes
- **Owner**: supabase-expert
- **File**: `lib/dispatch-system.ts`

#### [ ] 3.2.3 Implement worker notification design
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: 3.2.2 (worker assignment)
- **Success Criteria**:
  - WhatsApp message format:
    - Restaurant name + address
    - Order summary (total items, total price)
    - Customer address
    - Distance (km)
    - Payout (COP)
    - ETA (minutes)
  - Buttons: "Accept", "Reject"
  - Navigation link: Google Maps (restaurant → customer)
- **Testing**:
  - Worker assigned → notification received correctly
  - Buttons work (accept/reject)
  - Navigation link opens Google Maps
- **Owner**: whatsapp-api-expert
- **File**: `lib/dispatch-system.ts`

#### [ ] 3.2.4 Implement order acceptance logic
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 3.2.3 (worker notification)
- **Success Criteria**:
  - Accept button → delivery status = accepted
  - Worker location updated (GPS from WhatsApp)
  - Restaurant notified: "Worker {{name}} is on the way"
  - Customer notified: "Your order is on the way"
  - Worker rating updated (acceptance rate++)
- **Testing**:
  - Accept order → status updated, notifications sent
- **Owner**: whatsapp-api-expert
- **File**: `lib/dispatch-system.ts`

#### [ ] 3.2.5 Implement order rejection logic
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 3.2.3 (worker notification)
- **Success Criteria**:
  - Reject button → asks for reason (buttons: "Too far", "Busy", "Other")
  - Reassign to next best worker (call `find_best_worker` again)
  - Worker rating updated (acceptance rate--)
  - If acceptance rate <50% → deprioritize in scoring
- **Testing**:
  - Reject order → reassigned to next worker
  - Low acceptance rate → worker deprioritized
- **Owner**: whatsapp-api-expert
- **File**: `lib/dispatch-system.ts`

### 3.3 QR Code System

#### [ ] 3.3.1 Implement QR code generation
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: Week 1 deliveries table
- **Success Criteria**:
  - QR payload: `order_id + timestamp + HMAC signature`
  - HMAC secret: From env variable (secure)
  - QR image: SVG format (lightweight)
  - Embedded in WhatsApp message (image)
- **Testing**:
  - Generate QR code → valid image
  - Payload decodes correctly
- **Owner**: backend-developer
- **File**: `lib/qr-codes.ts`

#### [ ] 3.3.2 Implement pickup confirmation (restaurant scans)
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 3.3.1 (QR generation)
- **Success Criteria**:
  - Restaurant scans QR (via WhatsApp camera or external app)
  - Validates: HMAC signature, order exists, status = ready
  - Updates: delivery status = picked_up, pickup_time = NOW()
  - Notifies: Customer "Your order has been picked up"
- **Testing**:
  - Scan valid QR → pickup confirmed
  - Scan invalid QR → error returned
- **Owner**: backend-developer
- **File**: `lib/qr-codes.ts`

#### [ ] 3.3.3 Implement delivery confirmation (customer scans)
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 3.3.1 (QR generation)
- **Success Criteria**:
  - Customer scans QR
  - Validates: HMAC signature, order exists, status = picked_up
  - Updates: delivery status = delivered, delivery_time = NOW(), order status = completed
  - Notifies: Worker "Delivery confirmed, payment processed"
  - Triggers: Worker payout (transfer to worker account)
- **Testing**:
  - Scan valid QR → delivery confirmed
  - Worker payout processed correctly
- **Owner**: backend-developer
- **File**: `lib/qr-codes.ts`

### 3.4 Testing + Documentation

#### [ ] 3.4.1 Write restaurant onboarding E2E tests
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: All 3.1.x tasks
- **Success Criteria**:
  - E2E test: Complete onboarding flow (business info → menu upload → approval → activation)
  - Test menu extraction accuracy (>80% with sample menus)
  - Test validation errors (invalid tax ID, etc.)
  - >80% test coverage (onboarding flow)
- **Testing**:
  - `pnpm test` passes all onboarding tests
- **Owner**: general-purpose
- **File**: `tests/integration/restaurant-onboarding.test.ts`

#### [ ] 3.4.2 Write dispatch algorithm unit tests
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: All 3.2.x tasks
- **Success Criteria**:
  - 10 test scenarios:
    - Closest worker selected
    - Unavailable workers excluded
    - Low-rated workers deprioritized
    - High-capacity workers deprioritized
    - No available workers → NULL returned
    - Worker accepts → status updated
    - Worker rejects → reassigned
    - Timeout → reassigned
    - Scoring algorithm correct
  - >90% test coverage (dispatch system)
- **Testing**:
  - `pnpm test` passes all dispatch tests
- **Owner**: general-purpose
- **File**: `tests/unit/dispatch-algorithm.test.ts`

#### [ ] 3.4.3 Load test: 50 concurrent dispatch requests
- **Priority**: P1
- **Estimated Hours**: 2h
- **Dependencies**: 3.2.1 (dispatch optimization)
- **Success Criteria**:
  - 50 concurrent orders → all assigned <10ms (p95)
  - No race conditions (same worker not assigned twice)
  - All workers updated correctly
- **Testing**:
  - Load test: `k6 run tests/load/dispatch.js`
- **Owner**: general-purpose
- **File**: `tests/load/dispatch.js`

### 3.5 Approval Gate 3

#### [ ] 3.5.1 Run all tests (>85% pass rate)
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 3.4.1, 3.4.2 (all tests written)
- **Success Criteria**:
  - `pnpm test` → all tests pass
  - Test coverage >85% (onboarding + dispatch)
- **Testing**: Self-testing
- **Owner**: Technical Lead

#### [ ] 3.5.2 Onboard 3 test restaurants via WhatsApp
- **Priority**: P0
- **Estimated Hours**: 1.5h
- **Dependencies**: All 3.1.x tasks
- **Success Criteria**:
  - 3 restaurants complete onboarding (<30 seconds each)
  - Menu extraction works (>80% accuracy)
  - Admin approval works
  - Restaurants receive activation confirmation
- **Testing**: Manual testing
- **Owner**: Operations Lead

#### [ ] 3.5.3 Assign 5 test orders to workers
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: All 3.2.x tasks
- **Success Criteria**:
  - 5 orders assigned to workers successfully
  - Dispatch query <10ms for each
  - Workers receive notifications correctly
  - Workers accept orders (or reassign if reject)
- **Testing**: Manual testing
- **Owner**: Operations Lead

#### [ ] 3.5.4 Verify QR code system works
- **Priority**: P1
- **Estimated Hours**: 0.5h
- **Dependencies**: All 3.3.x tasks
- **Success Criteria**:
  - Generate QR code → valid image
  - Scan QR (pickup) → confirmed
  - Scan QR (delivery) → confirmed
- **Testing**: Manual testing with test order
- **Owner**: Operations Lead

#### [ ] 3.5.5 Gate 3 approval decision
- **Priority**: P0
- **Estimated Hours**: 0.5h
- **Dependencies**: 3.5.1-3.5.4 (all validations pass)
- **Success Criteria**:
  - Operations Lead approves Week 3 completion
  - All P0 tasks completed
  - All tests pass
  - Test onboardings + assignments successful
- **Testing**: Manual approval
- **Owner**: Operations Lead
- **Rollback Plan**: If gate fails, implement manual dispatch (operations team assigns workers manually)

---

## Week 4: Payments + Launch
**Timeline**: Feb 1-8, 2025
**Goal**: Payment processing live, 50 restaurants + 20 workers + 500 customers launched
**Estimated Hours**: 55h
**Primary Agent**: backend-developer (60%), business-analyst (40%)

### 4.1 Stripe Integration

#### [ ] 4.1.1 Setup Stripe account + API keys
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: None
- **Success Criteria**:
  - Stripe account created
  - API keys obtained (publishable + secret)
  - Keys stored in env variables (Vercel)
  - Webhook endpoint URL configured
- **Testing**:
  - Can call Stripe API successfully
- **Owner**: backend-developer
- **File**: `.env.local` (local), Vercel env vars (production)

#### [ ] 4.1.2 Design WhatsApp Flows v3 checkout
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: WhatsApp Flows API docs
- **Success Criteria**:
  - 3 screens:
    1. Cart review (items, quantities, subtotal)
    2. Delivery address (text input + location picker)
    3. Payment (Stripe Elements integration)
  - Flow submission → creates payment intent
  - Payment success → order confirmed
- **Testing**:
  - Complete checkout flow in WhatsApp → payment processed
- **Owner**: backend-developer, whatsapp-api-expert
- **File**: `lib/whatsapp-flows.ts`

#### [ ] 4.1.3 Implement payment intent creation
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: 4.1.1 (Stripe setup), Week 2 orders table
- **Success Criteria**:
  - Idempotent: Same order_id → same payment_intent_id
  - Amount validation: Matches order total (no tampering)
  - Metadata: Includes order_id, customer_id, restaurant_id
  - Currency: COP (Colombian Peso)
  - Payment methods: Card (Visa, Mastercard)
- **Testing**:
  - Create payment intent → success
  - Create duplicate → same intent returned (idempotent)
  - Amount mismatch → error
- **Owner**: backend-developer
- **File**: `lib/stripe.ts`

#### [ ] 4.1.4 Implement Stripe webhook handler
- **Priority**: P0
- **Estimated Hours**: 5h
- **Dependencies**: 4.1.3 (payment intent creation)
- **Success Criteria**:
  - Edge Function at `/api/payments/webhook`
  - Handles 3 events:
    1. `payment_intent.succeeded` → Order confirmed, notify customer + restaurant
    2. `payment_intent.failed` → Order cancelled, notify customer
    3. `charge.refunded` → Order cancelled, notify customer
  - Signature validation (Stripe webhook secret)
  - Idempotent: Handle duplicate events
- **Testing**:
  - Trigger each event (Stripe CLI) → handled correctly
  - Invalid signature → rejected
- **Owner**: backend-developer
- **File**: `app/api/payments/webhook/route.ts`

#### [ ] 4.1.5 Implement failed payment recovery
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 4.1.4 (webhook handler)
- **Success Criteria**:
  - 3 retry attempts (exponential backoff: 1 min, 5 min, 15 min)
  - After 3 failures → notify customer via WhatsApp
  - Send payment link (Stripe checkout session)
  - If customer pays within 1 hour → order confirmed
  - If not → order cancelled
- **Testing**:
  - Trigger payment failure → retries work
  - Final failure → customer notified
- **Owner**: backend-developer
- **File**: `lib/payment-processing.ts`

#### [ ] 4.1.6 Implement refund processing API
- **Priority**: P1
- **Estimated Hours**: 3h
- **Dependencies**: 4.1.4 (webhook handler)
- **Success Criteria**:
  - API endpoint: `POST /api/payments/refund`
  - Requires: order_id, reason
  - Validates: Order exists, payment succeeded, not already refunded
  - Creates Stripe refund
  - Updates order status: cancelled
  - Notifies: Customer + restaurant via WhatsApp
- **Testing**:
  - Request refund → processed successfully
  - Customer receives refund + notification
- **Owner**: backend-developer
- **File**: `app/api/payments/refund/route.ts`

### 4.2 Cost Tracking Dashboard

#### [ ] 4.2.1 Design dashboard UI (React components)
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: None
- **Success Criteria**:
  - Dashboard page: `/dashboard`
  - 10 KPI cards:
    1. Unit economics: Profit/order, margin %
    2. AI cost/order (Gemini usage)
    3. WhatsApp cost/order (free vs paid messages)
    4. Infrastructure cost/order (Vercel + Supabase)
    5. Delivery payout/order
    6. Customer acquisition cost (CAC)
    7. Restaurant commission/order
    8. Order volume (daily, weekly)
    9. Customer satisfaction (ratings)
    10. Worker earnings (daily, weekly)
  - Charts: Line chart (orders over time), pie chart (cost breakdown)
  - Responsive: Desktop + mobile
- **Testing**:
  - Dashboard renders correctly
  - KPIs display accurate data
- **Owner**: frontend-developer (or general-purpose)
- **File**: `components/dashboard/`, `app/dashboard/page.tsx`

#### [ ] 4.2.2 Implement cost tracking queries
- **Priority**: P1
- **Estimated Hours**: 4h
- **Dependencies**: Week 1 Database, 4.2.1 (dashboard UI)
- **Success Criteria**:
  - Supabase queries for each KPI
  - Real-time data (refresh every 5 seconds)
  - Date range filter (today, week, month, all-time)
  - Aggregations: SUM, AVG, COUNT
- **Testing**:
  - Query KPIs → data returned <100ms
  - Dashboard updates real-time
- **Owner**: business-analyst
- **File**: `lib/analytics.ts`

#### [ ] 4.2.3 Implement Gemini usage tracking dashboard
- **Priority**: P0 (CRITICAL)
- **Estimated Hours**: 3h
- **Dependencies**: Week 2 BUG-P0-001 fix, 4.2.1 (dashboard UI)
- **Success Criteria**:
  - Dashboard section: "Gemini Usage Today"
  - Displays: Requests today, tokens today, requests remaining
  - Progress bar: Visual indicator (green <85%, yellow 85-95%, red >95%)
  - Alert: If >1,200 requests/day (85% threshold)
- **Testing**:
  - Make 1,000 requests → dashboard shows 1,000
  - Exceeds 1,200 → alert triggered
- **Owner**: business-analyst
- **File**: `components/dashboard/gemini-usage.tsx`

#### [ ] 4.2.4 Implement unit economics validation per order
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 4.2.2 (cost tracking queries)
- **Success Criteria**:
  - Calculate profit per order: Revenue - (AI + WhatsApp + Infrastructure + Delivery payout)
  - Target: $0.86 profit/order (34% margin)
  - Alert: If profit <$0.80/order (threshold breach)
  - Dashboard: Red/green indicator per order
- **Testing**:
  - Process 10 orders → verify profit calculation accurate
  - Low profit order → alert triggered
- **Owner**: business-analyst
- **File**: `lib/analytics.ts`

### 4.3 Launch Execution

#### [ ] 4.3.1 Create 50 restaurants target list (Zona T + Chicó)
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: None
- **Success Criteria**:
  - List of 50 restaurants: name, address, phone, cuisine
  - Mix: 20 popular chains, 30 local restaurants
  - Geography: Zona T (25), Chicó (25)
  - Contact method: Phone + WhatsApp
- **Testing**:
  - List complete with all details
- **Owner**: business-analyst
- **File**: `docs/launch/restaurant-list.md`

#### [ ] 4.3.2 Contact + onboard 50 restaurants
- **Priority**: P0
- **Estimated Hours**: 6h (distributed over Week 3-4)
- **Dependencies**: 4.3.1 (restaurant list), Week 3 onboarding flow
- **Success Criteria**:
  - Contact all 50 restaurants (phone + WhatsApp)
  - Pitch: 5-10% commission vs Rappi 28%
  - Onboard via WhatsApp (<30 seconds each)
  - Target: 30+ onboarded by launch (60% conversion)
- **Testing**:
  - 30+ restaurants onboarded
  - All approved + activated
- **Owner**: Operations Lead (manual task)
- **File**: Tracking spreadsheet

#### [ ] 4.3.3 Create worker recruitment plan
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: None
- **Success Criteria**:
  - Recruitment channels: Referrals, local ads, social media
  - Pitch: $82,000 COP/day vs Rappi $20,000
  - Requirements: Scooter, smartphone, availability
  - Onboarding: WhatsApp instructions, test delivery
- **Testing**:
  - Recruitment plan documented
- **Owner**: business-analyst
- **File**: `docs/launch/worker-recruitment.md`

#### [ ] 4.3.4 Recruit + onboard 20 workers
- **Priority**: P0
- **Estimated Hours**: 5h (distributed over Week 3-4)
- **Dependencies**: 4.3.3 (recruitment plan)
- **Success Criteria**:
  - Recruit 20 workers (referrals + local ads)
  - Onboard via WhatsApp
  - Training: Test delivery (accept → pickup → deliver)
  - Verification: Valid scooter, smartphone, WhatsApp
- **Testing**:
  - 20 workers onboarded
  - All completed test delivery successfully
- **Owner**: Operations Lead (manual task)
- **File**: Tracking spreadsheet

#### [ ] 4.3.5 Create customer acquisition strategy
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: None
- **Success Criteria**:
  - Channels: WhatsApp groups, Instagram ads, influencer partnerships
  - Target: 500 customers by launch
  - Budget: CAC <$5/customer
  - Pitch: $0 delivery fee vs Rappi $2-5
  - CTA: Join WhatsApp group, place first order
- **Testing**:
  - Acquisition strategy documented
- **Owner**: business-analyst
- **File**: `docs/launch/customer-acquisition.md`

#### [ ] 4.3.6 Execute customer acquisition (500 customers)
- **Priority**: P0
- **Estimated Hours**: 5h (distributed over Week 3-4)
- **Dependencies**: 4.3.5 (acquisition strategy)
- **Success Criteria**:
  - Create WhatsApp groups (neighborhood-specific: Zona T, Chicó)
  - Run Instagram ads (targeting Zona T + Chicó)
  - Partner with 3-5 micro-influencers (local food bloggers)
  - Referral program: Customer refers customer ($1 credit)
  - Target: 500 customers registered by launch
- **Testing**:
  - 500+ customers registered
  - At least 50 customers placed test order
- **Owner**: Marketing Lead (manual task)
- **File**: Tracking spreadsheet

### 4.4 Testing + Documentation

#### [ ] 4.4.1 Write payment flow E2E tests
- **Priority**: P0
- **Estimated Hours**: 4h
- **Dependencies**: All 4.1.x tasks
- **Success Criteria**:
  - 3 E2E test flows:
    1. Successful payment → order confirmed
    2. Failed payment → customer notified, retry link sent
    3. Refund → customer receives refund
  - >85% test coverage (payment flow)
- **Testing**:
  - `pnpm test` passes all payment tests
- **Owner**: general-purpose
- **File**: `tests/integration/payment-flow.test.ts`

#### [ ] 4.4.2 Write Stripe webhook tests
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: 4.1.4 (webhook handler)
- **Success Criteria**:
  - Tests for all 3 webhook events (succeeded, failed, refunded)
  - Test signature validation (valid + invalid)
  - Test idempotency (duplicate events)
  - >90% test coverage (webhook handler)
- **Testing**:
  - `pnpm test` passes all webhook tests
- **Owner**: general-purpose
- **File**: `tests/integration/stripe-webhooks.test.ts`

### 4.5 Approval Gate 4 (Production Readiness)

#### [ ] 4.5.1 Run all tests (>80% overall coverage)
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: All Week 1-4 tests
- **Success Criteria**:
  - `pnpm test` → all tests pass
  - Test coverage >80% overall (unit + integration)
  - 0 P0 bugs, 0 P1 bugs
- **Testing**: Self-testing
- **Owner**: Technical Lead

#### [ ] 4.5.2 Process 20 real paid orders
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: All Week 4 tasks
- **Success Criteria**:
  - 20 real orders with real payments (Stripe)
  - All payments processed successfully (>95% success rate)
  - All orders fulfilled (restaurant → worker → customer)
  - Customer satisfaction >4.5 stars (ask for rating)
- **Testing**: Manual testing
- **Owner**: CEO

#### [ ] 4.5.3 Validate cost tracking accuracy
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 4.2.2, 4.2.4 (cost tracking)
- **Success Criteria**:
  - Dashboard shows accurate costs per order
  - Unit economics validated: $0.86 profit/order (34% margin)
  - AI cost <$0.0005/order (Gemini FREE tier)
  - WhatsApp cost <$0.03/order (90%+ free messages)
  - Infrastructure cost <$0.24/order
- **Testing**:
  - Review dashboard for 20 real orders
  - Verify costs match targets
- **Owner**: CFO

#### [ ] 4.5.4 Security audit (production readiness)
- **Priority**: P0
- **Estimated Hours**: 3h
- **Dependencies**: All Week 1-4 code
- **Success Criteria**:
  - Payment handling secure (PCI-DSS compliant via Stripe)
  - No exposed secrets (API keys, webhook secrets)
  - RLS policies prevent unauthorized access
  - Webhook signature validation working
  - No SQL injection vulnerabilities
  - HTTPS enforced (SSL certificates valid)
- **Testing**: Security review by code-reviewer agent
- **Owner**: code-reviewer

#### [ ] 4.5.5 Performance benchmark validation
- **Priority**: P0
- **Estimated Hours**: 2h
- **Dependencies**: All Week 1-4 code
- **Success Criteria**:
  - Webhook TTFB <100ms (p95)
  - DB queries <50ms (p95)
  - PostGIS queries <10ms (p95)
  - Edge cold start <200ms
  - Payment processing <3 seconds (p95)
- **Testing**:
  - Load tests: `k6 run tests/load/*.js`
  - Vercel Analytics review
- **Owner**: Technical Lead

#### [ ] 4.5.6 Launch targets validation
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 4.3.2, 4.3.4, 4.3.6 (launch execution)
- **Success Criteria**:
  - 50 restaurants onboarded (Zona T + Chicó) ✅
  - 20 workers active ✅
  - 500 customers registered ✅
  - 20-30 orders/day (Week 4 end) ✅
- **Testing**:
  - Review tracking spreadsheet
  - Verify targets met
- **Owner**: CEO

#### [ ] 4.5.7 Gate 4 approval decision (Go/No-Go for public launch)
- **Priority**: P0
- **Estimated Hours**: 1h
- **Dependencies**: 4.5.1-4.5.6 (all validations pass)
- **Success Criteria**:
  - CEO + CFO approve production launch
  - All P0 tasks completed
  - All tests pass
  - 20 real paid orders successful
  - Unit economics validated
  - Launch targets met
  - Security audit passed
  - Performance benchmarks met
- **Testing**: Executive approval meeting
- **Owner**: CEO + CFO
- **Go Decision**: Public launch on 2025-03-01
- **No-Go Decision**: Delay launch, fix critical issues, re-evaluate

---

## Progress Summary

### Overall Progress
- **Week 1**: [ ] 0/20 tasks (0%)
- **Week 2**: [ ] 0/25 tasks (0%)
- **Week 3**: [ ] 0/17 tasks (0%)
- **Week 4**: [ ] 0/20 tasks (0%)
- **Total**: [ ] 0/82 tasks (0%)

### By Priority
- **P0 (Critical)**: 0/60 tasks (0%)
- **P1 (High)**: 0/18 tasks (0%)
- **P2 (Medium)**: 0/4 tasks (0%)

### By Owner (Specialized Agents)
- **supabase-expert**: 0/18 tasks
- **edge-functions-expert**: 0/5 tasks
- **gemini-expert**: 0/12 tasks
- **whatsapp-api-expert**: 0/15 tasks
- **backend-developer**: 0/7 tasks
- **business-analyst**: 0/8 tasks
- **code-reviewer**: 0/2 tasks
- **general-purpose**: 0/8 tasks
- **Operations/Marketing Leads**: 0/3 tasks (manual)
- **Technical Lead**: 0/4 tasks (manual)
- **CEO/CFO**: 0/2 tasks (manual)

### Estimated Hours
- **Total**: 250 hours
- **Completed**: 0 hours (0%)
- **Remaining**: 250 hours (100%)

---

## References

- [ROADMAP.md](./ROADMAP.md) - Phase 1 master timeline + risk mitigation
- [APPROVAL-GATES.md](./APPROVAL-GATES.md) - Detailed gate criteria + rollback plans
- [DELEGATION-PLAN.md](./DELEGATION-PLAN.md) - Agent mapping per phase
- [week-1-database-spec.md](./week-1-database-spec.md) - Database technical specification
- [week-2-ordering-spec.md](./week-2-ordering-spec.md) - Ordering flow technical specification
- [week-3-supply-spec.md](./week-3-supply-spec.md) - Supply side technical specification
- [week-4-payments-spec.md](./week-4-payments-spec.md) - Payments + launch technical specification
- [CLAUDE.md](../../CLAUDE.md) - Project overview + constraints

---

**Last Updated**: 2025-01-11
**Next Update**: After each task completion (commit to git)
**Status**: Ready for Phase 1 execution
**Contact**: Technical Lead for questions/blockers
