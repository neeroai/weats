# WPFoods - Disruptive WhatsApp AI Food Delivery Platform

> **Challenging Rappi's 64% Colombian market dominance with a WhatsApp-native, AI-powered platform that benefits all stakeholders**

[![Status](https://img.shields.io/badge/status-MVP_Ready-blue)](./CLAUDE.md)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

---

## 🎯 Mission

Disrupt Colombia's food delivery market with a platform that benefits **everyone**:
- **Customers**: $0 service fees (save 35-40% vs Rappi)
- **Restaurants**: 5-10% commission (vs Rappi 25-35%)
- **Workers (Rapitenderos)**: 50-100% higher pay per delivery
- **Platform**: $0.86 profit/order (34% margin) - profitable AND ethical

## 🚀 The Disruptive Model

| Metric | WPFoods | Rappi | Advantage |
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

## 🛠 Tech Stack

### Frontend & Backend
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5.9.2 (strict mode)
- **Deployment**: Vercel Edge Functions (<100ms TTFB)

### Database & Storage
- **Database**: Supabase PostgreSQL 15.8
- **Geospatial**: PostGIS (location queries <10ms)
- **Semantic Search**: pgvector (menu recommendations)

### Messaging & AI
- **Messaging**: WhatsApp Business API v23.0 (24h window optimization)
- **AI**: Gemini 2.5 Flash **FREE tier only** (1,400 req/day)
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
git clone https://github.com/wpfoods/wpfoods.git
cd wpfoods

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
wpfoods/
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
│   ├── gemini-client.ts         # Gemini FREE tier (ONLY provider)
│   ├── gemini-agents.ts         # Conversational AI
│   ├── supabase.ts              # Database client (Edge compatible)
│   ├── whatsapp.ts              # WhatsApp API wrapper
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
    ├── wpfoods/                 # Business docs (16 docs)
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
- [Executive Summary](./docs/wpfoods/EXECUTIVE_SUMMARY.md) - Investor pitch (96.9x return)
- [Business Model](./docs/wpfoods/business-model-overview.md) - Complete disruptive model
- [Unit Economics](./docs/wpfoods/unit-economics.md) - $0.86 profit/order breakdown
- [Competitive Analysis](./docs/wpfoods/competitive-analysis.md) - 91% cost advantage vs Rappi
- [Go-to-Market](./docs/wpfoods/go-to-market-strategy.md) - Bogotá → Multi-city → National

### AI Strategy (8 Documents, ~315 Pages)
- [AI Overview](./docs/wpfoods/ai-strategy-overview.md) - AI as structural moat
- [Customer Experience](./docs/wpfoods/ai-customer-experience.md) - Conversational ordering
- [Restaurant Optimization](./docs/wpfoods/ai-restaurant-optimization.md) - Demand forecasting
- [Worker Optimization](./docs/wpfoods/ai-worker-optimization.md) - Route optimization
- [Technical Architecture](./docs/wpfoods/ai-technical-architecture.md) - Gemini-only implementation
- [Cost Optimization](./docs/wpfoods/ai-cost-optimization.md) - FREE tier strategies
- [Competitive Advantage](./docs/wpfoods/ai-competitive-advantage.md) - Why Rappi can't respond
- [Roadmap](./docs/wpfoods/ai-roadmap.md) - MVP → Market Leadership (52 weeks)

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

### 🔄 Phase 1: MVP (Weeks 1-4) - Current Focus
**Target**: 50 restaurants, 20 workers, 500 customers (Bogotá - Zona T + Chicó)

**Week 1**: Database & Webhooks
- [ ] Supabase schema (10 tables + PostGIS + pgvector)
- [ ] WhatsApp webhook handler (Edge Function, fire-and-forget)

**Week 2**: Customer Ordering
- [ ] Gemini conversational ordering (Colombian Spanish)
- [ ] Interactive WhatsApp messages (catalogs, buttons)

**Week 3**: Restaurants & Workers
- [ ] Restaurant management (onboarding, menu, orders)
- [ ] Worker dispatch system (PostGIS matching)

**Week 4**: Payments & Launch
- [ ] Stripe integration (WhatsApp Flows checkout)
- [ ] Launch with 50 restaurants

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

Report security issues to: [security@wpfoods.com](mailto:security@wpfoods.com)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🌟 Why WPFoods?

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

- **Website**: [wpfoods.com](https://wpfoods.com) (TBD)
- **Email**: [hello@wpfoods.com](mailto:hello@wpfoods.com)
- **Twitter**: [@wpfoods](https://twitter.com/wpfoods) (TBD)

---

**Built with ❤️ in Colombia | Powered by WhatsApp, Gemini AI, and Edge Functions**

**Status**: MVP Ready for Phase 1 Implementation (2025-01-11)
**Target Launch**: March 2025 (Bogotá)
**Mission**: Profitable food delivery that benefits everyone 🚀
