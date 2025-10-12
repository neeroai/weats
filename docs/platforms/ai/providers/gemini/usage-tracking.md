# Gemini FREE Tier Usage Tracking

Persistent tracking system for Gemini 2.5 Flash FREE tier (1,400 req/day limit).

---

## The Problem: BUG-P0-001 (CRITICAL)

**Issue:** Original implementation used in-memory tracking → resets on Edge Function cold starts.

**Impact:** May exceed 1,500 req/day without detection → unexpected costs, FREE tier revoked.

**Location:** `lib/gemini-client.ts:122-187`

**Priority:** P0 - Must fix before production launch (Week 2, Gate 2 blocker)

---

## Solution: Persistent Supabase Tracking

Migrate from in-memory counter to Supabase table with atomic increments.

### Step 1: Create Table

```sql
-- supabase/migrations/XXX_gemini_usage_tracking.sql
CREATE TABLE gemini_usage (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  requests INT NOT NULL DEFAULT 0,
  tokens BIGINT NOT NULL DEFAULT 0,
  UNIQUE(date)
);

-- Index for fast date lookups
CREATE INDEX gemini_usage_date_idx ON gemini_usage(date);

-- Function for atomic increment (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_gemini_usage(
  p_tokens BIGINT DEFAULT 0
)
RETURNS TABLE (
  current_requests INT,
  current_tokens BIGINT
) AS $$
DECLARE
  today DATE := CURRENT_DATE;
BEGIN
  -- Upsert: increment if exists, insert if not
  INSERT INTO gemini_usage (date, requests, tokens)
  VALUES (today, 1, p_tokens)
  ON CONFLICT (date)
  DO UPDATE SET
    requests = gemini_usage.requests + 1,
    tokens = gemini_usage.tokens + p_tokens;

  -- Return current totals
  RETURN QUERY
  SELECT gu.requests, gu.tokens
  FROM gemini_usage gu
  WHERE gu.date = today;
END $$ LANGUAGE plpgsql;
```

### Step 2: Update Client Code

**Before (In-Memory - BROKEN):**
```typescript
// ❌ BAD: Resets on cold start
let dailyRequestCount = 0;
const DAILY_LIMIT = 1400;

function canUseGemini() {
  return dailyRequestCount < DAILY_LIMIT;  // WRONG: resets to 0 on cold start
}

async function callGemini() {
  dailyRequestCount++;  // Lost on next cold start
  // ...
}
```

**After (Supabase - CORRECT):**
```typescript
// ✅ GOOD: Persistent across cold starts
import { createClient } from '@supabase/supabase-js';

const DAILY_LIMIT = 1400;  // Soft limit (100-request buffer)

async function canUseGemini(): Promise<boolean> {
  const supabase = getSupabaseClient();

  // Check today's usage
  const { data } = await supabase
    .from('gemini_usage')
    .select('requests')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  const currentRequests = data?.requests ?? 0;
  return currentRequests < DAILY_LIMIT;
}

async function trackGeminiUsage(tokenCount: number): Promise<void> {
  const supabase = getSupabaseClient();

  // Atomic increment (race-condition safe)
  const { data } = await supabase.rpc('increment_gemini_usage', {
    p_tokens: tokenCount
  });

  // Log if approaching limit
  if (data && data[0].current_requests >= DAILY_LIMIT * 0.8) {
    console.warn(`Gemini usage at ${data[0].current_requests}/${DAILY_LIMIT} (${Math.round(data[0].current_requests / DAILY_LIMIT * 100)}%)`);
  }

  // Switch to fallback if exceeded
  if (data && data[0].current_requests >= DAILY_LIMIT) {
    console.error(`Gemini FREE tier exhausted (${data[0].current_requests}/${DAILY_LIMIT}). Falling back to GPT-4o-mini.`);
  }
}
```

### Step 3: Integration with Provider Selection

```typescript
import { selectProvider } from '@/lib/ai-providers';

async function generateResponse(userMessage: string) {
  // Automatic provider selection based on Gemini quota
  const provider = await selectProvider({ freeOnly: false });

  // Chain:
  // 1. Gemini 2.5 Flash (FREE) - if dailyRequests < 1,400
  // 2. GPT-4o-mini ($0.00005/msg) - if Gemini exhausted
  // 3. Claude Sonnet ($0.0003/msg) - emergency only

  switch (provider.name) {
    case 'gemini':
      const response = await generateWithGemini(userMessage);
      await trackGeminiUsage(response.usage.totalTokens);
      return response;

    case 'openai':
      console.warn('Using GPT-4o-mini fallback (Gemini exhausted)');
      return await generateWithOpenAI(userMessage);

    case 'claude':
      console.error('Using Claude Sonnet emergency fallback');
      return await generateWithClaude(userMessage);
  }
}
```

---

## Three-AI Quota Sharing

**Weats.ai uses 1 Gemini FREE tier shared across 3 AIs:**
- Weats.Client: ~60% (840 req/day) - highest volume, customer interactions
- Weats.Restaurant: ~25% (350 req/day) - medium volume, order management
- Weats.Runner: ~15% (210 req/day) - lowest volume, dispatch coordination

### Dynamic Allocation

```typescript
async function getAIQuota(aiType: 'client' | 'restaurant' | 'runner'): Promise<number> {
  const supabase = getSupabaseClient();

  // Get total usage today
  const { data } = await supabase
    .from('gemini_usage')
    .select('requests')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  const totalUsed = data?.requests ?? 0;
  const remaining = Math.max(0, DAILY_LIMIT - totalUsed);

  // Allocate based on predicted usage
  const allocations = {
    client: 0.60,      // 60% to Client AI
    restaurant: 0.25,  // 25% to Restaurant AI
    runner: 0.15       // 15% to Runner AI
  };

  return Math.floor(remaining * allocations[aiType]);
}

async function canAIUseGemini(aiType: 'client' | 'restaurant' | 'runner'): Promise<boolean> {
  const quota = await getAIQuota(aiType);

  // Track usage per AI (optional - for analytics)
  const { data } = await supabase
    .from('gemini_ai_usage')
    .select('requests_today')
    .eq('ai_type', aiType)
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  const aiUsed = data?.requests_today ?? 0;
  return aiUsed < quota;
}
```

---

## Monitoring & Alerts

### Daily Usage Report

```typescript
// Run via cron: /api/cron/gemini-usage-report
export async function GET(req: Request): Promise<Response> {
  const supabase = getSupabaseClient();

  const { data } = await supabase
    .from('gemini_usage')
    .select('*')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  if (!data) {
    return new Response(JSON.stringify({ message: 'No usage today' }));
  }

  const usage = {
    date: data.date,
    requests: data.requests,
    tokens: data.tokens,
    limit: DAILY_LIMIT,
    percentage: Math.round((data.requests / DAILY_LIMIT) * 100),
    remaining: DAILY_LIMIT - data.requests,
    status: data.requests >= DAILY_LIMIT ? 'EXHAUSTED' :
            data.requests >= DAILY_LIMIT * 0.8 ? 'WARNING' : 'OK'
  };

  // Alert if >80% used
  if (usage.percentage >= 80) {
    console.warn('Gemini usage alert', usage);
    // TODO: Send notification (Slack, email, etc.)
  }

  return new Response(JSON.stringify(usage));
}
```

**vercel.json cron schedule:**
```json
{
  "crons": [
    {
      "path": "/api/cron/gemini-usage-report",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

### Analytics View

```sql
-- Weekly usage trends
CREATE VIEW gemini_usage_weekly AS
SELECT
  DATE_TRUNC('week', date) AS week,
  SUM(requests) AS total_requests,
  AVG(requests) AS avg_requests_per_day,
  MAX(requests) AS peak_requests,
  SUM(tokens) AS total_tokens
FROM gemini_usage
WHERE date >= CURRENT_DATE - INTERVAL '8 weeks'
GROUP BY DATE_TRUNC('week', date)
ORDER BY week DESC;
```

**Query:**
```sql
SELECT * FROM gemini_usage_weekly;
```

**Returns:**
```json
[
  {
    "week": "2025-10-06",
    "total_requests": 8400,
    "avg_requests_per_day": 1200,
    "peak_requests": 1380,
    "total_tokens": 2500000
  }
]
```

---

## Cost Optimization

### Context Caching (75% Savings)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Enable context caching for repeated context (menu data, restaurant info)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-002',
  systemInstruction: {
    role: 'system',
    parts: [{ text: systemPrompt }],
    // Cache system prompt + static context (restaurant menu, etc.)
    // Saves 75% on input tokens for subsequent requests
  },
});

// Cached tokens: $0.00 (within FREE tier)
// Non-cached tokens: Normal rate
```

### Batch Processing

```typescript
// ✅ GOOD: Batch similar requests
const responses = await Promise.all([
  generateWithGemini(message1),
  generateWithGemini(message2),
  generateWithGemini(message3)
]);

// Uses 3 requests, but parallel = faster
// Track once at end:
await trackGeminiUsage(
  responses.reduce((sum, r) => sum + r.usage.totalTokens, 0)
);
```

---

## Testing

### Unit Tests

```typescript
import { canUseGemini, trackGeminiUsage } from '@/lib/gemini-client';

describe('Gemini Usage Tracking', () => {
  it('should return true when under limit', async () => {
    const canUse = await canUseGemini();
    expect(canUse).toBe(true);
  });

  it('should track usage atomically', async () => {
    await trackGeminiUsage(1000);

    const { data } = await supabase
      .from('gemini_usage')
      .select('requests, tokens')
      .eq('date', new Date().toISOString().split('T')[0])
      .single();

    expect(data?.requests).toBeGreaterThan(0);
    expect(data?.tokens).toBeGreaterThan(0);
  });

  it('should fallback when limit exceeded', async () => {
    // Mock: Simulate 1,400 requests used
    await supabase.from('gemini_usage').upsert({
      date: new Date().toISOString().split('T')[0],
      requests: 1400,
      tokens: 5000000
    });

    const canUse = await canUseGemini();
    expect(canUse).toBe(false);
  });
});
```

---

## Rollout Plan (Week 2)

**Task 2.5:** BUG-P0-001 Fix (Priority: P0, Estimate: 1 hour)

1. Create `gemini_usage` table migration
2. Create `increment_gemini_usage()` function
3. Update `lib/gemini-client.ts` to use Supabase
4. Update `lib/ai-providers.ts` for fallback cascade
5. Add monitoring cron job
6. Write unit tests
7. Deploy to staging
8. Validate with 100 test requests
9. Deploy to production

**Acceptance Criteria:**
- ✅ Usage persists across cold starts
- ✅ Atomic increments (no race conditions)
- ✅ Fallback to GPT-4o-mini when limit exceeded
- ✅ Monitoring alerts at 80% threshold
- ✅ All tests pass (>95% success rate)

**Reference:** `docs/implementation/week-2-ordering-spec.md`

---

## Related Documentation

- [cost-optimization.md](./cost-optimization.md) - FREE tier optimization strategies
- [context-caching.md](./context-caching.md) - 75% cost savings with caching
- [function-calling.md](./function-calling.md) - Tool use patterns
- [api.md](./api.md) - Complete Gemini API reference

---

**Last Updated**: 2025-10-12
**Priority**: P0 - CRITICAL (Gate 2 blocker)
**Estimate**: 1 hour implementation
**Provider**: Google Gemini 2.5 Flash FREE tier (1,400 req/day)
**Project**: Weats.ai (Three-AI shared quota across Client/Restaurant/Runner)
