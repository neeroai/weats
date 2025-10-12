# Weats - Documentation

WhatsApp AI Food Delivery Platform challenging Rappi with $0 customer fees, 5-10% restaurant fees, and 50-100% higher worker pay. Built with Next.js 15, Vercel Edge, Supabase, WhatsApp v23, and Multi-Provider AI (Gemini FREE, OpenAI, Claude, Groq).

## Quick Navigation

### 🚀 New to Weats?
1. [Getting Started Guide](./guides/getting-started.md) - Setup and local development
2. [Architecture Overview](./architecture/README.md) - System design and patterns
3. [Deployment Guide](./platforms/vercel/README.md) - Deploy to production
4. [Business Model Overview](./weats/business-model-overview.md) - Unit economics and competitive strategy

### 📦 Weats Business Documentation
- [Executive Summary](./weats/EXECUTIVE_SUMMARY.md) - Investor pitch (96.9x return potential)
- [Business Model](./weats/business-model-overview.md) - Disruptive model & value proposition
- [Unit Economics](./weats/unit-economics.md) - $0.86 profit/order (34% margin)
- [Competitive Analysis](./weats/competitive-analysis.md) - vs Rappi (91% cost advantage)
- [Go-to-Market Strategy](./weats/go-to-market-strategy.md) - Bogotá beachhead → National
- [Financial Projections](./weats/financial-projections.md) - 3-year path to $1M profit

### 🍕 Food Delivery Features
- [Customer Experience](./weats/customer-experience.md) - Conversational ordering, $0 fees
- [Restaurant Model](./weats/restaurant-model.md) - 5-10% fees, 30s onboarding
- [Rapitendero Model](./weats/rapitendero-model.md) - 50-100% higher pay, benefits
- [Technical Architecture](./weats/technical/whatsapp-architecture.md) - Complete system design

### 🛠️ Building Features?
- [How-to Guides](./guides/README.md) - Tutorials and feature implementation
- [API Reference](./reference/README.md) - API specs, schemas, performance guides
- [WhatsApp Integration](./platforms/whatsapp/README.md) - WhatsApp Business API v23.0

### 🌐 Platform Integrations
- [WhatsApp](./platforms/whatsapp/README.md) - Business API, interactive messages, flows
- [Vercel](./platforms/vercel/README.md) - Edge Functions, deployment, optimization
- [Supabase](./platforms/supabase/README.md) - PostgreSQL, PostGIS, pgvector
- [AI Providers](./platforms/ai/README.md) - Gemini FREE (primary), OpenAI, Claude, Groq

### 🤖 AI Strategy Documentation
- [AI Strategy Overview](./weats/ai-strategy-overview.md) - Complete AI vision & implementation
- [AI Customer Experience](./weats/ai-customer-experience.md) - Conversational ordering & personalization
- [AI Restaurant Optimization](./weats/ai-restaurant-optimization.md) - Demand forecasting & menu optimization
- [AI Worker Optimization](./weats/ai-worker-optimization.md) - Route optimization & earnings maximization
- [AI Technical Architecture](./weats/ai-technical-architecture.md) - Multi-provider infrastructure & implementation
- [AI Cost Optimization](./weats/ai-cost-optimization.md) - 99.9% cost reduction strategies
- [AI Competitive Advantage](./weats/ai-competitive-advantage.md) - Why Rappi cannot respond
- [AI Implementation Roadmap](./weats/ai-roadmap.md) - MVP to market leadership in 52 weeks

### 📊 Competitive Intelligence
- [Rappi Business Model](./rappi-business-model-overview.md) - Complete analysis
- [Rappi Economics](./rappi-financial-model.md) - Revenue model, costs, profitability
- [Rappi Restaurants](./rappi-restaurants-analysis.md) - Commission structure, pain points
- [Rappi Workers](./rappi-rapitenderos-analysis.md) - Worker economics, exploitation
- [Rappi Strategy](./rappi-strategic-insights.md) - Weaknesses, opportunities

---

## Documentation Structure

Following industry best practices from **Supabase**, **AWS**, and **Next.js**:

```
docs/
├── README.md                          # This file
│
├── guides/                            # How-to guides & tutorials (Diataxis)
│   ├── getting-started.md
│   ├── calendar-reminders.md
│   ├── interactive-messages.md
│   ├── reminder-automation.md
│   ├── typing-indicators.md
│   └── whatsapp-window-maintenance.md
│
├── architecture/                      # System design & explanations
│   ├── README.md
│   └── overview.md
│
├── reference/                         # API references & specs
│   ├── README.md
│   ├── whatsapp-webhook-spec.md
│   ├── edge-runtime-api.md
│   ├── api-performance-guide.md
│   ├── supabase-schema.md
│   └── supabase-access.md
│
├── platforms/                         # Platform-specific documentation
│   ├── README.md                      # Platform overview
│   ├── whatsapp/                      # WhatsApp Business API
│   │   ├── api-v23-guide.md
│   │   ├── flows-implementation.md
│   │   ├── interactive-features.md
│   │   ├── pricing-guide-2025.md
│   │   └── flows/                     # WhatsApp Flows subdocs
│   ├── vercel/                        # Vercel Edge deployment
│   │   ├── edge-error-handling.md
│   │   ├── edge-functions-optimization.md
│   │   ├── edge-observability.md
│   │   ├── edge-security-guide.md
│   │   └── functions-guide.md
│   ├── supabase/                      # Supabase PostgreSQL
│   │   ├── README.md
│   │   └── database-setup.md
│   └── ai/                            # Multi-provider AI
│       ├── README.md                  # Multi-provider overview
│       ├── provider-selection.md
│       └── providers/
│           ├── gemini/                # Primary (FREE)
│           ├── openai/                # Fallback #1
│           ├── claude/                # Emergency
│           └── groq/                  # Audio transcription
│
├── project/                           # Project management
│   ├── pitch-deck.md
│   └── presentations/
│
├── branding/                          # Brand assets
│   ├── logo-concept-presentation.md
│   ├── brand-guidelines.md
│   └── assets/
│
├── _partials/                         # Reusable content (Supabase pattern)
│   └── README.md
│
└── archive/                           # Historical documentation
    ├── research/                      # Pre-implementation research
    └── technical/                     # Completed audits
```

### Organization Philosophy

This structure follows **proven patterns** from industry leaders:

- **Supabase**: `content/guides/` organized by topic (storage, auth, functions)
- **AWS**: Platform-based organization (`applications/`, language-specific folders)
- **Next.js**: Clear separation of guides, reference, and platform docs

**Key Benefits:**
- ✅ **No numeric prefixes** - Professional, modern structure
- ✅ **Platform-based** - Easy to find integration-specific docs
- ✅ **Diataxis framework** - Guides (how-to), Reference (API), Explanations (architecture)
- ✅ **Scalable** - Easy to add new platforms (Stripe, Twilio, etc.)
- ✅ **Reusable content** - `_partials/` for common snippets (Supabase pattern)

---

## Quick Links by Topic

### WhatsApp Integration
- [WhatsApp API v23 Guide](./platforms/whatsapp/api-v23-guide.md)
- [Interactive Messages](./guides/interactive-messages.md)
- [WhatsApp Flows](./platforms/whatsapp/flows-implementation.md)
- [Pricing Guide 2025](./platforms/whatsapp/pricing-guide-2025.md)
- [Webhook Specification](./reference/whatsapp-webhook-spec.md)

### AI & Machine Learning
- [Multi-Provider AI Overview](./platforms/ai/README.md)
- [Gemini 2.5 Flash (Primary)](./platforms/ai/providers/gemini/README.md)
- [OpenAI GPT-4o-mini (Fallback)](./platforms/ai/providers/openai/README.md)
- [Claude Sonnet (Emergency)](./platforms/ai/providers/claude/README.md)
- [Groq Whisper (Audio)](./platforms/ai/providers/groq/README.md)

### Deployment & DevOps
- [Vercel Edge Functions](./platforms/vercel/README.md)
- [Edge Functions Optimization](./platforms/vercel/edge-functions-optimization.md)
- [Edge Security Guide](./platforms/vercel/edge-security-guide.md)
- [Error Handling](./platforms/vercel/edge-error-handling.md)
- [Observability](./platforms/vercel/edge-observability.md)

### Database & Backend
- [Supabase Overview](./platforms/supabase/README.md)
- [Database Schema](./reference/supabase-schema.md)
- [Supabase Access Guide](./reference/supabase-access.md)
- [Vercel-Supabase Integration](./platforms/vercel/supabase-integration.md)

### Features & Guides
- [Getting Started](./guides/getting-started.md)
- [Calendar & Reminders](./guides/calendar-reminders.md)
- [Reminder Automation](./guides/reminder-automation.md)
- [Typing Indicators](./guides/typing-indicators.md)
- [WhatsApp Window Management](./guides/whatsapp-window-maintenance.md)

---

## Tech Stack

**Frontend & Backend:**
- Next.js 15 (App Router)
- Vercel Edge Functions
- TypeScript 5.9.2 (strict mode)

**Database & Auth:**
- Supabase PostgreSQL
- Row Level Security (RLS)
- Real-time subscriptions

**AI Providers:**
- 🥇 Gemini 2.5 Flash (Primary - FREE, 1,500 req/day)
- 🥈 OpenAI GPT-4o-mini (Fallback - 96% cheaper than Claude)
- 🥉 Claude Sonnet 4.5 (Emergency - highest quality)
- 🎤 Groq Whisper (Audio - 93% cheaper than OpenAI)

**Integrations:**
- WhatsApp Business API v23.0
- MCP (Model Context Protocol) for Supabase

---

## Contributing to Docs

### Adding Documentation

1. **Choose the right section:**
   - **guides/** - How-to tutorials ("How to implement X")
   - **reference/** - API specs, schemas ("API endpoint Y returns Z")
   - **architecture/** - Design explanations ("Why we chose X over Y")
   - **platforms/** - Platform-specific integration ("WhatsApp Flows setup")

2. **Follow naming conventions:**
   - Lowercase filenames: `getting-started.md` not `Getting-Started.md`
   - Kebab-case: `api-v23-guide.md` not `api_v23_guide.md`
   - Descriptive: `edge-functions-optimization.md` not `optimization.md`

3. **Update READMEs:**
   - Add entry to section README
   - Link from this main index
   - Update related docs

4. **Code examples:**
   - Always include TypeScript types
   - Show imports (`import { X } from '@/lib/Y'`)
   - Include error handling
   - Add comments for complex logic

5. **Keep it maintainable:**
   - Files <300 lines (split if needed)
   - Use `_partials/` for reusable content
   - Link to related docs

### Archiving Old Docs

Move superseded content to `archive/`:

```bash
git mv docs/old-guide.md docs/archive/research/old-guide.md
# Update archive/README.md with context
```

---

## Production Links

- **Project**: Weats - Disruptive WhatsApp AI Food Delivery
- **CLAUDE.md**: [Project instructions](../CLAUDE.md)
- **Main README**: [../README.md](../README.md)
- **Supabase Dashboard**: TBD (database pending setup)
- **Vercel Dashboard**: TBD (deployment pending)

---

## Project Status

**Current Phase**: Documentation Complete, Ready for MVP Implementation

**Business Model:**
- ✅ Complete market research (Rappi analysis)
- ✅ Disruptive model defined ($0 customers, 5-10% restaurants, 50-100% higher worker pay)
- ✅ Unit economics validated ($0.86 profit/order, 34% margin)
- ✅ Go-to-market strategy (Bogotá → Multi-city → National)
- ✅ Financial projections (3-year path to profitability)

**Technical Architecture:**
- ✅ WhatsApp-native conversational ordering (complete design)
- ✅ Multi-provider AI (Gemini FREE tier optimization)
- ✅ Database schema (10 tables: customers, restaurants, orders, deliveries, workers)
- ✅ Edge Functions architecture (Vercel, <100ms latency)
- ✅ 16-week implementation roadmap

**Next Steps (MVP - Weeks 1-4):**
- [ ] Database setup (Supabase with PostGIS + pgvector)
- [ ] WhatsApp webhook handler (Edge Function)
- [ ] Customer ordering flow (conversational AI with Gemini)
- [ ] Restaurant management (WhatsApp interface)
- [ ] Worker dispatch system (AI-powered matching)
- [ ] Payment integration (Stripe)

**Target:** 50 restaurants, 20 workers, 500 customers in Bogotá (Zona T + Chicó)

---

**Last Updated**: 2025-01-11
**Version**: 4.0.0 (Weats - Complete transformation from AI assistant to food delivery platform)
**Project**: Weats - Challenging Rappi's 64% Colombian market dominance
**Economics**: $0.86 profit/order, $0 customer fees, 5-10% restaurant fees, 50-100% higher worker pay
