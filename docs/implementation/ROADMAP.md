# Weats Phase 1 MVP - Implementation Roadmap

**Version**: 1.0
**Status**: Ready for Execution
**Timeline**: 4 weeks (2025-01-11 to 2025-02-08)
**Launch Target**: 2025-03-01 (Bogotá beachhead)
**Last Updated**: 2025-01-11

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 1 Overview](#phase-1-overview)
3. [Weekly Milestones](#weekly-milestones)
4. [Critical Path Analysis](#critical-path-analysis)
5. [Dependency Map](#dependency-map)
6. [Resource Allocation](#resource-allocation)
7. [Risk Mitigation](#risk-mitigation)
8. [Budget Tracking](#budget-tracking)
9. [Success Metrics](#success-metrics)
10. [Launch Readiness Checklist](#launch-readiness-checklist)

---

## Executive Summary

### Mission
Disrupt Colombia's food delivery market with a WhatsApp-native platform powered by Gemini AI, delivering **91% lower costs** vs Rappi and benefiting all stakeholders: $0 customers, 5-10% restaurants (vs 28%), 50-100% higher worker pay.

### Phase 1 Goals (MVP - 4 Weeks)
- **Technical**: Fully functional ordering system (WhatsApp + Gemini + Supabase + Stripe)
- **Business**: 50 restaurants, 20 workers, 500 customers (Bogotá: Zona T + Chicó)
- **Financial**: $0.86 profit/order maintained (34% margin)
- **Operational**: 20-30 orders/day by Week 4

### Key Constraints
- ✅ **Gemini FREE tier ONLY** (1,400 requests/day limit) - $0 AI cost
- ✅ **WhatsApp 24h window optimization** (90%+ free messages, <$0.03/order)
- ✅ **Edge Runtime compatible** (Vercel Edge Functions <100ms TTFB)
- ✅ **Unit economics validated** (every feature must maintain $0.86 profit/order)

### Critical Success Factors
1. **BUG-P0-001 Fix**: Migrate Gemini usage tracking from in-memory to Supabase (Week 2)
2. **PostGIS Performance**: <10ms location queries (Week 1)
3. **WhatsApp Webhook Stability**: <100ms response, fire-and-forget pattern (Week 1)
4. **Conversational AI Quality**: Colombian Spanish, food domain expertise (Week 2)
5. **Approval Gates**: Manual review between each week - NO auto-progression

---

## Phase 1 Overview

### Timeline Structure

```
Week 1 (Jan 11-17): Foundation Layer
├── Database Schema (10 tables + PostGIS + pgvector)
├── WhatsApp Webhook Handler (Edge Function)
└── Gate 1: Database + Webhook Functional
    ↓
Week 2 (Jan 18-24): Customer Experience
├── Gemini Conversational Ordering (Colombian Spanish)
├── Interactive WhatsApp Messages (Catalogs + Buttons)
├── BUG-P0-001 Fix (Gemini tracking to Supabase)
└── Gate 2: Customer Ordering Functional
    ↓
Week 3 (Jan 25-31): Supply Side
├── Restaurant Onboarding (30-second WhatsApp flow)
├── Worker Dispatch System (PostGIS matching)
├── Order Notifications + QR Confirmations
└── Gate 3: Supply Side Ready
    ↓
Week 4 (Feb 1-8): Payments + Launch
├── Stripe Integration (WhatsApp Flows v3)
├── Cost Tracking Dashboard
├── Launch 50 Restaurants + 20 Workers + 500 Customers
└── Gate 4: Production Ready (Go/No-Go Decision)
```

### Effort Distribution

| Week | Focus Area | Engineering Hours | Agent Primary | Complexity |
|------|-----------|-------------------|---------------|------------|
| 1 | Database + Webhook | 60h | supabase-expert | High |
| 2 | Ordering + AI | 70h | gemini-expert, whatsapp-api-expert | Very High |
| 3 | Supply Side | 65h | whatsapp-api-expert, supabase-expert | High |
| 4 | Payments + Launch | 55h | backend-developer, business-analyst | Medium |
| **Total** | **Phase 1** | **250h** | **Multi-agent** | **High** |

---

## Weekly Milestones

### Week 1: Foundation Layer (Jan 11-17)
**Goal**: Operational database + WhatsApp webhook ready for message processing

#### Milestones
1. **Database Schema Complete** (30h)
   - 10 tables deployed to Supabase
   - 95 indexes operational (B-tree, GIN, HNSW, partial)
   - RLS policies enforced (multi-tenant isolation)
   - PostGIS functions: `find_nearby_restaurants`, `find_best_worker`, `calculate_eta`
   - pgvector setup: 1536-dim embeddings, HNSW index configured
   - Seed data loaded (10 test restaurants, 5 workers, 20 menu items)

2. **WhatsApp Webhook Functional** (20h)
   - Signature validation (security)
   - Fire-and-forget pattern (`waitUntil` implementation)
   - Message routing logic (text, interactive, media)
   - Error handling (no 500s to WhatsApp)
   - Load tested: 100 concurrent requests <100ms TTFB

3. **Testing + Documentation** (10h)
   - Integration tests: PostGIS <10ms, pgvector <50ms
   - Unit tests: Webhook validation, routing logic
   - API documentation (OpenAPI spec)

#### Success Criteria
- ✅ All tests pass (>95% coverage)
- ✅ Webhook responds <100ms TTFB (p95)
- ✅ PostGIS queries <10ms (p95)
- ✅ pgvector semantic search <50ms (p95)
- ✅ Manual test: Create order via API successfully
- ✅ Load test: 100 concurrent requests handled without errors

#### Deliverables
- `supabase/migrations/` - 8-10 migration files
- `app/api/whatsapp/webhook/route.ts` - Webhook handler (Edge Function)
- `lib/supabase.ts` - Edge-compatible Supabase client
- `lib/postgis.ts` - Location query functions
- `tests/integration/database.test.ts` - Database tests
- `tests/integration/webhook.test.ts` - Webhook tests

#### Approval Gate 1 (End of Week 1)
**Approver**: Technical Lead
**Validation**: Manual test order creation + load test (100 concurrent)
**Criteria**: See [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-1) for full details
**Rollback**: Revert migrations if database performance fails

---

### Week 2: Customer Experience (Jan 18-24)
**Goal**: End-to-end customer ordering via WhatsApp with Gemini AI assistance

#### Milestones
1. **Gemini Conversational Agent** (35h)
   - System prompt (Colombian Spanish, food delivery context)
   - 5 tools: `search_restaurants`, `get_menu`, `create_order`, `track_delivery`, `customer_support`
   - Context management (last 10 messages + system prompt caching - 75% savings)
   - Error handling (fallback chain: Gemini → GPT-4o-mini → Claude)
   - **BUG-P0-001 FIX**: Migrate usage tracking to Supabase (CRITICAL)

2. **Interactive WhatsApp Messages** (25h)
   - Catalog messages (restaurant grid with images)
   - Button templates (cart actions: add, remove, checkout)
   - List templates (menu items 4+)
   - Order confirmation design (receipt format)
   - 24h window optimization (90%+ messages free)

3. **Testing + Optimization** (10h)
   - Unit tests: Gemini agent (15 test cases)
   - Integration tests: End-to-end ordering (5 flows)
   - Cold start validation (BUG-P0-001 fix verification)
   - Unit economics tracking ($0.0005 AI cost/order)

#### Success Criteria
- ✅ Complete 10 test orders via WhatsApp (3 different users)
- ✅ Gemini responds correctly in Colombian Spanish
- ✅ FREE tier tracking works (survives Edge Function cold starts)
- ✅ Gemini usage <1,400 requests/day
- ✅ WhatsApp cost <$0.03/order (90%+ free messages)
- ✅ AI cost <$0.0005/order
- ✅ Order accuracy 100% (correct items, quantities, prices)

#### Deliverables
- `lib/gemini-client.ts` - Gemini API wrapper (with persistent tracking)
- `lib/gemini-agents.ts` - Conversational agent + tools
- `lib/whatsapp.ts` - WhatsApp API wrapper
- `lib/messaging-windows.ts` - 24h window enforcement
- `lib/order-processing.ts` - Order lifecycle management
- `app/api/orders/route.ts` - Order processing Edge Function
- `supabase/migrations/0009_gemini_usage_tracking.sql` - BUG-P0-001 fix
- `tests/unit/gemini-agent.test.ts` - Agent tests
- `tests/integration/ordering-flow.test.ts` - E2E ordering tests

#### Approval Gate 2 (End of Week 2)
**Approver**: Product Manager + Technical Lead
**Validation**: 10 real test orders + Gemini usage validation
**Criteria**: See [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-2) for full details
**Rollback**: Disable Gemini, use GPT-4o-mini only (fallback)

---

### Week 3: Supply Side (Jan 25-31)
**Goal**: Restaurants and workers can be onboarded, orders dispatched automatically

#### Milestones
1. **Restaurant Onboarding** (25h)
   - 30-second WhatsApp conversation flow
   - 5 steps: welcome → business info → menu upload → approval → activation
   - Menu extraction (PDF/images → structured data with Gemini Vision)
   - Validation rules (business name, address, tax ID, menu items)
   - Admin approval interface (future: auto-approve with AI moderation)

2. **Worker Dispatch System** (25h)
   - PostGIS-based matching algorithm:
     - Scoring: distance (40%), availability (30%), ratings (20%), capacity (10%)
     - Query optimization: <10ms for worker selection
   - Real-time order assignment via WhatsApp
   - Order acceptance buttons (accept, reject with reason)
   - Navigation links (Google Maps integration)

3. **QR Code System** (10h)
   - Generation: `order_id + timestamp + HMAC signature`
   - Validation: Pickup confirmation (restaurant scans)
   - Delivery confirmation (customer scans)
   - Security: HMAC signing with secret key

4. **Testing + Documentation** (5h)
   - E2E tests: Restaurant onboarding flow
   - Unit tests: Dispatch algorithm (10 scenarios)
   - Load test: 50 concurrent dispatch requests

#### Success Criteria
- ✅ Onboard 3 test restaurants via WhatsApp (<30 seconds each)
- ✅ Menu extraction works (PDF/images → structured menu items)
- ✅ Assign 5 test orders to workers successfully
- ✅ Dispatch query <10ms (p95)
- ✅ QR code pickup/delivery confirmations work
- ✅ Worker acceptance rate >90% (test orders)

#### Deliverables
- `lib/restaurant-onboarding.ts` - Onboarding logic
- `lib/menu-extraction.ts` - Gemini Vision integration
- `lib/dispatch-system.ts` - Worker matching algorithm
- `lib/qr-codes.ts` - QR generation + validation
- `app/api/restaurants/route.ts` - Restaurant management API
- `app/api/dispatch/route.ts` - Worker dispatch API
- `supabase/migrations/0010_restaurant_approval.sql` - Approval workflow
- `tests/integration/restaurant-onboarding.test.ts` - Onboarding E2E
- `tests/unit/dispatch-algorithm.test.ts` - Dispatch tests

#### Approval Gate 3 (End of Week 3)
**Approver**: Operations Lead
**Validation**: Onboard 3 test restaurants, assign 5 test orders
**Criteria**: See [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-3) for full details
**Rollback**: Manual dispatch if algorithm fails

---

### Week 4: Payments + Launch (Feb 1-8)
**Goal**: Payment processing live, 50 restaurants + 20 workers + 500 customers launched

#### Milestones
1. **Stripe Integration** (30h)
   - WhatsApp Flows v3 checkout (3 screens: cart → delivery → payment)
   - Payment intent creation (idempotent, amount validation)
   - Webhook handlers:
     - `payment_intent.succeeded` → Order confirmed
     - `payment_intent.failed` → Retry logic (3 attempts)
     - `charge.refunded` → Order cancelled
   - Failed payment recovery (notify customer, payment link)
   - Refund processing API (customer service)

2. **Cost Tracking Dashboard** (15h)
   - 10 KPIs:
     - Unit economics: Profit/order, margin %
     - AI cost/order (Gemini usage)
     - WhatsApp cost/order (free vs paid messages)
     - Infrastructure cost/order (Vercel + Supabase)
     - Delivery payout/order
     - Customer acquisition cost (CAC)
     - Restaurant commission/order
     - Order volume (daily, weekly)
     - Customer satisfaction (ratings)
     - Worker earnings (daily, weekly)
   - Real-time monitoring (Vercel Analytics + Supabase)

3. **Launch Execution** (10h)
   - **50 Restaurants**: Zona T (25) + Chicó (25) - pre-identified list
   - **20 Workers**: Recruitment via referrals + local ads
   - **500 Customers**: WhatsApp groups, Instagram ads, influencer partnerships
   - Soft launch: Week 3 (internal testing with 5 restaurants)
   - Public launch: Week 4 end (marketing push)

#### Success Criteria
- ✅ Process 20 real paid orders successfully
- ✅ Stripe webhooks handled correctly (succeeded, failed, refunded)
- ✅ Cost tracking accurate (validates $0.86 profit/order)
- ✅ Unit economics maintained: $0.86 profit/order (34% margin)
- ✅ 50 restaurants onboarded (Zona T + Chicó)
- ✅ 20 workers active (earning >$82,000 COP/day average)
- ✅ 500 customers registered
- ✅ 20-30 orders/day (Week 4 end)
- ✅ Customer satisfaction >4.5 stars
- ✅ Restaurant retention >85%

#### Deliverables
- `lib/stripe.ts` - Stripe API wrapper
- `lib/payment-processing.ts` - Payment lifecycle
- `app/api/payments/route.ts` - Payment webhook handler
- `app/api/payments/refund/route.ts` - Refund API
- `components/dashboard/` - Cost tracking dashboard (React components)
- `app/dashboard/page.tsx` - Dashboard page
- `docs/launch/restaurant-list.md` - 50 target restaurants
- `docs/launch/worker-recruitment.md` - Worker recruitment plan
- `docs/launch/customer-acquisition.md` - Customer acquisition strategy
- `tests/integration/payment-flow.test.ts` - Payment E2E tests
- `tests/integration/stripe-webhooks.test.ts` - Webhook tests

#### Approval Gate 4 (End of Week 4)
**Approver**: CEO + CFO
**Validation**: 20 real paid orders, cost tracking validated
**Criteria**: See [APPROVAL-GATES.md](./APPROVAL-GATES.md#gate-4) for full details
**Go/No-Go Decision**: Public launch on 2025-03-01

---

## Critical Path Analysis

### Critical Path (Must Complete Sequentially)

```
┌─────────────┐
│   Week 1    │
│  Database   │─────┐
│  + Webhook  │     │
└─────────────┘     │
                    ▼
              ┌─────────────┐
              │   Week 2    │
              │   Gemini    │─────┐
              │  Ordering   │     │
              └─────────────┘     │
                                  ▼
                            ┌─────────────┐
                            │   Week 3    │
                            │Supply Side  │─────┐
                            │  Dispatch   │     │
                            └─────────────┘     │
                                                ▼
                                          ┌─────────────┐
                                          │   Week 4    │
                                          │  Payments   │
                                          │  + Launch   │
                                          └─────────────┘
```

### Critical Dependencies

| Task | Depends On | Blocker If Delayed |
|------|-----------|-------------------|
| Week 2: Gemini Ordering | Week 1: Database schema | Cannot create orders |
| Week 2: WhatsApp Messages | Week 1: Webhook handler | Cannot receive/send messages |
| Week 2: BUG-P0-001 Fix | Week 1: Supabase setup | May exceed 1,400 req/day |
| Week 3: Restaurant Onboarding | Week 2: Gemini agent | Cannot extract menus |
| Week 3: Worker Dispatch | Week 1: PostGIS functions | Cannot assign orders |
| Week 4: Stripe Integration | Week 2: Order processing | Cannot charge customers |
| Week 4: Launch | All previous weeks | Cannot go live |

### Parallel Work Opportunities

**Week 1 Parallel**:
- Database schema (supabase-expert) || WhatsApp webhook (edge-functions-expert)

**Week 2 Parallel**:
- Gemini agent (gemini-expert) || WhatsApp templates (whatsapp-api-expert)

**Week 3 Parallel**:
- Restaurant onboarding (whatsapp-api-expert) || Worker dispatch (supabase-expert)

**Week 4 Parallel**:
- Stripe integration (backend-developer) || Dashboard (business-analyst)

---

## Dependency Map

### External Dependencies

| Dependency | Type | Status | Risk | Mitigation |
|-----------|------|--------|------|------------|
| Supabase PostgreSQL 15.8 | Infrastructure | ✅ Ready | Low | Backup: Self-hosted Postgres |
| WhatsApp Business API v23.0 | Platform | ✅ Ready | Low | Phone number + token secured |
| Gemini 2.5 Flash FREE tier | AI | ✅ Ready | Medium | 1,400 req/day limit - careful tracking |
| Vercel Edge Functions | Infrastructure | ✅ Ready | Low | Backup: Cloudflare Workers |
| Stripe Payments | Platform | ⚠️ Pending | Low | Need account setup Week 4 |
| Google Maps API | Platform | ⚠️ Pending | Low | For worker navigation |

### Internal Dependencies

| Component | Depends On | Status | Owner |
|-----------|-----------|--------|-------|
| Gemini Agent | Database schema | Week 1 | gemini-expert |
| Order Processing | Gemini agent + Database | Week 2 | backend-developer |
| Dispatch System | PostGIS functions + Workers table | Week 1 | supabase-expert |
| Restaurant Onboarding | Gemini Vision + Restaurants table | Week 2 | whatsapp-api-expert |
| Payment Processing | Order processing + Stripe | Week 2+4 | backend-developer |
| Dashboard | All data tables | Week 1+4 | business-analyst |

---

## Resource Allocation

### Agent Allocation by Week

#### Week 1: Foundation (60h total)
- **supabase-expert** (Sonnet 4.5): 48h (80%)
  - Database schema design + implementation
  - PostGIS functions + optimization
  - pgvector setup
  - RLS policies
  - Migration files

- **edge-functions-expert** (Sonnet 4.5): 12h (20%)
  - WhatsApp webhook handler
  - Fire-and-forget pattern
  - Signature validation
  - Error handling

- **code-reviewer** (Opus): 4h
  - Security audit (RLS, webhook validation)
  - Performance review (PostGIS queries)

#### Week 2: Customer Experience (70h total)
- **gemini-expert** (Sonnet 4.5): 42h (60%)
  - Conversational agent architecture
  - Tool definitions
  - Context management
  - **BUG-P0-001 fix** (CRITICAL)
  - Error handling

- **whatsapp-api-expert** (Sonnet 4.5): 28h (40%)
  - Interactive message templates
  - 24h window optimization
  - Catalog + button + list designs
  - Order confirmation messages

- **business-analyst** (Opus): 6h
  - Unit economics validation
  - Cost tracking per feature

#### Week 3: Supply Side (65h total)
- **whatsapp-api-expert** (Sonnet 4.5): 32.5h (50%)
  - Restaurant onboarding flow
  - Worker notification design
  - QR code system

- **supabase-expert** (Sonnet 4.5): 19.5h (30%)
  - Dispatch algorithm (PostGIS queries)
  - Worker scoring function
  - Real-time matching

- **gemini-expert** (Sonnet 4.5): 13h (20%)
  - Menu extraction (Gemini Vision)
  - Conversational validation

#### Week 4: Payments + Launch (55h total)
- **backend-developer** (Sonnet 4.5): 33h (60%)
  - Stripe integration
  - Payment webhooks
  - Refund processing
  - Failed payment recovery

- **business-analyst** (Opus): 22h (40%)
  - Cost tracking dashboard
  - Launch metrics
  - Unit economics monitoring
  - Launch execution

- **code-reviewer** (Opus): 8h
  - Production readiness audit
  - Security review (payment handling)
  - Performance benchmark validation

### Cross-Cutting Agents (Continuous)

- **general-purpose** (Sonnet 4.5): 20h (across all weeks)
  - Test writing (unit + integration)
  - Documentation updates
  - Bug fixes

- **ui-visual-validator** (Sonnet 4.5): 8h (weekly reviews)
  - WhatsApp message design validation
  - User flow testing
  - Visual regression testing

### Total Agent Hours: 250h

---

## Risk Mitigation

### P0 Risks (Critical - Could Block Launch)

#### Risk 1: Gemini FREE Tier Exceeded (1,400 req/day)
**Likelihood**: High (if BUG-P0-001 not fixed)
**Impact**: $1,400/month cost increase (destroys unit economics)

**Mitigation**:
1. **Week 2 CRITICAL**: Fix BUG-P0-001 (migrate to Supabase tracking)
2. Implement hard limit: Reject requests at 1,350/day (buffer)
3. Fallback chain: Gemini → GPT-4o-mini ($0.000150/1K tokens) → Claude ($0.000800/1K tokens)
4. Monitor daily: Alert at 1,200 requests (85% threshold)

**Contingency**:
- If exceeded: Immediately switch to GPT-4o-mini (10x more expensive but still viable)
- Long-term: Negotiate Gemini Pro tier or migrate to GPT-4o-mini

#### Risk 2: WhatsApp Webhook Timeout (5-second limit)
**Likelihood**: Medium (cold starts + complex processing)
**Impact**: Message loss, poor customer experience

**Mitigation**:
1. **Week 1 CRITICAL**: Fire-and-forget pattern with `waitUntil`
2. Return 200 OK within 1 second (validation only)
3. Process messages asynchronously
4. Retry logic for failed processing
5. Keep-alive connections (Supabase transaction pooling)

**Contingency**:
- If persistent timeouts: Queue messages to Upstash Redis, process separately

#### Risk 3: PostGIS Queries Exceed 10ms Target
**Likelihood**: Medium (location queries can be slow)
**Impact**: Poor dispatch performance, timeout risk

**Mitigation**:
1. **Week 1 CRITICAL**: Spatial indexes on all location columns
2. Partial indexes (only active workers/restaurants)
3. Query optimization (EXPLAIN ANALYZE all functions)
4. Materialized views for common queries
5. Cache results (5-minute TTL for restaurant locations)

**Contingency**:
- If >10ms: Increase tolerance to 50ms, optimize later
- If >50ms: Manual dispatch fallback, fix before launch

### P1 Risks (High - Could Delay Launch)

#### Risk 4: Stripe Payment Failures >5%
**Likelihood**: Low (Stripe is reliable)
**Impact**: Revenue loss, customer frustration

**Mitigation**:
1. Idempotent payment intent creation
2. 3 retry attempts for failed payments
3. Clear error messages (insufficient funds, card declined, etc.)
4. Manual recovery: Send payment link via WhatsApp

**Contingency**:
- If >5% failure rate: Manual payment processing, debug Stripe integration

#### Risk 5: Restaurant Onboarding <80% Success Rate
**Likelihood**: Medium (conversational AI can misunderstand)
**Impact**: Launch delay (need 50 restaurants)

**Mitigation**:
1. **Week 3**: Manual fallback for failed onboardings
2. Pre-onboard 10 restaurants manually before Week 3
3. Clear error messages + human handoff option
4. Admin interface for manual data entry

**Contingency**:
- If <80%: Manual onboarding with admin dashboard

#### Risk 6: Worker Acceptance Rate <70%
**Likelihood**: Medium (workers may reject orders)
**Impact**: Order delays, customer dissatisfaction

**Mitigation**:
1. Attractive earnings: $82,000 COP/day (vs Rappi $20,000)
2. Clear order details (distance, payout, restaurant)
3. Auto-reassign after 2 minutes no response
4. Worker rating system (low acceptance = deprioritized)

**Contingency**:
- If <70%: Increase delivery payout temporarily, recruit more workers

### P2 Risks (Medium - Could Impact Quality)

#### Risk 7: Gemini Hallucinations (Wrong Orders)
**Likelihood**: Low (Gemini 2.5 Flash is reliable)
**Impact**: Wrong orders, refunds, customer dissatisfaction

**Mitigation**:
1. Structured outputs (function calling, not free text)
2. Order confirmation step (user reviews before payment)
3. Validation: Restaurant exists, menu items exist, quantities valid
4. Human review for ambiguous orders

**Contingency**:
- If >2% error rate: Add human review step before order placement

#### Risk 8: WhatsApp 24h Window Not Optimized (>10% Paid Messages)
**Likelihood**: Low (optimization planned)
**Impact**: $0.03 → $0.30 per order (destroys unit economics)

**Mitigation**:
1. **Week 2**: Track messaging windows (Supabase table)
2. Only send free messages within 24h window
3. Batch notifications (1 message vs 5)
4. Template message approval before launch

**Contingency**:
- If >10% paid: Reduce message frequency, batch more aggressively

#### Risk 9: Test Coverage <80%
**Likelihood**: Low (testing baked into each week)
**Impact**: Production bugs, downtime

**Mitigation**:
1. Write tests alongside code (TDD)
2. Integration tests for critical paths (ordering, payments, dispatch)
3. E2E tests (Playwright) for user flows
4. Code review (code-reviewer agent)

**Contingency**:
- If <80%: Delay launch until tests written

#### Risk 10: Launch Targets Not Met (50 Restaurants, 20 Workers, 500 Customers)
**Likelihood**: Medium (acquisition is hard)
**Impact**: Soft launch only, no public launch

**Mitigation**:
1. Pre-identify 50 restaurants (Zona T + Chicó list - Week 4)
2. Start worker recruitment Week 3 (referrals, local ads)
3. Customer acquisition: WhatsApp groups, Instagram ads, influencers (Week 3-4)
4. Soft launch Week 3 (5 restaurants, 20 customers) - validate before scaling

**Contingency**:
- If targets not met: Delay public launch to Week 5-6, continue recruitment

---

## Budget Tracking

### Development Costs (Phase 1)

| Item | Cost | Notes |
|------|------|-------|
| Engineering (250h @ $50/h) | $12,500 | Freelance developer or founder time |
| Supabase (Pro plan - 1 month) | $25 | Database + auth + storage |
| Vercel (Pro plan - 1 month) | $20 | Edge Functions + analytics |
| WhatsApp Business API (setup) | $100 | Meta verification + phone number |
| Gemini API (FREE tier) | $0 | 1,400 req/day, context caching |
| Stripe (no fixed cost) | $0 | 2.9% + $0.30 per transaction (passed to customer) |
| Google Maps API (testing) | $50 | Free tier + overage for testing |
| **Total Phase 1 Development** | **$12,695** | **One-time investment** |

### Operational Costs (Per Order - Post-Launch)

| Cost Category | Amount | Target | Notes |
|--------------|--------|--------|-------|
| **Revenue** | **$2.50** | - | Delivery fee (customer pays) |
| Delivery Payout | $1.40 | - | Worker earnings (56% of revenue) |
| AI Cost (Gemini FREE) | $0.0005 | <$0.001 | Context caching (75% savings) |
| WhatsApp Cost | $0.02 | <$0.03 | 90%+ free messages (24h window) |
| Infrastructure (Vercel + Supabase) | $0.22 | <$0.24 | Edge Functions + DB queries |
| **Total Operational Cost** | **$1.64** | **<$1.75** | **Per order** |
| **Profit Per Order** | **$0.86** | **>$0.80** | **34% margin** |

### Monthly Operational Costs (Post-Launch)

**Assuming 1,000 orders/month (33/day average)**:

| Item | Cost | Notes |
|------|------|-------|
| Supabase Pro | $25 | Database + storage (scales to 10K orders/month) |
| Vercel Pro | $20 | Edge Functions (scales to 100K requests/month) |
| WhatsApp API | $20 | ~1,000 orders × $0.02/order |
| Gemini API | $0 | FREE tier (1,400 req/day = 42K/month) |
| Google Maps API | $10 | Worker navigation (1,000 orders × $0.01) |
| **Total Fixed + Variable** | **$75** | **$0.075 per order (infra only)** |

**At 1,000 orders/month**:
- Revenue: $2,500 ($2.50 × 1,000)
- Delivery Payouts: $1,400 ($1.40 × 1,000)
- Infrastructure: $75
- **Profit: $1,025** ($1.025/order, 41% margin)

**Unit Economics Validation**: ✅ Exceeds $0.86/order target at scale

---

## Success Metrics

### Phase 1 Launch Targets (Week 4 End)

#### Business Metrics
- ✅ **50 Restaurants**: Onboarded (Zona T + Chicó)
- ✅ **20 Workers**: Active rapitenderos
- ✅ **500 Customers**: Registered users
- ✅ **20-30 Orders/Day**: Week 4 end
- ✅ **Customer Satisfaction**: >4.5 stars average
- ✅ **Restaurant Retention**: >85% (still active after 1 week)
- ✅ **Worker Earnings**: $82,000 COP/day average (vs Rappi $20,000)

#### Financial Metrics
- ✅ **Unit Economics**: $0.86 profit/order (34% margin)
- ✅ **AI Cost**: <$0.0005/order (Gemini FREE tier)
- ✅ **WhatsApp Cost**: <$0.03/order (90%+ free messages)
- ✅ **Infrastructure Cost**: <$0.24/order (Vercel + Supabase)
- ✅ **Delivery Payout**: $1.40/order (56% of revenue)
- ✅ **Customer Acquisition Cost (CAC)**: <$5/customer
- ✅ **Restaurant Commission**: 5-10% (vs Rappi 28%)

#### Technical Metrics
- ✅ **Webhook TTFB**: <100ms (p95)
- ✅ **DB Queries**: <50ms (p95)
- ✅ **PostGIS Queries**: <10ms (p95)
- ✅ **Edge Cold Start**: <200ms
- ✅ **WhatsApp Message Delivery**: >99%
- ✅ **Payment Success Rate**: >95%
- ✅ **Gemini Response Time**: <2 seconds (p95)
- ✅ **Test Coverage**: >80% (critical paths)
- ✅ **Uptime**: >99.9% (Vercel SLA)

#### Operational Metrics
- ✅ **Restaurant Onboarding Time**: <30 seconds (WhatsApp flow)
- ✅ **Worker Dispatch Time**: <2 minutes (order assigned)
- ✅ **Worker Acceptance Rate**: >70%
- ✅ **Order Fulfillment Time**: <45 minutes (restaurant to customer)
- ✅ **Customer Support Response**: <5 minutes (Gemini AI)
- ✅ **Refund Rate**: <5%

---

## Launch Readiness Checklist

### Technical Readiness (Week 4)

#### Infrastructure
- [ ] Supabase Pro plan activated (production DB)
- [ ] Vercel Pro plan activated (production Edge Functions)
- [ ] WhatsApp Business API verified (phone number approved)
- [ ] Gemini API key configured (FREE tier tracking live)
- [ ] Stripe account verified (payments enabled)
- [ ] Google Maps API key configured (worker navigation)
- [ ] Domain configured (production URL)
- [ ] SSL certificates valid (HTTPS enforced)

#### Code & Testing
- [ ] All tests pass (>80% coverage)
- [ ] Integration tests pass (ordering, payments, dispatch)
- [ ] E2E tests pass (Playwright - full user flows)
- [ ] Load tests pass (100 concurrent webhook requests <100ms)
- [ ] Security audit complete (code-reviewer)
- [ ] Performance benchmarks validated (webhook <100ms, DB <50ms)
- [ ] BUG-P0-001 fixed (Gemini tracking to Supabase)
- [ ] No P0 or P1 bugs open

#### Monitoring & Alerts
- [ ] Vercel Analytics configured (TTFB, cold starts, errors)
- [ ] Supabase monitoring configured (query performance, connections)
- [ ] Cost tracking dashboard live (unit economics per order)
- [ ] Gemini usage alerts (1,200 req/day threshold)
- [ ] WhatsApp cost alerts (>10% paid messages)
- [ ] Payment failure alerts (>5% failure rate)
- [ ] Worker acceptance alerts (<70% acceptance)
- [ ] On-call rotation established (escalation path)

### Business Readiness (Week 4)

#### Supply Side
- [ ] 50 restaurants identified (Zona T + Chicó list)
- [ ] 50 restaurants contacted (phone + WhatsApp)
- [ ] 30+ restaurants onboarded via WhatsApp (<30s each)
- [ ] 20+ restaurant menus extracted (PDF/images → structured)
- [ ] 50 restaurants approved (admin approval)
- [ ] 20 workers recruited (referrals + local ads)
- [ ] 20 workers onboarded (app installed, trained)
- [ ] 5 test orders completed successfully (soft launch)

#### Demand Side
- [ ] 500 customers registered (WhatsApp groups, Instagram ads, influencers)
- [ ] Customer acquisition strategy documented (CAC <$5)
- [ ] WhatsApp groups created (neighborhood-specific)
- [ ] Instagram ads running (Zona T + Chicó targeting)
- [ ] Influencer partnerships secured (3-5 micro-influencers)
- [ ] Referral program live (customer refers customer)

#### Operations
- [ ] Customer support process defined (Gemini AI + human escalation)
- [ ] Refund policy documented (terms + conditions)
- [ ] Restaurant commission structure agreed (5-10%)
- [ ] Worker payout process defined (daily payouts)
- [ ] Quality control process (order accuracy, ratings)
- [ ] Incident response plan (downtime, payment failures)

### Legal & Compliance (Week 4)

- [ ] Terms of service published (customers, restaurants, workers)
- [ ] Privacy policy published (GDPR/CCPA-ish compliance)
- [ ] Payment processing agreement (Stripe ToS accepted)
- [ ] WhatsApp Business policy compliance (opt-in, 24h window)
- [ ] Colombia tax registration (RUT - Registro Único Tributario)
- [ ] Food safety compliance (not responsible, restaurants are)
- [ ] Worker classification (independent contractors, not employees)

---

## Next Steps After Phase 1

### Week 5-8: Optimization & Scale
- Optimize unit economics (target $1.00 profit/order)
- Scale to 200 restaurants (expand to 5 neighborhoods)
- Scale to 100 workers
- Customer retention (2nd order rate >50%)
- Restaurant retention (>90%)

### Week 9-12: Feature Expansion
- Scheduled orders (order for later)
- Subscriptions (unlimited delivery $10/month)
- Restaurant promotions (happy hour discounts)
- Loyalty program (points + rewards)

### Month 4-6: Market Expansion
- Expand to Medellín (2nd city)
- Expand to Cali (3rd city)
- Multi-city operations
- National brand awareness

---

## References

- [CLAUDE.md](../../CLAUDE.md) - Project overview + constraints
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Detailed task checklist (75 tasks)
- [APPROVAL-GATES.md](./APPROVAL-GATES.md) - Gate criteria + rollback plans
- [DELEGATION-PLAN.md](./DELEGATION-PLAN.md) - Agent mapping per phase
- [week-1-database-spec.md](./week-1-database-spec.md) - Database technical spec
- [week-2-ordering-spec.md](./week-2-ordering-spec.md) - Ordering flow technical spec
- [week-3-supply-spec.md](./week-3-supply-spec.md) - Supply side technical spec
- [week-4-payments-spec.md](./week-4-payments-spec.md) - Payments + launch technical spec
- [Business Model](../weats/business-model-overview.md) - Disruptive model explanation
- [Unit Economics](../weats/unit-economics.md) - $0.86 profit/order breakdown
- [AI Strategy](../weats/ai-strategy-overview.md) - Gemini FREE tier optimization
- [Delegation Matrix](../../.claude/agents/delegation-matrix.md) - Agent routing rules

---

**Status**: Ready for Phase 1 execution
**Owner**: Technical Lead + Product Manager
**Last Review**: 2025-01-11
**Next Review**: After each weekly approval gate
