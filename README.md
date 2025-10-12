# Weats.ai - Three-AI Conversational Delivery Ecosystem

> **Tres inteligencias artificiales, un propósito: liberar el delivery de los monopolios**
>
> **Challenging Rappi's 64% Colombian market dominance with three conversational AIs (Weats.Restaurant, Weats.Runner, Weats.Client) synchronized via WhatsApp & RCS, devolviendo el poder a quienes cocinan, reparten y comen**

[![Status](https://img.shields.io/badge/status-MVP_Ready-blue)](./CLAUDE.md)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Architecture](https://img.shields.io/badge/architecture-Three--AI_Ecosystem-purple)](#-the-three-ai-ecosystem)

---

## 🎯 Mission

Disrupt Colombia's food delivery market with **three conversational AIs** that empower **everyone**:
- **Customers** (via Weats.Client): $0 service fees, conversational ordering WhatsApp/RCS (save 35-40% vs Rappi)
- **Restaurants** (via Weats.Restaurant): 5-10% commission, 90% AI automation (vs Rappi 25-35%)
- **Workers/Rapitenderos** (via Weats.Runner): 50-100% higher pay, full autonomy & transparency
- **Platform**: $0.86 profit/order (34% margin) - profitable, ethical AND AI-first

**Positioning**: "Liberar el delivery de los monopolios, devolviendo el poder a quienes cocinan, reparten y comen"

## 🚀 The Disruptive Model

| Metric | Weats | Rappi | Advantage |
|--------|---------|-------|-----------|
| **Customer Fees** | $0 | 15-20% | **$9 savings/order** |
| **Restaurant Commission** | 5-10% | 25-35% | **+$8.53 revenue/order** |
| **Worker Pay** | $5,000-7,000 COP | $2,500 COP | **4x higher earnings** |
| **Profit/Order** | $0.86 (34%) | Recently profitable | **Sustainable & fair** |

### Why It Works: 91% Lower Costs

1. **WhatsApp-Native**: No app development, 90% Colombia penetration, viral growth
2. **AI Automation**: Gemini FREE tier (1,500 req/day), 90% support automation, $0 AI cost
3. **Lean Team**: 15 people vs Rappi 12,600 (84x more efficient)
4. **Edge Functions**: Global <100ms latency, fire-and-forget, minimal infrastructure

**Result**: $1.67 operational cost per order (vs Rappi estimated $18+)

## 🧩 The Three-AI Ecosystem

**Concepto Central**: Tres inteligencias artificiales independientes que conversan en sus propios canales (WhatsApp/RCS) pero se sincronizan automáticamente a través del backend de Weats.ai.

**No hay intermediarios**: La IA conecta directamente al cliente con el restaurante y al restaurante con el repartidor, **sin apps, sin comisiones, sin monopolio**.

### 1. Weats.Restaurant — La IA que Gestiona el Restaurante

**Función**: Automatiza pedidos, reservas, inventario, y servicio al cliente.

**Capacidades**:
- Toma pedidos por WhatsApp usando IA conversacional (Gemini)
- Integra pagos (Wompi, Mercado Pago, Nequi, Stripe)
- Confirma reservas automáticamente y actualiza disponibilidad
- Notifica al runner más cercano (vía Weats.Runner)
- Gestiona el CRM conversacional: historial de clientes, preferencias y feedback

**Valor**: Elimina el 90% del trabajo manual del personal, reduce costos operacionales, aumenta la fidelización del cliente directo (sin depender de Rappi).

### 2. Weats.Runner — La IA que Coordina los Repartidores

**Función**: Orquesta la logística entre restaurantes y clientes sin plataformas intermediarias.

**Capacidades**:
- Conversa con los repartidores (por WhatsApp o Telegram)
- Asigna pedidos según ubicación y disponibilidad (PostGIS <10ms)
- Envía direcciones, tiempos estimados y actualizaciones al cliente
- Procesa pagos automáticos y divide ingresos transparentemente
- Usa IA para optimizar rutas y tiempos de entrega

**Valor**: Empodera a los repartidores (ellos deciden qué pedidos tomar), transparencia total en tarifas (sin comisiones ocultas), reducción del tiempo de entrega por optimización inteligente.

### 3. Weats.Client — La IA que Conversa con el Cliente Final

**Función**: Atiende al cliente desde el primer "hola" hasta el "gracias".

**Capacidades**:
- Conversa por WhatsApp o Google Business (RCS)
- Permite pedir, reservar o calificar la experiencia
- Sugiere platos según hábitos y hora del día
- Coordina con las otras IAs para confirmar pedido y entrega
- Aprende del cliente para ofrecer experiencias personalizadas

**Valor**: Cero fricción (sin apps, sin esperas, sin formularios), comunicación directa con el restaurante y el runner, experiencia humana y personalizada.

### ⚙️ Sincronización y Orquestación

Detrás, un motor de IA orquestada en Vercel conecta los tres agentes mediante APIs seguras:

1. Cuando un cliente hace un pedido, **Weats.Client** lo envía a **Weats.Restaurant**
2. **Weats.Restaurant** valida stock, precio y genera el pago
3. Al confirmar, **Weats.Runner** recibe la orden y gestiona la entrega
4. Todo el ciclo de vida del pedido ocurre en conversación, **sin apps ni pantallas**

**Impacto**:
- **Para el restaurante**: 0% comisión monopolística, más ventas directas
- **Para el runner**: pago justo, autonomía total
- **Para el cliente**: pedir, pagar y recibir conversando

## 🛠 Tech Stack

### Frontend & Backend
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5.9.2 (strict mode)
- **Deployment**: Vercel Edge Functions (<100ms TTFB)

### Database & Storage
- **Database**: Supabase PostgreSQL 15.8
- **Geospatial**: PostGIS (location queries <10ms)
- **Semantic Search**: pgvector (menu recommendations)

### Messaging & AI (Three-AI Ecosystem)
- **Messaging**: WhatsApp Business API v23.0 + RCS (Google Business Messages)
- **AI**: Gemini 2.5 Flash **FREE tier only** (1,400 req/day shared across 3 AIs)
  - **Weats.Restaurant**: Restaurant management AI (orders, reservations, inventory, CRM)
  - **Weats.Runner**: Delivery coordination AI (dispatch, routes, payments)
  - **Weats.Client**: Customer-facing AI (conversational ordering, tracking, support)
- **Orchestration**: Edge Functions-based synchronization layer (lib/ai/orchestration.ts)
- **Language**: Colombian Spanish conversational AI

### Payments
- **Provider**: Stripe
- **Integration**: WhatsApp Flows v3 checkout

---

## 📦 Quick Start

### Prerequisites

- Node.js 20+ (required for Next.js 15)
- pnpm (recommended) or npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/neeroai/weats.git
cd weats

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

You'll need API keys for:
1. **Supabase**: [supabase.com/dashboard](https://supabase.com/dashboard) (free tier)
2. **WhatsApp**: [developers.facebook.com](https://developers.facebook.com/) (Business API)
3. **Gemini**: [makersuite.google.com](https://makersuite.google.com/app/apikey) (FREE tier: 1,500 req/day)
4. **Stripe**: [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) (test mode)

See [.env.example](./.env.example) for complete list.

---

## 📁 Project Structure

```
weats/
├── AGENTS.md                    # Agent orchestration documentation
├── CLAUDE.md                    # Session context (<5000 tokens)
├── README.md                    # This file
├── package.json                 # Dependencies & scripts
│
├── .claude/
│   ├── agents/                  # Specialized agent definitions
│   │   ├── claude-master.md     # Main orchestrator (v4.0)
│   │   └── delegation-matrix.md # Task routing
│   ├── commands/                # Custom slash commands
│   └── memory/                  # Session learnings
│
├── app/
│   └── api/                     # Edge Functions (webhooks)
│       ├── whatsapp/webhook/    # Main WhatsApp entry
│       ├── orders/              # Order processing
│       ├── restaurants/         # Restaurant management
│       ├── dispatch/            # Worker assignment
│       └── payments/            # Stripe integration
│
├── lib/                         # Core business logic
│   ├── ai/                      # Three-AI Ecosystem
│   │   ├── restaurant-agent.ts  # Weats.Restaurant (orders, reservations, inventory, CRM)
│   │   ├── runner-agent.ts      # Weats.Runner (dispatch, routes, payments)
│   │   ├── client-agent.ts      # Weats.Client (conversational ordering, tracking)
│   │   └── orchestration.ts     # Synchronization layer (multi-AI coordination)
│   ├── gemini-client.ts         # Gemini FREE tier (ONLY provider)
│   ├── supabase.ts              # Database client (Edge compatible)
│   ├── whatsapp.ts              # WhatsApp API wrapper
│   ├── rcs.ts                   # RCS/Google Business Messages wrapper
│   ├── messaging-windows.ts     # 24h window management
│   ├── order-processing.ts      # Order lifecycle
│   └── dispatch-system.ts       # Worker matching (PostGIS)
│
├── components/                  # React components
├── types/                       # TypeScript definitions
├── tests/                       # Test suites (Jest)
├── supabase/migrations/         # Database schema
├── public/                      # Static assets
│
└── docs/                        # Complete documentation
    ├── weats/                 # Business docs (16 docs)
    ├── platforms/               # Tech platform docs
    ├── guides/                  # How-to tutorials
    ├── reference/               # API specs
    └── architecture/            # System design
```

---

## 📚 Documentation

### Core Documentation
- [CLAUDE.md](./CLAUDE.md) - Session context for Claude Code (<5000 tokens)
- [AGENTS.md](./AGENTS.md) - Agent orchestration & research methodology
- [docs/README.md](./docs/README.md) - Complete documentation hub

### Business Model
- [Executive Summary](./docs/weats/EXECUTIVE_SUMMARY.md) - Investor pitch (96.9x return)
- [Business Model](./docs/weats/business-model-overview.md) - Complete disruptive model
- [Unit Economics](./docs/weats/unit-economics.md) - $0.86 profit/order breakdown
- [Competitive Analysis](./docs/weats/competitive-analysis.md) - 91% cost advantage vs Rappi
- [Go-to-Market](./docs/weats/go-to-market-strategy.md) - Bogotá → Multi-city → National

### AI Strategy (8 Documents, ~315 Pages)
- [AI Overview](./docs/weats/ai-strategy-overview.md) - AI as structural moat
- [Customer Experience](./docs/weats/ai-customer-experience.md) - Conversational ordering
- [Restaurant Optimization](./docs/weats/ai-restaurant-optimization.md) - Demand forecasting
- [Worker Optimization](./docs/weats/ai-worker-optimization.md) - Route optimization
- [Technical Architecture](./docs/weats/ai-technical-architecture.md) - Gemini-only implementation
- [Cost Optimization](./docs/weats/ai-cost-optimization.md) - FREE tier strategies
- [Competitive Advantage](./docs/weats/ai-competitive-advantage.md) - Why Rappi can't respond
- [Roadmap](./docs/weats/ai-roadmap.md) - MVP → Market Leadership (52 weeks)

### Technical Documentation
- [WhatsApp Integration](./docs/platforms/whatsapp/README.md) - API v23.0 guide
- [Edge Functions](./docs/platforms/vercel/README.md) - Optimization & deployment
- [Database](./docs/platforms/supabase/README.md) - PostgreSQL, PostGIS, pgvector
- [AI Platform](./docs/platforms/ai/providers/gemini/README.md) - Gemini FREE tier

---

## 🎯 Development Status

### ✅ Phase 0: Foundation (Completed)
- [x] Business model documentation (8 core docs)
- [x] AI strategy documentation (8 docs, ~315 pages)
- [x] Competitive intelligence (7 Rappi analysis docs)
- [x] Agent system setup (8 specialized agents)
- [x] Project structure & configuration
- [x] **Three-AI Ecosystem Architecture** (Weats.Restaurant, Weats.Runner, Weats.Client)

### 🔄 Phase 1: MVP (Weeks 1-4) - Current Focus
**Architecture**: Three-AI ecosystem (Restaurant, Runner, Client) synchronized via Edge Functions
**Target**: 50 restaurants, 20 workers, 500 customers (Bogotá - Zona T + Chicó)

**Week 1**: Database & Webhooks + Three-AI Base
- [ ] Supabase schema (10 tables + PostGIS + pgvector)
- [ ] WhatsApp + RCS webhook handlers (Edge Functions, fire-and-forget)
- [ ] Three-AI base structure (restaurant-agent.ts, runner-agent.ts, client-agent.ts)
- [ ] Orchestration layer (orchestration.ts)

**Week 2**: Customer Ordering (Weats.Client)
- [ ] Weats.Client conversational ordering (Colombian Spanish)
- [ ] Interactive WhatsApp/RCS messages (catalogs, buttons)
- [ ] Client-Restaurant orchestration

**Week 3**: Restaurants & Workers (Weats.Restaurant + Weats.Runner)
- [ ] Weats.Restaurant management (onboarding, menu, orders via conversation)
- [ ] Weats.Runner dispatch system (PostGIS matching, route optimization)
- [ ] Restaurant-Runner orchestration

**Week 4**: Payments & Launch
- [ ] Stripe integration (WhatsApp Flows checkout)
- [ ] Full three-AI orchestration end-to-end testing
- [ ] Launch with 50 restaurants (three AIs operational)

### 📅 Upcoming Phases
- **Phase 2** (Weeks 5-8): Scale to 500 restaurants, 10,000 customers
- **Phase 3** (Weeks 9-16): Multi-city expansion (Medellín, Cali)

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Read documentation**: Start with [AGENTS.md](./AGENTS.md) for context
2. **Follow conventions**: TypeScript strict, Edge Runtime compatible
3. **Validate economics**: Every feature must maintain $0.86 profit/order
4. **Use Gemini only**: No other AI providers (cost optimization)
5. **Write tests**: >80% coverage for critical paths

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# ... code ...

# Run tests
pnpm test

# Type check
pnpm type-check

# Format code
pnpm format

# Create PR
git push origin feature/your-feature
```

---

## 📊 Key Metrics

### Unit Economics (per order)
```
Revenue:  $2.53 (8.4% take rate on $30 AOV)
Costs:    $1.67
  - Delivery:        $1.40 (worker pay + benefits)
  - WhatsApp:        $0.03 (90%+ free, 24h window)
  - AI (Gemini):     $0.0005 (FREE tier)
  - Infrastructure:  $0.24 (Vercel + Supabase)

Profit:   $0.86 (34% margin)
```

### Performance Targets
- Webhook TTFB: <100ms (WhatsApp 5s timeout)
- DB queries: <50ms (PostGIS <10ms)
- Edge cold start: <200ms
- Test coverage: >80% (critical paths)

### Business Targets (Phase 1)
- Restaurants: 50 (Zona T + Chicó, Bogotá)
- Workers: 20 active rapitenderos
- Customers: 500 active users
- Orders: 20-30/day by Week 4

---

## 🔒 Security

- HMAC signature validation (WhatsApp webhooks)
- Environment variables (never commit secrets)
- Row Level Security (Supabase RLS policies)
- PCI compliance (Stripe integration)
- Rate limiting (prevent abuse)

Report security issues to: [security@weats.com](mailto:security@weats.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Why Weats?

### For Customers
- **$0 service fees** (save $9 per $30 order vs Rappi)
- **30-second ordering** via WhatsApp (no app download)
- **AI-powered recommendations** (personalized, Colombian Spanish)
- **Real-time tracking** (location sharing)

### For Restaurants
- **5-10% commission** (keep 92-95% of revenue vs Rappi 65-75%)
- **30-second onboarding** via WhatsApp
- **Free analytics** (demand forecasting, menu optimization)
- **Weekly payments** with full transparency

### For Workers (Rapitenderos)
- **$5,000-7,000 COP per delivery** (vs Rappi $2,500)
- **Gas reimbursement** (30% subsidy)
- **Maintenance fund** (15% subsidy)
- **Benefits pool** (insurance, health, emergency loans)
- **Net income: $82,000/day** (vs Rappi $20,000)

---

## 📞 Contact

- **Website**: [weats.com](https://weats.com) (TBD)
- **Email**: [hello@weats.com](mailto:hello@weats.com)
- **Twitter**: [@weats](https://twitter.com/weats) (TBD)

---

**Built with ❤️ in Colombia | Powered by Three AIs (Weats.Restaurant, Weats.Runner, Weats.Client), WhatsApp & RCS, Gemini AI, and Edge Functions**

**Status**: MVP Ready for Phase 1 Implementation (2025-10-12)
**Architecture**: Three-AI Conversational Ecosystem
**Target Launch**: March 2025 (Bogotá)
**Mission**: Liberar el delivery de los monopolios, devolviendo el poder a quienes cocinan, reparten y comen 🚀
**Economics**: Profitable food delivery that benefits everyone ($0.86 profit/order, 34% margin)
