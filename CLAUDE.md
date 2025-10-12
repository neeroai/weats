# CLAUDE.md - WPFoods Platform
<!-- Mantener bajo 5000 tokens. Última actualización: 2025-01-11 -->

## 🎯 Contexto del Proyecto
**Propósito**: Disrumpir el mercado de food delivery colombiano con plataforma WhatsApp-nativa impulsada por IA Gemini (FREE tier only)
**Estado**: MVP Ready - Listo para implementación Phase 1 (Weeks 1-4)
**Inicio**: 2025-01-11 | **Launch**: 2025-03-01 (Bogotá beachhead)

**Diferenciador**: 91% lower costs vs Rappi → beneficia a TODOS los stakeholders

## 🛠 Stack Técnico
```yaml
frontend: Next.js 15, React 19, TypeScript 5.9.2 (strict)
backend: Vercel Edge Functions (<100ms TTFB)
database: Supabase PostgreSQL 15.8 + PostGIS + pgvector
messaging: WhatsApp Business API v23.0 (24h window optimization)
ai: Gemini 2.5 Flash FREE tier ONLY (1,400 req/day limit)
payments: Stripe
testing: Jest, @testing-library/react
ci/cd: GitHub Actions + Vercel
```

## 📁 Estructura Crítica
```
wpfoods/
├── app/api/              # Edge Functions (webhook handlers)
│   ├── whatsapp/webhook/ # Main WhatsApp entry (fire-and-forget)
│   ├── orders/           # Order processing
│   ├── restaurants/      # Restaurant management
│   ├── dispatch/         # Worker assignment (PostGIS)
│   └── payments/         # Stripe integration
├── lib/                  # Core business logic
│   ├── gemini-client.ts  # Gemini FREE tier tracking (CRITICAL)
│   ├── gemini-agents.ts  # Conversational AI (Colombian Spanish)
│   ├── supabase.ts       # Edge-compatible client (port 6543)
│   ├── whatsapp.ts       # WhatsApp API wrapper
│   ├── messaging-windows.ts # 24h window enforcement
│   ├── order-processing.ts  # Order lifecycle
│   └── dispatch-system.ts   # Worker matching (PostGIS)
├── components/           # React components (future admin dashboard)
├── types/                # TypeScript definitions
├── tests/                # Test suites (>80% coverage target)
└── supabase/migrations/  # Database schema (10 tables)
```

## 🔧 Configuración Esencial
```bash
# Comandos frecuentes
pnpm dev                 # Puerto 3000 (local development)
pnpm build               # Build for Vercel Edge deployment
pnpm test                # Jest tests
pnpm type-check          # TypeScript validation

# Variables de entorno requeridas (.env.local)
SUPABASE_URL=            # Supabase project URL
SUPABASE_ANON_KEY=       # Public anon key
SUPABASE_SERVICE_KEY=    # Service role key (server-only)
WHATSAPP_PHONE_ID=       # WhatsApp Business phone number ID
WHATSAPP_TOKEN=          # WhatsApp API token
WHATSAPP_WEBHOOK_SECRET= # Webhook signature verification
GEMINI_API_KEY=          # Google Gemini API key (FREE tier)
STRIPE_PUBLISHABLE_KEY=  # Stripe public key
STRIPE_SECRET_KEY=       # Stripe secret key
VERCEL_URL=              # Deployment URL (auto-set by Vercel)
```

## 📐 Convenciones de Código
- **Naming**: camelCase variables, PascalCase components, SCREAMING_SNAKE_CASE constants
- **Imports**: Absolute paths `@/lib/...` (configured in tsconfig.json)
- **Types**: TypeScript strict mode - NO `any` types allowed
- **Commits**: Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **Max line**: 100 characters
- **CRÍTICO**:
  - Toda lógica backend debe ser Edge Runtime compatible
  - Solo usar Gemini 2.5 Flash (FREE tier) - NO otros AI providers
  - Validar unit economics en cada feature ($0.86 profit/order target)

## 🎨 Patrones de Diseño Actuales

### 1. Edge Functions (Fire-and-Forget)
```typescript
export const runtime = 'edge'; // Required
import { waitUntil } from '@vercel/functions';

export async function POST(req: Request): Promise<Response> {
  const payload = await validateWebhook(req); // Fast validation

  // Return 200 immediately (5s WhatsApp timeout)
  waitUntil(processMessage(payload).catch(logError));

  return new Response(JSON.stringify({ success: true }));
}
```

### 2. Supabase Connection (Edge Runtime)
```typescript
import { createClient } from '@supabase/supabase-js';

// Transaction pooling (port 6543, pool size=1)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  {
    db: { schema: 'public' },
    auth: { persistSession: false, autoRefreshToken: false }
  }
);
```

### 3. Gemini Provider Selection (FREE Tier Only)
```typescript
import { createGeminiProactiveAgent } from '@/lib/gemini-agents';

const agent = createGeminiProactiveAgent();
const response = await agent.respond(
  userMessage,
  customerId,
  conversationHistory
);

// Daily tracking CRITICAL (in-memory resets on cold start - NEEDS FIX)
// TODO: Migrate to Supabase table for persistent tracking
```

### 4. WhatsApp 24h Window Management
```typescript
import { getMessagingWindow } from '@/lib/messaging-windows';

const window = await getMessagingWindow(phoneNumber);
if (window.isOpen) {
  // FREE message within 24h window
  await sendMessage(phoneNumber, content);
} else {
  // Requires template message ($0.0125-0.0667)
  await sendTemplateMessage(phoneNumber, templateName, params);
}
```

### 5. Error Handling (Edge Runtime)
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

  // NEVER return 500 to WhatsApp (causes retry storms)
  return new Response(JSON.stringify({ success: false }), { status: 200 });
}
```

## 🚧 Estado Actual del Desarrollo

### ✅ Completado
- [x] Business documentation (wpfoods/ - 8 docs)
- [x] AI strategy documentation (ai-*.md - 8 docs, ~315 pages)
- [x] Competitive intelligence (rappi-*.md - 7 docs)
- [x] Agent system (.claude/agents/ - 8 agents + delegation matrix)
- [x] Technical architecture documentation (platforms/)
- [x] Project structure (directories, package.json, configs)
- [x] **Phase 1 Implementation Docs** (docs/implementation/ - 8 docs, ~4,900 lines)
  - ROADMAP.md (master timeline, milestones, risk mitigation)
  - PHASE-1-CHECKLIST.md (82 tasks across 4 weeks)
  - week-1-database-spec.md (10 tables DDL, PostGIS, pgvector)
  - week-2-ordering-spec.md (Gemini agent, WhatsApp templates)
  - week-3-supply-spec.md (Restaurant/Worker onboarding, dispatch)
  - week-4-payments-spec.md (Stripe, launch readiness)
  - APPROVAL-GATES.md (4 manual approval gates)
  - DELEGATION-PLAN.md (Agent mapping per phase)
- [x] **Tailwind CSS Configuration** (2025-10-11)
  - Created tailwind.config.ts (Tailwind v4.1.14 compatible)
  - Created postcss.config.js (@tailwindcss/postcss)
  - Fixed TypeScript errors in 7 slide components
  - Production build passing (262 kB /deck bundle)
  - Reference: [tailwind-css-fix-summary.md](./docs/implementation/tailwind-css-fix-summary.md)

### 🔄 En Progreso (FOCO ACTUAL)
- [ ] **Phase 1 MVP (Weeks 1-4)**: Ready for implementation (plan approved)
  - Target: 50 restaurants, 20 workers, 500 customers (Bogotá)
  - Next action: Start Week 1 - Database schema implementation
  - Archivo: `supabase/migrations/`
  - Agent: supabase-expert (80% time) + edge-functions-expert (20% time)
  - Reference: [week-1-database-spec.md](./docs/implementation/week-1-database-spec.md)

### 📋 TODOs Prioritarios (Phase 1 - Next 4 Weeks)

**WEEK 1: Database & WhatsApp Webhook**
1. **URGENTE**: Supabase schema (10 tables + PostGIS + pgvector)
   - Tables: customers, restaurants, menu_items, orders, order_items, deliveries, delivery_workers, payments, conversations, messages
   - PostGIS functions: find_nearby_restaurants, find_best_worker
   - pgvector setup: Menu embeddings for semantic search
2. **Alta**: WhatsApp webhook handler (Edge Function)
   - Signature validation (security)
   - Fire-and-forget pattern (5s timeout compliance)
   - Message routing logic

**WEEK 2: Customer Ordering Flow**
3. **Alta**: Gemini conversational ordering (Colombian Spanish)
   - Tools: search_restaurants, get_menu, create_order, track_delivery
   - Context caching (75% cost savings)
   - FREE tier tracking (migrate to Supabase - P0 bug fix)
4. **Alta**: Interactive WhatsApp messages
   - Catalogs for restaurant browse
   - Buttons for cart actions
   - Order confirmation messages

**WEEK 3: Restaurant & Worker Features**
5. **Media**: Restaurant management via WhatsApp
   - 30-second onboarding flow
   - Menu management (conversational AI)
   - Order notifications (accept/reject buttons)
6. **Media**: Worker dispatch system
   - PostGIS-based matching (<10ms queries)
   - Order assignment via WhatsApp
   - Pickup/delivery confirmation (QR codes)

**WEEK 4: Payments & Launch**
7. **Alta**: Stripe payment integration
   - WhatsApp Flows checkout (v3)
   - Payment confirmation webhooks
   - Refund processing
8. **Media**: Launch readiness
   - Cost tracking dashboard
   - Performance monitoring
   - Launch 50 restaurants (Zona T + Chicó)

## 🐛 Bugs Conocidos

```yaml
BUG-P0-001:
  archivo: lib/gemini-client.ts:122-187
  descripción: "Gemini FREE tier counter resets on Edge Function cold starts"
  impacto: CRÍTICO - May exceed 1,400 req/day without detection
  workaround: "Current in-memory tracking (temporary)"
  fix_required: |
    Migrate to Supabase table:
    CREATE TABLE gemini_usage (
      date DATE PRIMARY KEY,
      requests INT DEFAULT 0,
      tokens BIGINT DEFAULT 0
    );
    Use atomic increment: supabase.rpc('increment_gemini_usage')
  prioridad: P0
  estimate: "1 hour"
  deadline: "Before production launch"
```

## 🔄 Decisiones Técnicas Recientes
- **2025-01-11**: Gemini FREE tier como único provider (NO OpenAI, NO Claude) - 100% cost savings
- **2025-01-11**: Estructura de agentes establecida (8 specialized + delegation matrix)
- **2025-01-11**: AI strategy documentation completa (8 docs, ~315 pages)

## 📊 Métricas de Performance Target

### Operational Targets
- **Unit economics**: $0.86 profit/order (34% margin) - MANTENER SIEMPRE
- **WhatsApp cost**: <$0.03/order (90%+ messages free)
- **AI cost**: $0.0005/order (Gemini FREE tier, <1,400 req/day)
- **Infrastructure**: <$0.24/order (Vercel Edge + Supabase)
- **Delivery payout**: $1.40/order (includes gas + benefits subsidy)

### Technical Targets
- **Webhook TTFB**: <100ms (WhatsApp 5s timeout)
- **DB queries**: <50ms (PostGIS <10ms for location)
- **Edge cold start**: <200ms
- **Bundle size**: <1.5MB gzipped
- **Test coverage**: >80% (critical paths: payments, orders, dispatch)

### Business Targets (Phase 1)
- **Restaurants**: 50 onboarded (Zona T + Chicó, Bogotá)
- **Workers**: 20 active rapitenderos
- **Customers**: 500 active users
- **Orders**: 20-30/day by Week 4
- **Customer satisfaction**: >4.5 stars
- **Restaurant retention**: >85%
- **Worker earnings**: $82,000 COP/day (vs Rappi $20,000)

## 🚀 Contexto de Sesión Actual
**Última tarea**: Tailwind CSS configuration fixed (2025-10-11)
  - Created tailwind.config.ts + postcss.config.js
  - Fixed 7 TypeScript errors (unused imports)
  - Production build passing (Next.js 15 + Tailwind v4.1.14)
  - Investor deck now fully styled with WhatsApp gradients
**Branch**: master
**PRs pendientes**: None
**Bloqueadores**: None - implementation plan approved, ready for Week 1 execution
**Next session**: Start Week 1 - Database schema implementation
  - Agent: supabase-expert (primary)
  - Tasks: 20 tasks (database + PostGIS + pgvector)
  - Reference: [week-1-database-spec.md](./docs/implementation/week-1-database-spec.md)
  - Approval Gate: Gate 1 (End of Week 1) - Technical Lead approval required

## 💡 Notas Rápidas para Claude

### SIEMPRE
- ✅ Validar unit economics ($0.86 profit/order) antes de features
- ✅ Usar SOLO Gemini 2.5 Flash FREE tier (NO otros providers)
- ✅ Optimizar para WhatsApp 24h window (90%+ free messages)
- ✅ Edge Runtime compatible (static imports, Web APIs only)
- ✅ Track daily Gemini usage (1,400 req/day limit)
- ✅ Fire-and-forget pattern con `waitUntil` (5s timeout)
- ✅ Supabase transaction pooling (port 6543, pool=1)
- ✅ PostGIS para location queries (<10ms target)
- ✅ Actualizar CLAUDE.md al completar tareas
- ✅ Tests para features críticos (payments, orders, dispatch)

### NUNCA
- ❌ Usar OpenAI, Claude, Groq o cualquier AI que no sea Gemini FREE
- ❌ Exceder 1,400 Gemini requests/day
- ❌ Enviar WhatsApp fuera de 24h window sin template validation
- ❌ Usar Node.js modules en Edge Functions (fs, child_process, etc.)
- ❌ Dynamic imports (await import) en Edge Runtime
- ❌ Sacrificar profitability por features
- ❌ Return 500 a WhatsApp webhooks (causes retry storms)
- ❌ Skip unit economics validation
- ❌ Deploy sin Edge Runtime compatibility check

### Delegation Quickref
```yaml
business-analyst: Unit economics, strategy, market analysis
research-analyst: Competition intel (Rappi tracking)
whatsapp-api-expert: Interactive messages, flows, webhooks
edge-functions-expert: Performance optimization, cold starts
gemini-expert: FREE tier optimization, conversational AI
supabase-expert: Schema, PostGIS, pgvector, migrations
backend-developer: Payment processing, API logic
code-reviewer: Security, production readiness
```

## 🔗 Referencias Externas Críticas

### Business & Strategy
- [Docs Hub](./docs/README.md) - Complete documentation index
- [Business Model](./docs/wpfoods/business-model-overview.md) - Disruptive model explanation
- [Unit Economics](./docs/wpfoods/unit-economics.md) - $0.86 profit/order breakdown
- [AI Strategy](./docs/wpfoods/ai-strategy-overview.md) - AI as structural moat

### Implementation (Phase 1 MVP)
- [ROADMAP.md](./docs/implementation/ROADMAP.md) - 4-week timeline, milestones, risk mitigation
- [PHASE-1-CHECKLIST.md](./docs/implementation/PHASE-1-CHECKLIST.md) - 82 tasks with acceptance criteria
- [week-1-database-spec.md](./docs/implementation/week-1-database-spec.md) - Database + PostGIS + pgvector
- [week-2-ordering-spec.md](./docs/implementation/week-2-ordering-spec.md) - Gemini agent + WhatsApp
- [week-3-supply-spec.md](./docs/implementation/week-3-supply-spec.md) - Restaurant/Worker onboarding
- [week-4-payments-spec.md](./docs/implementation/week-4-payments-spec.md) - Stripe + Launch
- [APPROVAL-GATES.md](./docs/implementation/APPROVAL-GATES.md) - 4 manual approval gates (MANDATORY)
- [DELEGATION-PLAN.md](./docs/implementation/DELEGATION-PLAN.md) - Agent allocation per phase

### Agents & Technical
- [Agent System](./.claude/agents/claude-master.md) - Orchestration (v4.0)
- [Delegation Matrix](./.claude/agents/delegation-matrix.md) - Task routing
- [WhatsApp Docs](./docs/platforms/whatsapp/README.md) - API v23.0 reference
- [Gemini Docs](./docs/platforms/ai/providers/gemini/README.md) - FREE tier optimization

---

<!--
PARA CLAUDE: Este es tu memoria persistente del proyecto.
- Actualiza "Sesión Actual" al terminar cada tarea
- Si supera 5K tokens, mueve detalles a docs/
- Prioriza información frecuentemente usada
- CRÍTICO: Mantén unit economics siempre visible ($0.86 profit/order)
- CRÍTICO: Solo Gemini FREE tier (1,400 req/day) - NO otros providers
-->

**Versión**: 1.0
**Última actualización**: 2025-01-11
**Proyecto**: WPFoods - Disruptive WhatsApp AI Food Delivery Platform
**Target Market**: Colombia (Rappi 64% dominance)
**Economics**: $0.86 profit/order, $0 customers, 5-10% restaurants, 50-100% higher worker pay
**Status**: MVP ready for Phase 1 implementation (Weeks 1-4)
