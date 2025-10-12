# Edge Functions Core Patterns

Essential patterns for Vercel Edge Runtime in the Weats.ai platform.

---

## Fire-and-Forget Pattern

**Critical for WhatsApp webhooks** - respond within 5s timeout while processing asynchronously.

### Using waitUntil (Recommended)

```typescript
export const runtime = 'edge'; // Required for Edge Functions

import { waitUntil } from '@vercel/functions';

export async function POST(req: Request): Promise<Response> {
  // Lazy initialization
  const client = getSupabaseClient();

  // Quick validation (HMAC signature)
  const payload = await validateWhatsAppWebhook(req);

  // Return 200 immediately (5s WhatsApp timeout)
  waitUntil(
    processOrderMessage(payload).catch(err => logger.error(err))
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'content-type': 'application/json' }
  });
}
```

**Key benefits:**
- WhatsApp receives 200 response in <100ms
- Processing continues in background (up to 25s timeout)
- Exceptions don't crash the webhook handler
- Logs all errors for observability

**Reference:** Used in `app/api/whatsapp/webhook/route.ts` for all message processing.

---

## Edge Runtime Constraints

### Allowed (Edge APIs)

✅ **Static imports only**
```typescript
import { sendMessage } from '@/lib/whatsapp';  // OK
```

✅ **Web APIs**
```typescript
fetch(), Request, Response, URL, Headers, AbortController
crypto.subtle, crypto.getRandomValues
TextEncoder, TextDecoder, atob, btoa
```

✅ **Minimal top-level code**
```typescript
export const runtime = 'edge';
const CONFIG = { timeout: 30000 };  // OK - static config
```

### Forbidden (Node.js APIs)

❌ **Dynamic imports**
```typescript
const module = await import('@/lib/heavy');  // BREAKS cold start
```

❌ **Node.js built-ins**
```typescript
import fs from 'fs';           // ❌ File system
import child_process from 'child_process';  // ❌ Processes
import crypto from 'crypto';   // ❌ Use Web Crypto instead
```

❌ **Unbounded memory**
```typescript
const cache = new Map();  // ❌ Grows infinitely
cache.set(key, value);    // No TTL cleanup = memory leak
```

---

## Minimal Top-Level Code

**Problem:** Heavy initialization on every cold start adds 100-500ms latency.

**Solution:** Lazy initialization with caching.

### Before (Slow)
```typescript
// BAD: Runs on every cold start
const supabase = createClient(url, key);
const gemini = new GoogleGenerativeAI(apiKey);
const stripe = new Stripe(secretKey);
```

### After (Fast)
```typescript
// GOOD: Initialize on first use
let cachedSupabase: SupabaseClient | null = null;

function getSupabaseClient() {
  if (!cachedSupabase) {
    cachedSupabase = createClient(url, key);
  }
  return cachedSupabase;
}

export async function POST(req: Request): Promise<Response> {
  const client = getSupabaseClient();  // <1ms after first call
  // ...
}
```

**Improvement:** Cold start drops from 300ms → <100ms.

---

## Bundle Size Optimization

### Target Sizes

| Plan | Limit (after gzip) |
|------|-------------------|
| Hobby | 1 MB |
| Pro | 2 MB |
| Enterprise | 4 MB |

### Tree-Shaking

Use named imports for tree-shaking:

```typescript
// ✅ GOOD: Tree-shakeable (only imports used functions)
import { sendText, sendReaction } from '@/lib/whatsapp';

// ❌ BAD: Includes entire module
import * as whatsapp from '@/lib/whatsapp';
whatsapp.sendText(...);
```

### Check Bundle Size

```bash
npm run build
npx vite-bundle-visualizer

# Target: <1.5MB gzipped for Weats platform
```

---

## Error Handling

**CRITICAL:** Never return 5xx to WhatsApp webhooks - causes retry storms.

### Pattern

```typescript
try {
  await criticalOperation();
} catch (error) {
  // Structured logging
  console.error('Operation failed', {
    error: error.message,
    context: { userId, orderId },
    timestamp: new Date().toISOString()
  });

  // ALWAYS return 200 to WhatsApp (prevents retry storms)
  return new Response(JSON.stringify({ success: false }), { status: 200 });
}
```

**Why?** WhatsApp retries all 5xx responses → duplicate messages, infinite loops, cascading failures.

---

## Performance Targets

| Metric | Target | Weats Current |
|--------|--------|---------------|
| TTFB (webhook) | <100ms | ~45ms p50 |
| Cold start | <200ms | ~120ms |
| Memory usage | <100MB | ~60-80MB |
| Bundle size | <1.5MB | ~1.2MB |

---

## Related Documentation

- [edge-functions-optimization.md](./edge-functions-optimization.md) - Full optimization guide
- [supabase-integration.md](./supabase-integration.md) - Database connection patterns
- [edge-security-guide.md](./edge-security-guide.md) - Security best practices
- [edge-error-handling.md](./edge-error-handling.md) - Advanced error handling

---

**Last Updated**: 2025-10-12
**Platform**: Vercel Edge Runtime
**Project**: Weats.ai (Three-AI Conversational Food Delivery)
