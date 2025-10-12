# Weats Phase 1 - Agent Delegation Plan

**Version**: 1.0
**Purpose**: Define which specialized agents to use for each phase of implementation
**Based on**: `.claude/agents/delegation-matrix.md`
**Last Updated**: 2025-01-11

---

## Overview

### Delegation Philosophy
- **Right agent for the right task** - Each agent has specialized expertise
- **Parallel work** - Multiple agents can work concurrently on independent tasks
- **Sequential dependencies** - Some tasks must complete before others start
- **Cross-cutting agents** - Some agents (code-reviewer, general-purpose) support all phases

### Agent Capabilities Summary

| Agent | Primary Skills | Use When |
|-------|---------------|----------|
| **supabase-expert** | PostgreSQL, PostGIS, pgvector, RLS, migrations | Database schema, spatial queries, vector search |
| **edge-functions-expert** | Vercel Edge Runtime, performance, cold starts | Webhook handlers, API routes, optimization |
| **gemini-expert** | Gemini FREE tier, context caching, function calling | Conversational AI, menu extraction (Vision) |
| **whatsapp-api-expert** | WhatsApp Business API v23, interactive messages, flows | Message templates, onboarding flows |
| **backend-developer** | API design, business logic, Stripe integration | Payment processing, order lifecycle |
| **business-analyst** | Unit economics, KPIs, cost tracking | Dashboard, launch metrics, financial validation |
| **code-reviewer** | Security, performance, production readiness | Code audits, vulnerability scans |
| **general-purpose** | Testing, documentation, bug fixes | Test writing, docs updates, minor fixes |

---

## Week 1: Foundation (Database + Webhook)

**Timeline**: Jan 11-17, 2025
**Estimated Hours**: 60h

### Primary Agent Allocation

#### supabase-expert (48h - 80%)

**Tasks**:
1. Database schema design + implementation (10 tables)
   - DDL with all columns, types, constraints
   - Foreign keys + indexes (95 total)
   - RLS policies (multi-tenant isolation)
   - Triggers (updated_at, order_number generation)

2. PostGIS functions implementation
   - `find_nearby_restaurants` (<10ms target)
   - `find_best_worker` (scoring algorithm)
   - `calculate_eta` (ETA calculation)

3. pgvector setup
   - Enable extension
   - HNSW index configuration (m=16, ef_construction=64)
   - `semantic_menu_search` function

4. Migration files
   - 8-10 idempotent migrations
   - Seed data (10 restaurants, 5 workers, 20 menu items)

**Handoff to Next Agent**:
- Database schema complete → edge-functions-expert can build webhook
- PostGIS functions ready → Week 3 dispatch system can use them

---

#### edge-functions-expert (12h - 20%)

**Tasks**:
1. WhatsApp webhook handler (Edge Function)
   - GET handler (verification challenge)
   - POST handler (message webhook)
   - Edge Runtime compatible (no Node.js modules)

2. Signature validation
   - HMAC SHA-256 verification
   - Reject invalid signatures (401)

3. Fire-and-forget pattern
   - Use Vercel `waitUntil` for async processing
   - Return 200 OK within 1 second
   - Never return 500 to WhatsApp

4. Message routing logic
   - Route by type: text, interactive, media
   - Save to database (messages table)
   - Placeholder handlers (Week 2 will implement)

**Handoff to Next Agent**:
- Webhook handler ready → Week 2 can implement Gemini agent integration

---

#### code-reviewer (4h - Security Audit)

**Tasks**:
1. RLS policy review
   - Verify customers can only see own data
   - Verify restaurants can only see own orders
   - Verify workers can only see assigned deliveries

2. Webhook security review
   - Signature validation correctness
   - No SQL injection (parameterized queries only)
   - No exposed secrets

3. Performance review
   - PostGIS queries use spatial indexes
   - pgvector queries use HNSW index
   - No N+1 query problems

**Gate 1 Approval**: Code reviewer signs off on security + performance

---

#### general-purpose (8h - Testing)

**Tasks**:
1. Database integration tests
   - CRUD operations on all 10 tables
   - PostGIS function tests (<10ms validation)
   - pgvector function tests (<50ms validation)
   - RLS policy tests

2. Webhook integration tests
   - Signature validation tests
   - Message routing tests (text, interactive, media)
   - Error handling tests

3. Load tests
   - 100 concurrent webhook requests (<100ms TTFB)
   - k6 script implementation

---

## Week 2: Customer Experience (Ordering Flow)

**Timeline**: Jan 18-24, 2025
**Estimated Hours**: 70h

### Primary Agent Allocation

#### gemini-expert (42h - 60%)

**Tasks**:
1. Gemini API client wrapper
   - Edge Runtime compatible
   - Error handling (rate limit, API errors)
   - Usage tracking (Supabase-based - **BUG-P0-001 FIX**)

2. **BUG-P0-001 FIX** (CRITICAL)
   - Create `gemini_usage` table
   - Implement `increment_gemini_usage()` RPC (atomic)
   - Hard limit enforcement (1,350 requests/day)
   - Alert at 1,200 (85% threshold)
   - Test persistence across cold starts

3. System prompt implementation
   - Colombian Spanish
   - Food delivery domain expertise
   - Tool usage instructions
   - Max 1,000 tokens

4. Context management
   - Load last 10 messages
   - System prompt caching (75% cost savings)
   - Update conversation after each turn

5. Gemini tools implementation (5 tools)
   - `search_restaurants` (calls PostGIS function)
   - `get_menu` (semantic search with pgvector)
   - `create_order` (transaction: order + order_items)
   - `track_delivery` (real-time status)
   - `customer_support` (escalation)

6. Error handling + fallback chain
   - Retry logic (3 attempts, exponential backoff)
   - Fallback: Gemini → GPT-4o-mini → Claude

**Handoff to Next Agent**:
- Gemini agent ready → whatsapp-api-expert can integrate interactive messages
- Tools implemented → backend-developer can build order processing logic

---

#### whatsapp-api-expert (28h - 40%)

**Tasks**:
1. Interactive message templates
   - Catalog messages (restaurant browse, 10-item grid)
   - Button messages (cart actions: add, view, checkout)
   - List messages (menu items, 4+ sections)
   - Order confirmation (receipt format)

2. 24h window optimization
   - Create `messaging_windows` table
   - Implement window tracking logic
   - Update window on every user message (reset 24h)
   - Template message fallback (if window closed)

3. Restaurant order notification
   - WhatsApp message with buttons (Accept, Reject)
   - Accept → order status = preparing
   - Reject → order cancelled, customer notified

**Handoff to Next Agent**:
- Interactive messages ready → Gemini agent can use them
- 24h window optimization → Week 4 unit economics validation

---

#### business-analyst (6h - Unit Economics)

**Tasks**:
1. Cost tracking per order
   - Track Gemini usage (tokens, requests)
   - Calculate AI cost per order (target: <$0.0005)
   - Calculate WhatsApp cost per order (target: <$0.03)
   - Total messaging cost (target: <$0.035)

2. Unit economics validation
   - Verify costs meet targets
   - Alert if costs exceed thresholds
   - Dashboard setup (initial version)

**Gate 2 Approval**: Business analyst signs off on unit economics

---

#### general-purpose (12h - Testing)

**Tasks**:
1. Gemini agent unit tests (15 test cases)
   - System prompt loading
   - Context management (10 messages limit)
   - Tool calling (all 5 tools)
   - Error handling (rate limit, API error)
   - **BUG-P0-001 fix verification** (cold start persistence)

2. Ordering flow integration tests (5 flows)
   - Search → menu → create order
   - Track delivery
   - Error: invalid restaurant
   - Error: unavailable menu item
   - Gemini rate limit → fallback to GPT-4o-mini

---

## Week 3: Supply Side (Restaurant/Worker)

**Timeline**: Jan 25-31, 2025
**Estimated Hours**: 65h

### Primary Agent Allocation

#### whatsapp-api-expert (32.5h - 50%)

**Tasks**:
1. Restaurant onboarding flow (30-second target)
   - 5-step conversation: welcome → business info → menu → approval → activation
   - Data validation (NIT format, phone number)
   - Menu upload (PDF, images, text list)

2. Worker notification design
   - Order details (restaurant, items, distance, payout)
   - Buttons (Accept, Reject)
   - Navigation link (Google Maps)

3. Order acceptance/rejection logic
   - Accept → delivery status = accepted, worker location updated
   - Reject → reassign to next worker, update acceptance rate

4. QR code system (pickup/delivery confirmation)
   - Generate QR (order_id + timestamp + HMAC signature)
   - Validation (HMAC verification, order status check)
   - Pickup confirmation → status = picked_up
   - Delivery confirmation → status = delivered, worker payout triggered

**Handoff to Next Agent**:
- Onboarding flow ready → Operations Lead can onboard restaurants
- Worker notifications ready → supabase-expert dispatch system can trigger them

---

#### supabase-expert (19.5h - 30%)

**Tasks**:
1. Optimize `find_best_worker` PostGIS query
   - Add composite index for dispatch queries
   - Materialized view for worker stats (refreshed every 5 min)
   - EXPLAIN ANALYZE validation (<10ms target)

2. Real-time worker assignment
   - Call `find_best_worker` when order ready
   - Create delivery record
   - Update worker availability
   - Notify worker via WhatsApp (call whatsapp-api-expert function)

3. Timeout + reassignment logic
   - Auto-reassign after 2 minutes if no response
   - Handle worker rejection (update acceptance rate)
   - Handle no available workers (return NULL → manual dispatch fallback)

**Handoff to Next Agent**:
- Dispatch system ready → Week 4 can process real orders end-to-end

---

#### gemini-expert (13h - 20%)

**Tasks**:
1. Menu extraction (Gemini Vision)
   - Extract from PDF/images: name, price, description, category
   - Structured output (JSON array)
   - Generate embeddings for semantic search
   - Target accuracy: >80% (name + price)

2. Business info extraction (Gemini agent)
   - Parse conversational input: address, NIT, phone
   - Validate format (Colombian NIT format)
   - Extract structured data

**Handoff to Next Agent**:
- Menu extraction ready → whatsapp-api-expert can integrate into onboarding flow

---

#### general-purpose (10h - Testing)

**Tasks**:
1. Restaurant onboarding E2E tests
   - Complete onboarding flow (<30s target)
   - Menu extraction accuracy (>80% target)
   - Validation errors (invalid NIT, etc.)

2. Dispatch algorithm unit tests (10 scenarios)
   - Closest worker selected
   - Unavailable workers excluded
   - Low-rated workers deprioritized
   - High-capacity workers deprioritized
   - No available workers → NULL returned
   - Worker accepts → status updated
   - Worker rejects → reassigned
   - Timeout → reassigned
   - Scoring algorithm correct

3. Load test: 50 concurrent dispatch requests

---

## Week 4: Payments + Launch

**Timeline**: Feb 1-8, 2025
**Estimated Hours**: 55h

### Primary Agent Allocation

#### backend-developer (33h - 60%)

**Tasks**:
1. Stripe integration
   - Setup Stripe account + API keys
   - Payment intent creation (idempotent)
   - Amount validation (prevent tampering)

2. WhatsApp Flows v3 checkout design
   - 3 screens: Cart → Delivery Address → Payment
   - Stripe Elements integration
   - Flow submission → creates payment intent

3. Stripe webhook handler (Edge Function)
   - `payment_intent.succeeded` → Order confirmed, notify customer + restaurant
   - `payment_intent.failed` → Retry logic (3 attempts), payment link sent
   - `charge.refunded` → Order cancelled, notify customer

4. Failed payment recovery
   - 3 retry attempts (exponential backoff: 1 min, 5 min, 15 min)
   - Send payment link via WhatsApp
   - Cancel order after 3 failures

5. Refund processing API
   - `POST /api/payments/refund`
   - Validate order status
   - Create Stripe refund
   - Notify customer + restaurant

**Handoff to Next Agent**:
- Stripe integration ready → business-analyst can track payment costs
- Payment flow working → Gate 4 can validate with 20 real paid orders

---

#### business-analyst (22h - 40%)

**Tasks**:
1. Cost tracking dashboard design
   - 10 KPI cards:
     1. Profit per order (target: $0.86)
     2. Margin % (target: 34%)
     3. AI cost/order (target: <$0.0005)
     4. WhatsApp cost/order (target: <$0.03)
     5. Infrastructure cost/order (target: <$0.24)
     6. Delivery payout/order ($1.40)
     7. Customer acquisition cost (CAC)
     8. Order volume (daily, weekly)
     9. Customer satisfaction (ratings)
     10. Worker earnings (daily, weekly)

2. Implement cost tracking queries
   - Supabase queries for each KPI
   - Real-time data (refresh every 5 seconds)
   - Date range filter (today, week, month, all-time)

3. Gemini usage tracking dashboard
   - Display: Requests today, tokens today, requests remaining
   - Progress bar (green <85%, yellow 85-95%, red >95%)
   - Alert if >1,200 requests/day

4. Unit economics validation per order
   - Calculate profit per order: Revenue - (AI + WhatsApp + Infrastructure + Payout)
   - Target: $0.86 profit/order
   - Alert if profit <$0.80/order

5. Launch execution planning
   - Create 50 restaurants target list (Zona T + Chicó)
   - Worker recruitment plan (20 workers)
   - Customer acquisition strategy (500 customers)
   - Launch tracking spreadsheet

**Gate 4 Approval**: Business analyst signs off on unit economics validation

---

#### code-reviewer (8h - Production Readiness)

**Tasks**:
1. Security audit (production readiness)
   - Payment handling secure (PCI-DSS via Stripe)
   - No exposed secrets
   - RLS policies enforced
   - Webhook signature validation (WhatsApp + Stripe)
   - No SQL injection
   - HTTPS enforced
   - Rate limiting configured

2. Performance review
   - Load test results analysis
   - Webhook TTFB <100ms (p95)
   - Payment processing <3 seconds (p95)
   - No cold start issues

**Gate 4 Approval**: Code reviewer signs off on security + performance

---

#### general-purpose (12h - Testing)

**Tasks**:
1. Payment flow E2E tests
   - Successful payment → order confirmed
   - Failed payment → retry link sent
   - Refund → customer receives refund

2. Stripe webhook tests
   - All 3 webhook events (succeeded, failed, refunded)
   - Signature validation (valid + invalid)
   - Idempotency (duplicate events)

---

## Cross-Cutting Agents (All Weeks)

### general-purpose (Continuous - 20h total)

**Tasks**:
- Test writing (unit + integration + E2E)
- Documentation updates
- Bug fixes (minor issues)
- Code cleanup + refactoring

---

### ui-visual-validator (Weekly Reviews - 8h total)

**Tasks**:
- Week 2: WhatsApp message design validation
  - Verify interactive messages render correctly
  - User flow testing (search → menu → checkout)

- Week 3: Restaurant onboarding UX validation
  - Verify onboarding flow is clear + intuitive
  - Menu extraction accuracy visual check

- Week 4: Dashboard UI validation
  - Verify KPI cards render correctly
  - Responsive design check (desktop + mobile)

---

## Agent Coordination Patterns

### Sequential Dependencies

```
Week 1: supabase-expert (database) → edge-functions-expert (webhook)
Week 2: gemini-expert (agent) → whatsapp-api-expert (messages) → backend-developer (order processing)
Week 3: gemini-expert (menu extraction) → whatsapp-api-expert (onboarding)
Week 3: supabase-expert (dispatch) → whatsapp-api-expert (worker notifications)
Week 4: backend-developer (Stripe) → business-analyst (cost tracking)
```

### Parallel Work

```
Week 1: supabase-expert (database) || edge-functions-expert (webhook) || general-purpose (tests)
Week 2: gemini-expert (agent) || whatsapp-api-expert (messages)
Week 3: whatsapp-api-expert (onboarding) || supabase-expert (dispatch) || gemini-expert (menu extraction)
Week 4: backend-developer (Stripe) || business-analyst (dashboard)
```

---

## Escalation Path

If an agent is blocked or encounters issues beyond their expertise:

1. **Technical Issues**: Escalate to **general-purpose** agent for research/debugging
2. **Architecture Decisions**: Escalate to **claude-master** for orchestration
3. **Business Decisions**: Escalate to **business-analyst** for unit economics impact
4. **Production Issues**: Escalate to **code-reviewer** for security/performance review

---

## Agent Handoff Checklist

When one agent completes their work and hands off to the next:

1. **Documentation**: Update relevant spec files (week-N-*.md)
2. **Tests**: Write tests for implemented functionality
3. **Deployment**: Deploy to staging environment (if applicable)
4. **Notification**: Comment in GitHub issue or task tracker
5. **Context**: Provide summary of what was implemented + any caveats

---

## References

- [ROADMAP.md](./ROADMAP.md) - Phase 1 timeline
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Task ownership per agent
- [.claude/agents/delegation-matrix.md](../../.claude/agents/delegation-matrix.md) - Agent capabilities matrix
- [.claude/agents/claude-master.md](../../.claude/agents/claude-master.md) - Orchestration agent

---

**Last Updated**: 2025-01-11
**Next Review**: After each weekly gate
**Status**: Ready for Phase 1 execution
