# WPFoods Phase 1 - Approval Gates

**Version**: 1.0
**Purpose**: Define approval criteria between each week to ensure quality and prevent progression with critical issues
**Last Updated**: 2025-01-11

---

## Overview

### Gate Philosophy
- **Manual approval required** between each week - NO automatic progression
- Each gate has specific **acceptance criteria** that must be met
- **Rollback plans** defined for each gate failure
- **Go/No-Go decisions** made by designated approvers

### Gate Summary

| Gate | Timing | Approver | Duration | Rollback Plan |
|------|--------|----------|----------|---------------|
| Gate 1 | End of Week 1 | Technical Lead | 2h | Revert migrations |
| Gate 2 | End of Week 2 | Product Manager + Tech Lead | 3h | Disable Gemini (use GPT-4o-mini) |
| Gate 3 | End of Week 3 | Operations Lead | 2h | Manual dispatch fallback |
| Gate 4 | End of Week 4 | CEO + CFO | 4h | Delay launch, fix issues |

---

## Gate 1: Foundation Ready

**Timing**: End of Week 1 (Jan 17, 2025)
**Approver**: Technical Lead
**Estimated Duration**: 2 hours

### Acceptance Criteria

#### 1. All Tests Pass (>95% coverage)
```bash
pnpm test
# Expected: All tests pass, coverage >95%
```

**Required Test Suites**:
- ✅ Database integration tests (10 tables CRUD)
- ✅ PostGIS function tests (<10ms performance)
- ✅ pgvector semantic search tests (<50ms performance)
- ✅ RLS policy tests (unauthorized access blocked)
- ✅ Webhook handler tests (signature validation, routing)

#### 2. Performance Benchmarks Met

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Webhook TTFB | <100ms (p95) | Load test: 100 concurrent requests |
| PostGIS queries | <10ms (p95) | `EXPLAIN ANALYZE find_nearby_restaurants` |
| pgvector queries | <50ms (p95) | `EXPLAIN ANALYZE semantic_menu_search` |
| DB query (general) | <50ms (p95) | Supabase dashboard analytics |

**Load Test Command**:
```bash
k6 run tests/load/webhook.js
# Expected: p95 < 100ms, 0 errors
```

#### 3. Manual Test: Create Order via API

```bash
# 1. Create customer
curl -X POST https://your-project.supabase.co/rest/v1/customers \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+573001234567", "name": "Test User"}'

# 2. Create order
curl -X POST https://your-project.supabase.co/rest/v1/orders \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "<customer-id>",
    "restaurant_id": "<restaurant-id>",
    "subtotal": 25000,
    "delivery_fee": 2500,
    "total": 27500,
    "delivery_address": "Test Address",
    "delivery_location": "SRID=4326;POINT(-74.0538 4.6616)"
  }'

# 3. Verify order created and order_number generated
# Expected: order_number format "WPF-20250117-0001"
```

#### 4. Security Audit (code-reviewer)

**Checklist**:
- [ ] RLS policies prevent unauthorized access
- [ ] Webhook signature validation working
- [ ] No SQL injection vulnerabilities (parameterized queries only)
- [ ] No exposed secrets (all in env variables)
- [ ] HTTPS enforced (SSL certificates valid)
- [ ] Foreign key constraints prevent orphaned records

### Validation Process

1. **Run Automated Tests** (30 min)
   ```bash
   pnpm test
   pnpm type-check
   k6 run tests/load/webhook.js
   ```

2. **Performance Review** (30 min)
   - Check Supabase dashboard (query performance)
   - Verify PostGIS/pgvector index usage (`EXPLAIN ANALYZE`)
   - Load test results analysis

3. **Manual Testing** (30 min)
   - Create test order via API
   - Verify webhook handles test message
   - Check RLS policies (attempt unauthorized access)

4. **Code Review** (30 min)
   - Security audit by `code-reviewer` agent
   - Check for common vulnerabilities
   - Verify Edge Runtime compatibility

### Decision

**PASS** if:
- ✅ All tests pass (>95% coverage)
- ✅ Performance targets met (webhook <100ms, PostGIS <10ms, pgvector <50ms)
- ✅ Manual test successful (order created with correct data)
- ✅ Security audit passed (no P0/P1 vulnerabilities)

**FAIL** if:
- ❌ Tests fail or coverage <95%
- ❌ Performance targets not met
- ❌ Manual test fails
- ❌ Security vulnerabilities found

### Rollback Plan (if FAIL)

1. **Identify Issues**
   - Review test failures
   - Identify performance bottlenecks
   - List security vulnerabilities

2. **Revert Migrations** (if database issues)
   ```bash
   # Rollback all Week 1 migrations
   npx supabase db reset
   # Or manually drop tables in reverse order
   ```

3. **Fix Issues**
   - Address test failures
   - Optimize slow queries (add indexes, refactor functions)
   - Fix security vulnerabilities

4. **Re-test**
   - Run full validation process again
   - Repeat until Gate 1 PASS

---

## Gate 2: Customer Ordering Functional

**Timing**: End of Week 2 (Jan 24, 2025)
**Approver**: Product Manager + Technical Lead
**Estimated Duration**: 3 hours

### Acceptance Criteria

#### 1. Complete 10 Test Orders via WhatsApp

**Test Users**: 3 different users (simulated customers)

**Test Scenarios**:
1. **Happy Path** (5 orders)
   - Search restaurants → get menu → add items → checkout → payment
   - Verify order accuracy (100% correct items/quantities/prices)

2. **Error Handling** (3 orders)
   - Invalid restaurant → Gemini suggests alternatives
   - Unavailable menu item → Gemini notifies customer
   - Payment failure → Retry link sent

3. **Edge Cases** (2 orders)
   - Very long menu (20+ items) → Gemini handles pagination
   - Multiple item quantities → Total calculated correctly

**Validation**:
```bash
# Check all 10 orders in database
SELECT order_number, status, total, created_at
FROM orders
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC
LIMIT 10;

# Verify 100% accuracy
# - All items correct
# - Quantities correct
# - Prices match menu_items table
```

#### 2. Gemini FREE Tier Compliance

**BUG-P0-001 Fix Verification**:
```bash
# 1. Check current Gemini usage
SELECT * FROM gemini_usage WHERE date = CURRENT_DATE;

# 2. Restart Edge Function (simulate cold start)
# Deploy new version to Vercel or restart local server

# 3. Make test request
# Verify usage count persisted (not reset to 0)

# 4. Verify hard limit enforcement
# Attempt 1,351st request (should be rejected)
```

**Acceptance**:
- ✅ Usage tracking persists across cold starts
- ✅ Current usage <1,400 requests/day
- ✅ Hard limit enforced (reject at 1,350)
- ✅ Alert triggered at 1,200 (85% threshold)

#### 3. Unit Economics Validation

**Per-Order Cost Analysis**:
```typescript
// Run cost analysis on 10 test orders
const results = await Promise.all(
  testOrders.map(order => trackOrderCosts(order.id))
);

const avgAICost = average(results.map(r => r.aiCost));
const avgWhatsAppCost = average(results.map(r => r.whatsappCost));

console.log({
  avgAICost,  // Target: <$0.0005
  avgWhatsAppCost,  // Target: <$0.03
  totalMessagingCost: avgAICost + avgWhatsAppCost,  // Target: <$0.035
});
```

**Acceptance**:
- ✅ AI cost <$0.0005/order (Gemini FREE tier + context caching)
- ✅ WhatsApp cost <$0.03/order (90%+ free messages)
- ✅ Total messaging + AI cost <$0.035/order

#### 4. Colombian Spanish Quality

**Manual Review** (Product Manager):
- Review 10 Gemini responses (from test orders)
- Verify Colombian Spanish usage (vos, parcero, etc.)
- Verify friendly tone + concise responses
- Verify correct recommendations (cuisine, dishes)

**Acceptance**:
- ✅ All responses in Colombian Spanish (not Spain Spanish)
- ✅ Friendly and professional tone
- ✅ Concise (2-3 sentences max per response)
- ✅ Accurate recommendations (no hallucinations)

### Decision

**PASS** if:
- ✅ 10 test orders completed successfully (100% accuracy)
- ✅ BUG-P0-001 fixed (usage tracking persists)
- ✅ Gemini usage <1,400/day, hard limit working
- ✅ Unit economics met (AI <$0.0005, WhatsApp <$0.03)
- ✅ Colombian Spanish quality approved

**FAIL** if:
- ❌ Test orders fail or accuracy <100%
- ❌ BUG-P0-001 not fixed (usage resets on cold start)
- ❌ Gemini usage exceeds 1,400/day or limit not enforced
- ❌ Unit economics not met
- ❌ Spanish quality issues (not Colombian, rude tone, verbose)

### Rollback Plan (if FAIL)

**If BUG-P0-001 not fixed**:
1. Temporarily disable Gemini
2. Fall back to GPT-4o-mini (10x more expensive but reliable)
3. Track usage with Helicone or LangSmith
4. Fix BUG-P0-001 before re-enabling Gemini

**If unit economics not met**:
1. Analyze cost breakdown per order
2. Optimize context caching (increase cache hit rate)
3. Reduce Gemini calls (batch operations)
4. Optimize WhatsApp 24h window usage (batch notifications)

**If Spanish quality issues**:
1. Refine system prompt (add more Colombian examples)
2. Add few-shot examples (Colombian conversations)
3. Fine-tune temperature (lower = more consistent)

---

## Gate 3: Supply Side Ready

**Timing**: End of Week 3 (Jan 31, 2025)
**Approver**: Operations Lead
**Estimated Duration**: 2 hours

### Acceptance Criteria

#### 1. Onboard 3 Test Restaurants (<30 seconds each)

**Onboarding Process**:
1. Welcome message → name input
2. Business info collection (address, NIT, phone)
3. Menu upload (PDF, image, or text)
4. Admin approval
5. Activation confirmation

**Timing Validation**:
```bash
# Measure onboarding time per restaurant
# Start: Welcome message sent
# End: Activation confirmation sent

# Target: <30 seconds average
```

**Acceptance**:
- ✅ 3 restaurants onboarded successfully
- ✅ Average onboarding time <30 seconds
- ✅ Menu extraction >80% accuracy (name + price)
- ✅ All restaurants approved + activated

#### 2. Assign 5 Test Orders to Workers

**Dispatch Testing**:
```bash
# Create 5 test orders with different scenarios
# 1. Closest worker (distance priority)
# 2. Highest rated worker (rating priority)
# 3. Least busy worker (capacity priority)
# 4. No available workers (NULL returned → manual dispatch)
# 5. Worker rejects → reassign to next worker

# Measure dispatch time for each
SELECT
  order_id,
  worker_id,
  EXTRACT(EPOCH FROM (assigned_at - created_at)) AS dispatch_time_seconds
FROM deliveries
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC
LIMIT 5;

# Target: <10ms average (in practice, <1 second including network latency)
```

**Acceptance**:
- ✅ 5 orders assigned successfully (or NULL if no workers)
- ✅ Dispatch query <10ms (p95)
- ✅ Workers receive notifications correctly
- ✅ Worker acceptance buttons work (accept/reject)
- ✅ Reassignment works (if worker rejects)

#### 3. QR Code Pickup/Delivery Confirmation

**QR Testing**:
```bash
# 1. Generate QR code for test order
const qrImage = await generatePickupQR('test-order-id');
# Verify QR image generated (base64 data URL)

# 2. Scan QR (pickup confirmation)
const valid = await validatePickupQR(qrData);
# Verify: order status → picked_up, pickup_time set

# 3. Scan QR (delivery confirmation)
const valid2 = await validatePickupQR(qrData);
# Verify: order status → delivered, delivery_time set, worker payout triggered
```

**Acceptance**:
- ✅ QR codes generated correctly (valid HMAC signature)
- ✅ Pickup confirmation updates order status
- ✅ Delivery confirmation updates order status + triggers payout
- ✅ Invalid QR codes rejected (expired, wrong signature)

### Decision

**PASS** if:
- ✅ 3 restaurants onboarded (<30s each, menu extraction >80%)
- ✅ 5 orders dispatched successfully (<10ms query, workers notified)
- ✅ QR confirmation system working (pickup + delivery)

**FAIL** if:
- ❌ Restaurant onboarding >30 seconds or menu extraction <80%
- ❌ Dispatch query >10ms or workers not notified
- ❌ QR system not working

### Rollback Plan (if FAIL)

**If onboarding too slow**:
1. Optimize Gemini calls (reduce API calls)
2. Add manual onboarding fallback (admin dashboard)

**If dispatch too slow**:
1. Optimize PostGIS query (add indexes)
2. Use materialized view for worker stats
3. Manual dispatch fallback (operations team assigns workers via admin dashboard)

**If QR system fails**:
1. Manual confirmation via WhatsApp buttons (worker sends photo proof)
2. Fix QR generation/validation issues
3. Re-test

---

## Gate 4: Production Ready (Go/No-Go)

**Timing**: End of Week 4 (Feb 8, 2025)
**Approver**: CEO + CFO
**Estimated Duration**: 4 hours
**Stakes**: **GO/NO-GO decision for public launch (2025-03-01)**

### Acceptance Criteria

#### 1. Process 20 Real Paid Orders (>95% success rate)

**Real Orders**: Not test orders - actual paying customers

**Validation**:
```sql
SELECT
  order_number,
  total,
  status,
  payments.status AS payment_status,
  created_at
FROM orders
JOIN payments ON orders.id = payments.order_id
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND payments.status = 'succeeded'
ORDER BY created_at DESC
LIMIT 20;

-- Verify:
-- - 20 orders with succeeded payments
-- - Success rate = (succeeded_payments / total_payment_attempts) > 95%
```

**Acceptance**:
- ✅ 20 real paid orders processed
- ✅ Payment success rate >95% (max 1 failure allowed)
- ✅ All orders fulfilled (restaurant → worker → customer)
- ✅ Customer satisfaction >4.5 stars (ask for rating)

#### 2. Unit Economics Validated ($0.86 profit/order)

**Cost Dashboard Analysis**:
```typescript
const kpis = await getDashboardKPIs({
  start: new Date('2025-02-01'),
  end: new Date('2025-02-08'),
});

console.log({
  profitPerOrder: kpis.profitPerOrder,  // Target: $0.86
  margin: kpis.margin,  // Target: 34%
  aiCostPerOrder: kpis.aiCostPerOrder,  // Target: <$0.0005
  whatsappCostPerOrder: kpis.whatsappCostPerOrder,  // Target: <$0.03
  infrastructureCostPerOrder: kpis.infrastructureCostPerOrder,  // Target: <$0.24
});
```

**Acceptance**:
- ✅ Profit per order ≥ $0.86 (34% margin)
- ✅ AI cost <$0.0005/order
- ✅ WhatsApp cost <$0.03/order
- ✅ Infrastructure cost <$0.24/order
- ✅ No unexpected cost overruns

#### 3. Launch Targets Met

**Supply Side**:
- ✅ 50 restaurants onboarded (Zona T + Chicó)
  - Verify: `SELECT COUNT(*) FROM restaurants WHERE status = 'approved';`
  - Target: ≥30 (60% conversion)

- ✅ 20 workers active
  - Verify: `SELECT COUNT(*) FROM delivery_workers WHERE status = 'active';`
  - Target: ≥20

**Demand Side**:
- ✅ 500 customers registered
  - Verify: `SELECT COUNT(*) FROM customers;`
  - Target: ≥500

- ✅ 20-30 orders/day (Week 4 end)
  - Verify: `SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE;`
  - Target: ≥20

#### 4. Security Audit (code-reviewer)

**Production Readiness Checklist**:
- [ ] Payment handling secure (PCI-DSS via Stripe)
- [ ] No exposed secrets (all in Vercel env vars)
- [ ] RLS policies prevent unauthorized access
- [ ] Webhook signature validation (WhatsApp + Stripe)
- [ ] No SQL injection vulnerabilities
- [ ] HTTPS enforced (SSL certificates valid)
- [ ] Rate limiting configured (Vercel Edge config)
- [ ] Error monitoring (Sentry or Vercel Analytics)
- [ ] Backup/recovery plan (Supabase automated backups)

#### 5. Performance Benchmarks Maintained

**Final Load Tests**:
```bash
# Webhook TTFB
k6 run tests/load/webhook.js
# Expected: p95 <100ms, 0 errors

# Payment processing
k6 run tests/load/payments.js
# Expected: p95 <3 seconds

# Dispatch
k6 run tests/load/dispatch.js
# Expected: p95 <10ms
```

**Acceptance**:
- ✅ Webhook TTFB <100ms (p95)
- ✅ DB queries <50ms (p95)
- ✅ PostGIS queries <10ms (p95)
- ✅ Payment processing <3 seconds (p95)
- ✅ Edge cold start <200ms

### Decision

**GO (Public Launch 2025-03-01)** if:
- ✅ 20 real paid orders (>95% success rate)
- ✅ Unit economics validated ($0.86 profit/order)
- ✅ Launch targets met (30+ restaurants, 20 workers, 500 customers, 20+ orders/day)
- ✅ Security audit passed
- ✅ Performance benchmarks maintained

**NO-GO (Delay Launch)** if:
- ❌ Payment success rate <95%
- ❌ Unit economics not met (profit <$0.80/order)
- ❌ Launch targets not met (<30 restaurants or <20 orders/day)
- ❌ Security vulnerabilities found
- ❌ Performance issues (webhook >100ms, payments >5s)

### Rollback Plan (if NO-GO)

**Delay Launch Timeline**:
- Week 5-6: Fix critical issues
- Re-run Gate 4 validation
- New GO/NO-GO decision

**Common Issues + Fixes**:

1. **Payment failures >5%**
   - Investigate Stripe errors (logs)
   - Test different payment methods (debit/credit cards)
   - Improve error messaging (clearer instructions)
   - Add manual payment recovery (support team)

2. **Unit economics not met**
   - Analyze cost breakdown (identify high-cost areas)
   - Optimize Gemini usage (reduce API calls, increase caching)
   - Optimize WhatsApp 24h window (batch messages)
   - Negotiate better pricing (Stripe, Supabase, Vercel)

3. **Launch targets not met**
   - Extend outreach (more restaurants, workers, customers)
   - Improve value proposition (case studies, testimonials)
   - Offer launch incentives (first month free commission)
   - Partner with influencers (local food bloggers)

4. **Security vulnerabilities**
   - Fix immediately (no launch until resolved)
   - Penetration testing (hire security firm)
   - Code review (multiple developers)

5. **Performance issues**
   - Optimize slow queries (add indexes, refactor)
   - Scale infrastructure (upgrade Supabase plan)
   - CDN for static assets (Vercel Edge Network)
   - Caching layer (Redis for frequent queries)

---

## Gate Summary Table

| Gate | Timing | Key Criteria | Rollback | Decision Maker |
|------|--------|-------------|----------|----------------|
| **Gate 1** | Week 1 End | Tests pass, performance met, security audit | Revert migrations | Technical Lead |
| **Gate 2** | Week 2 End | 10 test orders, BUG-P0-001 fixed, unit economics | Disable Gemini (use GPT-4o-mini) | PM + Tech Lead |
| **Gate 3** | Week 3 End | 3 restaurants, 5 dispatches, QR working | Manual dispatch fallback | Operations Lead |
| **Gate 4** | Week 4 End | 20 paid orders, unit economics, launch targets | Delay launch, fix issues | CEO + CFO |

---

## References

- [ROADMAP.md](./ROADMAP.md) - Phase 1 timeline
- [PHASE-1-CHECKLIST.md](./PHASE-1-CHECKLIST.md) - Task tracking
- [week-1-database-spec.md](./week-1-database-spec.md) - Week 1 criteria
- [week-2-ordering-spec.md](./week-2-ordering-spec.md) - Week 2 criteria
- [week-3-supply-spec.md](./week-3-supply-spec.md) - Week 3 criteria
- [week-4-payments-spec.md](./week-4-payments-spec.md) - Week 4 criteria

---

**Last Updated**: 2025-01-11
**Next Review**: After each weekly gate
**Status**: Ready for Phase 1 execution
