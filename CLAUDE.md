# CLAUDE.md - Weats Platform
<!-- Mantener bajo 5000 tokens. Última actualización: 2025-10-12 -->

## 🚨 START HERE - Current Focus

**📍 PHASE 1 WEEK 1** - Database & Three-AI Orchestration Layer
- **Task**: Implement Supabase schema (10 tables) + PostGIS + pgvector + Three-AI base structure
- **Files**: `supabase/migrations/`, `lib/ai/` (restaurant-agent.ts, runner-agent.ts, client-agent.ts, orchestration.ts)
- **Agent Lead**: supabase-expert (60%) + gemini-expert (20%) + edge-functions-expert (20%)
- **Reference**: [week-1-database-spec.md](./docs/implementation/week-1-database-spec.md)
- **Gate**: Approval Gate 1 at end of Week 1 (Technical Lead required)

**⚠️ CRITICAL CONSTRAINTS** (validate EVERY feature):
- ✅ **Unit economics**: $0.86 profit/order (34% margin) - NEVER compromise
- ✅ **AI provider**: Gemini 2.5 Flash FREE tier ONLY (1,400 req/day shared across 3 AIs)
- ✅ **Messaging**: WhatsApp + RCS 24h window (90%+ free messages)
- ✅ **Runtime**: Edge Functions only (no Node.js modules)
- ✅ **Architecture**: Three-AI orchestration via lib/ai/orchestration.ts

---

## 🎯 Contexto del Proyecto
**Propósito**: Disrumpir food delivery colombiano con **tres IAs conversacionales** (Weats.Restaurant, Weats.Runner, Weats.Client) sincronizadas vía Gemini FREE tier
**Estado**: MVP Ready - Phase 1 implementation starting (Weeks 1-4)
**Launch**: 2025-03-01 (Bogotá - Zona T + Chicó)
**Diferenciador**: 91% lower costs vs Rappi → beneficia a TODOS
**Posicionamiento**: "Liberar el delivery de los monopolios"

## 🛠 Stack Técnico
```yaml
frontend: Next.js 15, React 19, TypeScript 5.9.2 (strict)
backend: Vercel Edge Functions (<100ms TTFB)
database: Supabase PostgreSQL 15.8 + PostGIS + pgvector
messaging: WhatsApp Business API v23.0 + RCS (Google Business Messages)
ai: Gemini 2.5 Flash FREE tier ONLY (1,400 req/day limit)
  - Weats.Restaurant: AI asistente del restaurante (pedidos, reservas, inventario)
  - Weats.Runner: AI coordinador de repartidores (logística, rutas)
  - Weats.Client: AI asistente del cliente (pedidos conversacionales)
orchestration: Vercel Edge Functions (sincronización de las 3 IAs)
payments: Stripe
testing: Jest, @testing-library/react
ci/cd: GitHub Actions + Vercel
```

## 📁 Estructura Crítica
```
weats/
├── app/api/              # Edge Functions (webhook handlers)
│   ├── whatsapp/webhook/ # Main WhatsApp entry (fire-and-forget)
│   ├── rcs/webhook/      # RCS/Google Business Messages webhook
│   ├── orders/           # Order processing
│   ├── restaurants/      # Restaurant management
│   ├── dispatch/         # Worker assignment (PostGIS)
│   └── payments/         # Stripe integration
├── lib/                  # Core business logic
│   ├── ai/               # Three-AI Ecosystem
│   │   ├── restaurant-agent.ts  # Weats.Restaurant (orders, reservas, inventario, CRM)
│   │   ├── runner-agent.ts      # Weats.Runner (dispatch, rutas, pagos)
│   │   ├── client-agent.ts      # Weats.Client (ordering conversacional, tracking)
│   │   └── orchestration.ts     # Sincronización entre las 3 IAs
│   ├── gemini-client.ts  # Gemini FREE tier tracking (CRITICAL)
│   ├── supabase.ts       # Edge-compatible client (port 6543)
│   ├── whatsapp.ts       # WhatsApp API wrapper
│   ├── rcs.ts            # RCS/Google Business Messages wrapper
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

## 🧩 Arquitectura de Tres IAs (Weats.ai)

> **Ver detalles completos**: [AGENTS.md - Three-AI Ecosystem](./AGENTS.md#45-three-ai-ecosystem-architecture)

**Concepto**: Tres IAs independientes conversando en WhatsApp/RCS, sincronizadas vía `lib/ai/orchestration.ts`

| AI | Función | Archivos |
|----|---------|----------|
| **Weats.Restaurant** | Pedidos, reservas, inventario, CRM | `lib/ai/restaurant-agent.ts` |
| **Weats.Runner** | Dispatch (PostGIS), rutas, pagos transparentes | `lib/ai/runner-agent.ts` |
| **Weats.Client** | Ordering conversacional, tracking, soporte | `lib/ai/client-agent.ts` |
| **Orchestration** | Sincronización entre las 3 IAs | `lib/ai/orchestration.ts` |

**Flujo de Pedido**:
1. Cliente → Weats.Client procesa solicitud
2. Weats.Client → Weats.Restaurant valida stock/precio/pago
3. Weats.Restaurant → Weats.Runner asigna delivery (PostGIS)
4. Orchestration notifica a todos los stakeholders
5. Todo ocurre conversacionalmente, sin apps

**Implementación** (lib/ai/orchestration.ts):
```typescript
export async function orchestrateOrder(clientMessage, clientPhone, restaurantId) {
  const order = await clientAgent.processOrder(clientMessage, clientPhone);
  await restaurantAgent.confirmOrder(order, restaurantId);
  const runner = await runnerAgent.assignDelivery(order);
  await notifyAllStakeholders(order, runner);
  return { order, runner };
}
```

**Impacto**: 0% comisión restaurantes, pagos justos workers, cero fricción clientes

## 🚧 Estado Actual

> **Full history**: [AGENTS.md - Project Status](./AGENTS.md#2-contexto-del-negocio)

**✅ Ready**: Documentation complete (business, AI strategy, competitive intel, implementation specs)
**🔄 NOW**: Phase 1 Week 1 - Database + Three-AI orchestration (see START HERE section above)
**🎯 Target**: 50 restaurants, 20 workers, 500 customers (Bogotá Zona T + Chicó)

### 📋 TODOs (Next 4 Weeks)

> **Full checklist**: [PHASE-1-CHECKLIST.md](./docs/implementation/PHASE-1-CHECKLIST.md) (82 tasks)

**Week 1**: Database (10 tables + PostGIS + pgvector) + WhatsApp webhook + Three-AI base structure
**Week 2**: Gemini ordering agent + Interactive WhatsApp (catalogs, buttons) + FREE tier tracking fix (P0)
**Week 3**: Restaurant onboarding (30s flow) + Worker dispatch (PostGIS) + QR confirmations
**Week 4**: Stripe integration + WhatsApp Flows checkout + Launch 50 restaurants (Bogotá)

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

## 🚀 Session Info
**Last Update**: 2025-10-12 (Three-AI documentation complete)
**Branch**: main | **PRs**: None | **Blockers**: None
**Next**: Week 1 implementation (see START HERE section above)

## 💡 Notas Rápidas para Claude

### SIEMPRE
- ✅ Validar unit economics ($0.86 profit/order) antes de features
- ✅ Usar SOLO Gemini 2.5 Flash FREE tier (NO otros providers)
- ✅ Optimizar para WhatsApp + RCS 24h window (90%+ free messages)
- ✅ Three-AI architecture: Restaurant, Runner, Client sincronizados vía orchestration.ts
- ✅ Edge Runtime compatible (static imports, Web APIs only)
- ✅ Track daily Gemini usage (1,400 req/day limit compartido entre 3 IAs)
- ✅ Fire-and-forget pattern con `waitUntil` (5s timeout)
- ✅ Supabase transaction pooling (port 6543, pool=1)
- ✅ PostGIS para location queries (<10ms target)
- ✅ Actualizar CLAUDE.md al completar tareas
- ✅ Tests para features críticos (payments, orders, dispatch, orchestration)

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

## 🔗 Referencias Críticas

### Internal Docs
- **[AGENTS.md](./AGENTS.md)** - Comprehensive agent guidance, research methodology, constraints
- **[README.md](./README.md)** - Project overview
- [Docs Hub](./docs/README.md) - Complete documentation index

### Business & Strategy
- [Business Model](./docs/weats/business-model-overview.md) - Disruptive model
- [Unit Economics](./docs/weats/unit-economics.md) - $0.86 profit/order breakdown
- [AI Strategy](./docs/weats/ai-strategy-overview.md) - AI as structural moat

### Implementation (Phase 1)
- [ROADMAP.md](./docs/implementation/ROADMAP.md) - 4-week timeline
- [PHASE-1-CHECKLIST.md](./docs/implementation/PHASE-1-CHECKLIST.md) - 82 tasks
- [Week 1 Spec](./docs/implementation/week-1-database-spec.md) - Database + Three-AI orchestration
- [APPROVAL-GATES.md](./docs/implementation/APPROVAL-GATES.md) - 4 mandatory gates

### Agents & Platforms
- [claude-master](./.claude/agents/claude-master.md) - Orchestration (v4.0)
- [Delegation Matrix](./.claude/agents/delegation-matrix.md) - Task routing
- [WhatsApp Docs](./docs/platforms/whatsapp/README.md) - API v23.0
- [Gemini Docs](./docs/platforms/ai/providers/gemini/README.md) - FREE tier

---

<!--
PARA CLAUDE: Este es tu memoria persistente del proyecto.
- Actualiza "Sesión Actual" al terminar cada tarea
- Si supera 5K tokens, mueve detalles a docs/
- Prioriza información frecuentemente usada
- CRÍTICO: Mantén unit economics siempre visible ($0.86 profit/order)
- CRÍTICO: Solo Gemini FREE tier (1,400 req/day) - NO otros providers
-->

**Versión**: 2.0
**Última actualización**: 2025-10-12
**Proyecto**: Weats.ai - Three-AI Conversational Delivery Ecosystem
**Arquitectura**: Weats.Restaurant + Weats.Runner + Weats.Client (sincronizados vía Edge Functions)
**Target Market**: Colombia (Rappi 64% dominance)
**Economics**: $0.86 profit/order, $0 customers, 5-10% restaurants, 50-100% higher worker pay
**Posicionamiento**: "Liberar el delivery de los monopolios, devolviendo el poder a quienes cocinan, reparten y comen"
**Status**: MVP ready for Phase 1 implementation (Weeks 1-4) - Three-AI architecture documented
