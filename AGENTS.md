# AGENTS.md - Weats.ai Platform

> **Documentación de Investigación y Orquestación de Agentes**
> **Versión**: 2.0
> **Última actualización**: 2025-10-12
> **Proyecto**: Weats.ai - Three-AI Conversational Delivery Ecosystem

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Contexto del Negocio](#contexto-del-negocio)
3. [Metodología de Investigación](#metodología-de-investigación)
4. [Estructura de Documentación](#estructura-de-documentación)
5. [Instrucciones para Agentes](#instrucciones-para-agentes)
6. [Recursos y Referencias](#recursos-y-referencias)
7. [Contacto y Soporte](#contacto-y-soporte)

---

## 1. Descripción del Proyecto

### Objetivo Principal
Disrumpir el mercado colombiano de entrega de alimentos (dominado por Rappi 64%) con un **ecosistema de tres IAs conversacionales** (Weats.Restaurant, Weats.Runner, Weats.Client) sincronizadas, que operan sin apps ni monopolios, devolviendo el poder a quienes cocinan, reparten y comen.

### Alcance
- **Mercado objetivo**: Colombia (inicio Bogotá - Zona T + Chicó)
- **Expansión**: Multi-ciudad → Nacional (16 semanas)
- **Modelo**: Three-AI ecosystem conectando directamente clientes, restaurantes y workers
- **Diferenciador**: 91% menor costo operacional vs Rappi mediante IA Gemini FREE tier, WhatsApp + RCS
- **Arquitectura**: Tres IAs independientes que conversan en sus propios canales pero se sincronizan automáticamente

### Audiencia Objetivo
1. **Técnica**: Desarrolladores implementando features (Edge Functions, AI, WhatsApp, Database)
2. **Negocio**: Product managers validando unit economics ($0.86 profit/order)
3. **Investigación**: Research analysts monitoreando competencia (Rappi, iFood, Uber Eats)
4. **IA**: AI engineers optimizando costos (Gemini FREE tier, 1,400 req/day)

---

## 2. Current Focus - Phase 1 Week 1

> **Quick Reference**: [CLAUDE.md - START HERE](./CLAUDE.md#-start-here---current-focus)

### 🎯 Immediate Priority (Week 1 of 4)

**Objetivo**: Database schema + Three-AI orchestration layer implementation

**Tasks**:
1. **Supabase Schema** (10 tables + PostGIS + pgvector)
   - Core tables: customers, restaurants, menu_items, orders, order_items, deliveries, delivery_workers, payments, conversations, messages
   - PostGIS functions: find_nearby_restaurants, find_best_worker (< 10ms target)
   - pgvector setup: Menu semantic search embeddings

2. **Three-AI Base Structure** (lib/ai/)
   - restaurant-agent.ts (pedidos, reservas, inventario, CRM)
   - runner-agent.ts (dispatch, rutas, pagos)
   - client-agent.ts (ordering, tracking, soporte)
   - orchestration.ts (sincronización entre las 3 IAs)

3. **WhatsApp Webhook Handler** (app/api/whatsapp/webhook/)
   - Signature validation (security)
   - Fire-and-forget pattern (5s timeout compliance)
   - Message routing to appropriate AI agent

**Agent Allocation**:
- supabase-expert: 60% (database, PostGIS, pgvector)
- gemini-expert: 20% (Three-AI structure, Gemini client)
- edge-functions-expert: 20% (webhook handler, orchestration)

**Success Criteria**:
- ✅ All 10 tables created with proper constraints
- ✅ PostGIS functions operational (< 10ms queries)
- ✅ pgvector embeddings setup complete
- ✅ Three-AI base agents responding to messages
- ✅ Orchestration routing messages correctly
- ✅ WhatsApp webhook handling 100+ msg/sec
- ✅ **Approval Gate 1**: Technical Lead sign-off required

**Reference Docs**:
- [week-1-database-spec.md](./docs/implementation/week-1-database-spec.md) - Full technical specification
- [APPROVAL-GATES.md](./docs/implementation/APPROVAL-GATES.md) - Gate 1 checklist
- [PHASE-1-CHECKLIST.md](./docs/implementation/PHASE-1-CHECKLIST.md) - Task 1-22 of 82

---

## 3. Contexto del Negocio

### 3.1 Modelo Disruptivo

| Stakeholder | Weats.ai (Three-AI) | Rappi | Ventaja Weats |
|-------------|---------------------|-------|-----------------|
| **Clientes** (via Weats.Client) | $0 fees, ordering conversacional WhatsApp/RCS | 15-20% fees, app requerida | **Ahorro 35-40%** ($9/order) + cero fricción |
| **Restaurantes** (via Weats.Restaurant) | 5-10% commission, AI automation (90% labor savings) | 25-35% commission, manual operations | **+$8.53 revenue/order** + CRM conversacional |
| **Workers** (via Weats.Runner) | $5,000-7,000 COP/delivery + autonomía total | $2,500 COP/delivery, algoritmo opaco | **4x higher earnings** + transparencia |
| **Plataforma** | $0.86 profit/order (34% margin), 3 IAs sincronizadas | Recently profitable (2023), monolith app | **Profitable, ethical & AI-first** |

**Diferenciador Clave**: Tres IAs conversacionales eliminan la necesidad de apps, reduciendo costos 91% mientras empoderan a cada stakeholder con su propia inteligencia artificial.

### 2.2 Situación Actual del Mercado
- **Mercado total**: $3.17B food delivery Colombia (2025)
- **Rappi dominancia**: 64% market share
- **Debilidades de Rappi**:
  - 41% take rate (insostenible)
  - Worker exploitation ($1,800-3,700/delivery, declining 48%)
  - Legacy app (high CAC $30-50, complex UI)
  - Regulatory exposure (750K+ complaints, worker protests)
  - Financial constraints (can't reduce fees without losing $1B revenue)

### 2.3 Oportunidad Identificada
**Ventaja Estructural (91% cost reduction)**:
1. **WhatsApp-native**: No app development, 90% penetration, viral growth
2. **IA automation**: Gemini FREE tier, 90% support automation, $0 AI cost
3. **Lean team**: 15 people vs Rappi 12,600 (84x más eficiente)
4. **Edge Functions**: Global distribution, <100ms latency, <$0.24/order infra

**Resultado**: $0.86 profit/order mientras beneficiamos a todos los stakeholders.

### 2.4 Unit Economics (Crítico)
```
Revenue per order:  $2.53 (8.4% take rate)
  - Restaurant commission: $2.40 (8% of $30 AOV)
  - Small order fee: $0.13 (orders <$12)

Costs per order:    $1.67
  - Delivery payout: $1.40 (includes gas + benefits subsidy)
  - WhatsApp cost: $0.03 (90%+ messages free, 24h window)
  - AI cost: $0.0005 (Gemini FREE tier, <1,400 req/day)
  - Infrastructure: $0.24 (Vercel Edge, Supabase)

Profit per order:   $0.86 (34% margin)
```

**Break-even**: 1,598 orders/day (achievable Year 2)

---

## 3. Metodología de Investigación

### 3.1 Fuentes de Información

#### Primarias (Alta Confianza)
- **Rappi Financial Reports**: Quarterly earnings, investor presentations
- **Colombian Market Data**: Government statistics, industry reports
- **WhatsApp Business API Docs**: Official Meta documentation (v23.0)
- **Gemini AI Documentation**: Google AI pricing, capabilities, limits
- **Supabase Documentation**: PostgreSQL, PostGIS, pgvector reference

#### Secundarias (Validación Requerida)
- Competitor analysis (web scraping, public statements)
- Worker forums and social media (sentiment analysis)
- Restaurant reviews and complaint data
- Industry news and analyst reports

### 3.2 Criterios de Selección
1. **Actualidad**: Información de 2024-2025 preferida
2. **Verificabilidad**: Fuentes oficiales o múltiples confirmaciones
3. **Relevancia**: Impacto directo en model de negocio o implementación técnica
4. **Precisión**: Datos cuantitativos preferidos sobre estimaciones

### 3.3 Proceso de Validación
- **Cross-reference**: Mínimo 2 fuentes independientes
- **Temporal**: Verificar fechas, usar información más reciente
- **Contexto**: Validar aplicabilidad al mercado colombiano
- **Técnico**: Probar claims técnicos (API limits, performance, costs)

---

## 4. Estructura de Documentación

### 4.1 Organización General
```
weats/
├── AGENTS.md                    # Este archivo - contexto para agentes
├── CLAUDE.md                    # Contexto de sesión (<5000 tokens)
├── README.md                    # Overview del proyecto
│
├── .claude/
│   ├── agents/                  # Definiciones de agentes especializados
│   │   ├── claude-master.md     # Orquestador principal (v4.0)
│   │   ├── delegation-matrix.md # Matriz de routing de tareas
│   │   ├── business-analyst.md  # Unit economics, strategy
│   │   ├── research-analyst.md  # Market intelligence
│   │   ├── whatsapp-api-expert.md
│   │   ├── edge-functions-expert.md
│   │   ├── gemini-expert.md
│   │   └── supabase-expert.md
│   ├── commands/                # Slash commands personalizados
│   └── memory/                  # Lecciones aprendidas por sesión
│
├── docs/
│   ├── README.md                # Hub de documentación
│   │
│   ├── weats/                 # Documentación de negocio
│   │   ├── EXECUTIVE_SUMMARY.md
│   │   ├── business-model-overview.md
│   │   ├── unit-economics.md
│   │   ├── competitive-analysis.md
│   │   ├── go-to-market-strategy.md
│   │   ├── financial-projections.md
│   │   ├── customer-experience.md
│   │   ├── restaurant-model.md
│   │   ├── rapitendero-model.md
│   │   ├── ai-strategy-overview.md (+ 7 AI docs)
│   │   └── technical/           # Arquitectura técnica
│   │
│   ├── platforms/               # Documentación por plataforma
│   │   ├── whatsapp/            # WhatsApp API v23.0
│   │   ├── vercel/              # Edge Functions
│   │   ├── supabase/            # PostgreSQL, PostGIS, pgvector
│   │   └── ai/                  # Gemini 2.5 Flash (solo Gemini)
│   │
│   ├── guides/                  # How-to tutorials
│   ├── reference/               # API specs, schemas
│   └── architecture/            # System design
│
└── [rappi-*.md]                 # Competitive intelligence (7 docs)
```

### 4.2 Secciones Requeridas por Documento

#### Documentos de Negocio (docs/weats/)
- Executive Summary (1-2 páginas)
- Problema identificado
- Solución propuesta
- Unit economics y validación
- Métricas de éxito
- Next steps

#### Documentos Técnicos (docs/platforms/)
- Overview de la tecnología
- Setup y configuración
- Best practices y patterns
- Limitaciones y constraints
- Performance targets
- Cost optimization
- Code examples

### 4.3 Formato de Presentación
- **Markdown**: GitHub-flavored, compatible con Claude Code
- **Diagramas**: Mermaid para arquitectura y flujos
- **Código**: TypeScript strict, comentado, con imports
- **Tablas**: Para comparaciones y datos estructurados
- **Listas**: Para TODOs, features, requisitos

### 4.4 Nivel de Detalle Esperado

| Tipo de Documento | Profundidad | Longitud Target | Audiencia |
|-------------------|-------------|-----------------|-----------|
| Executive Summary | High-level overview | 1-3 páginas | Stakeholders, investors |
| Business Model | Strategic depth | 10-15 páginas | Product, business team |
| Technical Architecture | Implementation-ready | 30-50 páginas | Developers, architects |
| API Reference | Comprehensive | 20-30 páginas | Developers |
| Guides (How-to) | Step-by-step | 5-10 páginas | Developers |

### 4.5 Three-AI Ecosystem Architecture

**Nueva Estructura de Documentación** para soportar el ecosistema de tres IAs:

```
lib/ai/                          # Three-AI Ecosystem
├── restaurant-agent.ts          # Weats.Restaurant
│   ├── Pedidos conversacionales
│   ├── Gestión de reservas
│   ├── Control de inventario
│   ├── CRM conversacional
│   └── Notificaciones a runners
├── runner-agent.ts              # Weats.Runner
│   ├── Asignación de pedidos (PostGIS)
│   ├── Optimización de rutas
│   ├── Gestión de entregas
│   ├── División transparente de pagos
│   └── Comunicación con clientes/restaurantes
├── client-agent.ts              # Weats.Client
│   ├── Ordering conversacional
│   ├── Recomendaciones personalizadas
│   ├── Tracking en tiempo real
│   ├── Soporte al cliente
│   └── Gestión de preferencias
└── orchestration.ts             # Synchronization Layer
    ├── Order lifecycle coordination
    ├── Multi-AI message routing
    ├── State management across AIs
    └── Error handling & fallbacks
```

**Documentación Requerida por AI**:

#### Weats.Restaurant (docs/ai/restaurant/)
- `capabilities.md` - Qué puede hacer esta IA
- `conversation-flows.md` - Flujos conversacionales (pedidos, reservas, inventario)
- `crm-automation.md` - Gestión automática de clientes
- `integration-points.md` - Cómo se conecta con Weats.Runner y Weats.Client
- `cost-optimization.md` - Uso eficiente de Gemini FREE tier

#### Weats.Runner (docs/ai/runner/)
- `capabilities.md` - Qué puede hacer esta IA
- `dispatch-algorithm.md` - Lógica de asignación (PostGIS, optimización)
- `route-optimization.md` - Algoritmos de rutas inteligentes
- `payment-distribution.md` - División transparente de ingresos
- `integration-points.md` - Cómo se conecta con Weats.Restaurant y Weats.Client

#### Weats.Client (docs/ai/client/)
- `capabilities.md` - Qué puede hacer esta IA
- `conversation-flows.md` - Flujos de ordering, tracking, soporte
- `personalization.md` - Recomendaciones basadas en historial
- `multi-channel.md` - Soporte WhatsApp + RCS
- `integration-points.md` - Cómo se conecta con Weats.Restaurant y Weats.Runner

#### Orchestration (docs/ai/orchestration/)
- `architecture.md` - Cómo las 3 IAs se sincronizan
- `message-routing.md` - Lógica de routing entre IAs
- `state-management.md` - Gestión de estado distribuido
- `error-handling.md` - Fallbacks y resilience
- `performance.md` - Optimización de latencia (<100ms)

---

## 5. Instrucciones para Agentes

### 5.1 Principios Generales

> **Quick Reference**: [CLAUDE.md - Notas Rápidas](./CLAUDE.md#-notas-rápidas-para-claude)

1. **Unit Economics First**: TODAS las decisiones técnicas deben validarse contra el target de $0.86 profit/order
2. **Three-AI Architecture**: Cada feature debe considerar cómo interactúa con Restaurant, Runner y Client AIs
3. **Gemini FREE Only**: Usar SOLO Gemini 2.5 Flash en free tier (1,400 req/day compartido entre 3 IAs), NO OpenAI, NO Claude
4. **WhatsApp + RCS Optimization**: Maximizar mensajes gratuitos (24h window), target 90%+ free, multi-canal
5. **Edge Runtime Only**: Toda lógica backend debe ser compatible con Vercel Edge Runtime
6. **Orchestration Awareness**: Toda comunicación entre IAs debe pasar por orchestration.ts
7. **Cost Awareness**: Cada feature debe documentar costo operacional incremental por AI involucrada

### 5.2 Tareas Específicas por Tipo

> **Code Patterns**: [CLAUDE.md - Patrones de Diseño](./CLAUDE.md#-patrones-de-diseño-actuales)

#### Investigación de Mercado (research-analyst)
```yaml
Objetivo: Mantener inteligencia competitiva actualizada
Frecuencia: Semanal
Fuentes: Rappi earnings, Colombian market data, competitor moves
Entregables:
  - Actualizaciones en docs/rappi-*.md
  - Alertas de cambios significativos (pricing, commissions, worker pay)
  - Oportunidades identificadas (vulnerabilities to exploit)
```

#### Análisis de Negocio (business-analyst)
```yaml
Objetivo: Validar y optimizar unit economics
Frecuencia: Por feature, antes de implementación
Validaciones:
  - Revenue impact (commission optimization)
  - Cost impact (WhatsApp, AI, infra)
  - Profit per order maintained (>$0.80 minimum)
  - Stakeholder value preserved (all sides win)
Entregables:
  - Unit economics validation por feature
  - Cost-benefit analysis
  - Revenue optimization recommendations
```

#### Desarrollo de Features (specialized agents)
```yaml
Pre-implementation:
  1. Read business context (docs/weats/)
  2. Review technical constraints (.claude/agents/claude-master.md)
  3. Validate against unit economics
  4. Check delegation matrix (.claude/agents/delegation-matrix.md)

Durante implementación:
  1. Three-AI coordination (identify which AIs are involved)
  2. Orchestration.ts routing (ensure proper message flow between AIs)
  3. Edge Runtime compliance (no Node.js modules)
  4. Gemini FREE tier only (track daily usage, shared 1,400 req/day)
  5. WhatsApp + RCS 24h window optimization (multi-channel)
  6. Cost tracking (log operational costs per AI)
  7. Performance targets (<100ms TTFB, <50ms DB queries, <2s end-to-end)

Post-implementation:
  1. Update CLAUDE.md session context
  2. Document cost impact
  3. Update unit economics if changed
  4. Add tests (>80% coverage target)
```

### 5.3 Limitaciones y Restricciones

> ⚠️ **CRITICAL CONSTRAINTS** - These are non-negotiable. Violation will break unit economics or cause system failures.

#### ❌ NUNCA (Prohibido - NEVER DO THIS)

```
🚫 VIOLATIONS WILL BREAK UNIT ECONOMICS OR SYSTEM STABILITY
```

- ❌ **AI Provider**: Usar OpenAI, Claude, o cualquier AI provider que no sea Gemini FREE
- ❌ **API Limits**: Exceder 1,400 Gemini requests/day (hard limit, shared across 3 AIs)
- ❌ **WhatsApp Cost**: Enviar messages fuera de 24h window sin validación (costo $0.0125-0.0667)
- ❌ **Runtime**: Usar Node.js modules en Edge Functions (compatibility error, deployment will fail)
- ❌ **Economics**: Implementar features sin validar unit economics primero
- ❌ **Profitability**: Comprometer profitability por features (profitability > features ALWAYS)
- ❌ **Quality**: Skip testing (production bugs costosos en marketplace)

#### ✅ SIEMPRE (Required - ALWAYS DO THIS)

```
✅ EVERY FEATURE MUST MEET THESE REQUIREMENTS
```

- ✅ **Unit Economics**: Validar $0.86 profit/order antes de implementar features
- ✅ **Three-AI Awareness**: Identificar qué IAs están involucradas (Restaurant, Runner, Client)
- ✅ **Orchestration**: Usar orchestration.ts para comunicación entre IAs
- ✅ **AI Provider**: Usar Gemini 2.5 Flash FREE tier exclusivamente (1,400 req/day compartido)
- ✅ **Messaging**: Optimizar para WhatsApp + RCS 24h window (90%+ free, multi-canal)
- ✅ **Runtime**: Edge Runtime compatible (static imports, Web APIs only)
- ✅ **Cost Tracking**: Track costs (WhatsApp, AI, infra) por feature y por AI
- ✅ **Documentation**: Update CLAUDE.md session context al terminar
- ✅ **Testing**: Add tests para features críticos (payments, orders, dispatch, orchestration)
- ✅ **Performance**: Monitor performance (<100ms webhooks, <50ms DB, <2s end-to-end)

### 5.4 Criterios de Calidad

#### Código
- TypeScript strict mode (no `any` types)
- Edge Runtime compatible (verificar con `export const runtime = 'edge'`)
- Error handling comprehensivo (no silent failures)
- Logging estructurado (for debugging, cost tracking)
- Tests coverage >80% para features críticos

#### Documentación
- Actualizada (dentro de 24h de cambios)
- Específica (no vague descriptions)
- Actionable (implementation-ready)
- Cross-referenced (links to related docs)
- Cost-aware (document operational costs)

#### Decisiones
- Unit economics validated (profit/order maintained)
- Alternatives considered (document why this approach)
- Risks identified (technical, business, regulatory)
- Rollback plan (if feature fails)
- Success metrics (how to measure impact)

---

## 6. Recursos y Referencias

### 6.1 Documentación Interna (Alta Prioridad)

#### Business Context (Leer PRIMERO)
- [docs/weats/business-model-overview.md](./docs/weats/business-model-overview.md) - Disruptive model
- [docs/weats/unit-economics.md](./docs/weats/unit-economics.md) - $0.86 profit/order breakdown
- [docs/weats/competitive-analysis.md](./docs/weats/competitive-analysis.md) - 91% cost advantage vs Rappi

#### AI Strategy (CRITICAL - Lean FREE Gemini Only)
- [docs/weats/ai-strategy-overview.md](./docs/weats/ai-strategy-overview.md) - AI as structural moat
- [docs/weats/ai-cost-optimization.md](./docs/weats/ai-cost-optimization.md) - Gemini FREE tier optimization
- [docs/weats/ai-technical-architecture.md](./docs/weats/ai-technical-architecture.md) - Gemini-only implementation

#### Technical Architecture
- [.claude/agents/claude-master.md](./.claude/agents/claude-master.md) - Platform expertise (v4.0)
- [.claude/agents/delegation-matrix.md](./.claude/agents/delegation-matrix.md) - Task routing
- [docs/architecture/overview.md](./docs/architecture/overview.md) - System design

#### Platform-Specific
- [docs/platforms/whatsapp/README.md](./docs/platforms/whatsapp/README.md) - WhatsApp API v23.0
- [docs/platforms/vercel/README.md](./docs/platforms/vercel/README.md) - Edge Functions
- [docs/platforms/supabase/README.md](./docs/platforms/supabase/README.md) - PostgreSQL, PostGIS, pgvector
- [docs/platforms/ai/providers/gemini/README.md](./docs/platforms/ai/providers/gemini/README.md) - Gemini 2.5 Flash FREE

### 6.2 Fuentes Oficiales Externas

#### WhatsApp Business API
- [Meta Business API Docs](https://developers.facebook.com/docs/whatsapp) - Official reference
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) - v23.0 spec
- [Pricing (2025)](https://developers.facebook.com/docs/whatsapp/pricing) - Updated pricing model

#### Gemini AI (Solo Provider)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs) - Official documentation
- [Free Tier Limits](https://ai.google.dev/pricing) - 1,500 req/day, 1M tokens
- [Function Calling](https://ai.google.dev/gemini-api/docs/function-calling) - Tool use

#### Vercel Edge Functions
- [Edge Functions Docs](https://vercel.com/docs/functions/edge-functions) - Official guide
- [Edge Runtime](https://edge-runtime.vercel.app/) - API reference
- [Performance Best Practices](https://vercel.com/docs/functions/edge-functions/best-practices)

#### Supabase
- [Supabase Docs](https://supabase.com/docs) - Complete reference
- [PostGIS Extension](https://supabase.com/docs/guides/database/extensions/postgis) - Geospatial queries
- [pgvector Extension](https://supabase.com/docs/guides/ai/vector-embeddings) - Semantic search

### 6.3 Competitive Intelligence
- [docs/rappi-business-model-overview.md](./docs/rappi-business-model-overview.md)
- [docs/rappi-financial-model.md](./docs/rappi-financial-model.md)
- [docs/rappi-strategic-insights.md](./docs/rappi-strategic-insights.md)
- [docs/rappi-rapitenderos-analysis.md](./docs/rappi-rapitenderos-analysis.md)
- [docs/rappi-restaurants-analysis.md](./docs/rappi-restaurants-analysis.md)

### 6.4 Herramientas Disponibles

> **Full Stack Details**: [CLAUDE.md - Stack Técnico](./CLAUDE.md#-stack-técnico)

#### Development
- Node.js 20+ (required for Next.js 15)
- pnpm (package manager)
- TypeScript 5.9.2 (strict mode)
- Jest (testing framework)

#### Deployment
- Vercel (Edge Functions, global CDN)
- Supabase (PostgreSQL database)
- Stripe (payments)

#### AI & Integration
- Gemini 2.5 Flash (ONLY AI provider - FREE tier)
- WhatsApp Cloud API (Business API v23.0) + RCS

---

## 7. Contacto y Soporte

### 7.1 Responsables del Proyecto

**Project Lead**: [TBD]
- **Rol**: Strategic decisions, business validation
- **Contacto**: [TBD]

**Technical Lead**: [TBD]
- **Rol**: Architecture, implementation oversight
- **Contacto**: [TBD]

**AI Engineer**: [TBD]
- **Rol**: Gemini integration, cost optimization
- **Contacto**: [TBD]

### 7.2 Canales de Comunicación

**Prioritarios**:
1. GitHub Issues - Bug reports, feature requests
2. [Project Board](TBD) - Task tracking, sprint planning
3. [Slack/Discord](TBD) - Real-time communication

**Documentación**:
- Updates: Pull requests to docs/
- Decisions: Documented in .claude/memory/
- Architecture: RFC process (TBD)

### 7.3 Proceso de Escalación

#### Nivel 1: Decisiones Técnicas
- **Responsable**: Technical Lead
- **Tiempo**: <24 horas
- **Scope**: Implementation details, framework choices

#### Nivel 2: Decisiones de Negocio
- **Responsable**: Project Lead
- **Tiempo**: <48 horas
- **Scope**: Unit economics changes, pricing, stakeholder impact

#### Nivel 3: Estrategia y Pivots
- **Responsable**: Founding team
- **Tiempo**: <1 semana
- **Scope**: Market strategy, major pivots, funding decisions

### 7.4 Contribuciones

**Pull Request Requirements**:
- [ ] Unit economics validated (if applicable)
- [ ] Tests added/updated (>80% coverage)
- [ ] CLAUDE.md updated (session context)
- [ ] Cost impact documented
- [ ] Edge Runtime compatible (verified)
- [ ] Gemini FREE tier compliance (if using AI)

**Review Process**:
1. Automated checks (tests, linting, type-check)
2. Technical review (code quality, performance)
3. Business validation (unit economics impact)
4. Approval and merge

---

## 📊 Métricas de Calidad para Agentes

### Indicadores de Éxito
- ✅ **Completitud**: ¿Feature completo según spec?
- ✅ **Unit Economics**: ¿Profit/order maintained (>$0.80)?
- ✅ **Performance**: ¿Webhooks <100ms, DB <50ms?
- ✅ **Cost**: ¿Operational cost dentro de budget?
- ✅ **Quality**: ¿Tests >80%, Edge compatible?

### Proceso de Evaluación
1. **Pre-implementation**: Unit economics validation
2. **During**: Cost tracking, performance monitoring
3. **Post-implementation**: Impact measurement, documentation update

---

## 🎯 Quick Reference para Agentes

### Decisión Rápida: ¿Implementar este Feature?

```yaml
Checklist:
  - [ ] Unit economics validated ($0.86 profit/order maintained)
  - [ ] Gemini FREE tier sufficient (<1,400 req/day)
  - [ ] WhatsApp cost acceptable (<90% free messages)
  - [ ] Edge Runtime compatible (no Node.js modules)
  - [ ] Performance target achievable (<100ms webhooks)
  - [ ] Test coverage planned (>80% for critical paths)
  - [ ] Documentation updated (CLAUDE.md, relevant docs)

Si TODAS las respuestas son SÍ → PROCEDER
Si ALGUNA es NO → ESCALATE o REDISEÑAR
```

---

**Última actualización**: 2025-10-12
**Versión**: 2.0
**Mantenido por**: Claude-Master v4.0
**Proyecto**: Weats.ai - Three-AI Conversational Delivery Ecosystem
**Arquitectura**: Weats.Restaurant + Weats.Runner + Weats.Client (sincronizados vía orchestration.ts)
**Economics**: $0.86 profit/order, validate in every task
**Posicionamiento**: "Liberar el delivery de los monopolios, devolviendo el poder a quienes cocinan, reparten y comen"
