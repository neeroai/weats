# 🚀 Guía Completa: Mejores Prácticas para Claude Code con Plan Max

> **Última actualización**: Octubre 2025  
> **Objetivo**: Maximizar eficiencia y minimizar consumo de tokens en Claude Code

## 📋 Tabla de Contenidos

1. [Entendiendo los Límites del Plan Max](#entendiendo-los-límites)
2. [Estrategias Clave de Optimización](#estrategias-clave)
3. [Template CLAUDE.md Optimizado](#template-claudemd)
4. [Comandos Esenciales](#comandos-esenciales)
5. [Errores Comunes a Evitar](#errores-comunes)
6. [Workflow Optimizado](#workflow-optimizado)
7. [Métricas y Monitoreo](#métricas-monitoreo)
8. [Tips Avanzados](#tips-avanzados)

---

## 🎯 Entendiendo los Límites del Plan Max {#entendiendo-los-límites}

### Límites por Plan

| Plan | Precio | Mensajes/5h | Prompts Claude Code/5h | Sonnet 4/semana | Opus 4/semana |
|------|--------|--------------|------------------------|------------------|---------------|
| **Max 5x** | $100/mes | ~225 | 50-200 | 140-280 horas | 15-35 horas |
| **Max 20x** | $200/mes | ~900 | 200-800 | 240-480 horas | 24-40 horas |

### Puntos Clave
- ⏰ **Reset cada 5 horas** - Tiempo exacto visible en la interfaz
- 🔄 **Cambio automático de modelo** - Max 5x: 20% uso, Max 20x: 50% uso
- 📊 **Límites semanales** - Adicionales desde agosto 2025
- 🚫 **Opus consume 5x más rápido** que Sonnet

---

## 🔥 Estrategias Clave de Optimización {#estrategias-clave}

### 1. Modelo Híbrido Inteligente

```bash
# Para planificación y arquitectura (usa Opus)
/model opus
"Diseña la arquitectura para sistema de pagos con stripe"

# Para implementación (cambia a Sonnet)
/model sonnet  
"Implementa la función de procesamiento de pagos"
```

### 2. Gestión del Contexto

#### Comandos de Limpieza
```bash
/clear     # Reinicia completamente - úsalo entre tareas diferentes
/compact   # Reduce contexto manteniendo lo esencial
/context   # Verifica uso actual del contexto
```

#### Regla del 80%
- **0-60%**: Trabajo normal
- **60-80%**: Considera compactar
- **80-100%**: EVITA tareas complejas, compacta o reinicia

### 3. Optimización de Prompts

#### ❌ MALO - Vago y genera múltiples interacciones
```
"Arregla el bug"
"Mejora el código"
"Haz que funcione mejor"
```

#### ✅ BUENO - Específico y completo
```
"Fix the off-by-one error in utils/arrayProcessor.js line 45 
that skips the last array element. 
Input: number[], Output: processed number[].
Maintain TypeScript types and add a test case."
```

### 4. Uso de Projects para Caché

```bash
# Estructura óptima de proyecto
proyecto/
├── knowledge/          # Documentos que se cachean
│   ├── api-docs.md    # Referencia frecuente
│   ├── schemas.json   # Estructuras de datos
│   └── examples.md    # Código de referencia
└── CLAUDE.md          # < 5000 tokens
```

**Beneficio**: Contenido en Projects se cachea y no cuenta contra límites en reusos

### 5. Planificación por Ciclos

```javascript
// Ejemplo de planificación
const resetTime = "14:30"; // Tu hora de reset
const intensiveTasks = [
  "Refactoring complejo",
  "Diseño de arquitectura", 
  "Review de código grande"
];

// Programa tareas intensivas justo después del reset
scheduleAfterReset(intensiveTasks);
```

---

## 📄 Template CLAUDE.md Optimizado {#template-claudemd}

```markdown
# CLAUDE.md - [NOMBRE_PROYECTO]
<!-- Mantener bajo 5000 tokens. Última actualización: [FECHA] -->

## 🎯 Contexto del Proyecto
**Propósito**: [Una línea clara del objetivo principal]
**Estado**: [Desarrollo/Producción/MVP]
**Inicio**: [Fecha] | **Deploy**: [Fecha prevista]

## 🛠 Stack Técnico
```yaml
frontend: [React 18, Next.js 14, TailwindCSS]
backend: [Node.js, Express, PostgreSQL]
tools: [Docker, pnpm, Vite]
testing: [Jest, Playwright]
ci/cd: [GitHub Actions]
```

## 📁 Estructura Crítica
```
src/
├── components/   # Componentes reutilizables
├── pages/       # Rutas principales  
├── api/         # Endpoints
├── utils/       # Helpers críticos
└── hooks/       # Custom hooks principales
```

## 🔧 Configuración Esencial
```bash
# Comandos frecuentes
pnpm dev         # Puerto 3000
pnpm test        # Tests unitarios
pnpm build       # Build producción

# Variables de entorno requeridas
DATABASE_URL=
API_KEY=
NODE_ENV=
```

## 📐 Convenciones de Código
- **Naming**: camelCase variables, PascalCase componentes
- **Imports**: Absolute paths desde @/
- **Types**: TypeScript strict mode
- **Commits**: Conventional commits (feat:/fix:/docs:)
- **Max línea**: 80 caracteres
- **CRÍTICO**: [Regla específica importante del proyecto]

## 🎨 Patrones de Diseño Actuales
1. **State**: Zustand global, useState local
2. **API**: Custom hooks + react-query
3. **Errors**: Boundaries + toast notifications
4. **Auth**: JWT en httpOnly cookies
5. **Validación**: Zod schemas

## 🚧 Estado Actual del Desarrollo

### ✅ Completado
- [x] Autenticación básica
- [x] CRUD de usuarios
- [x] Sistema de permisos

### 🔄 En Progreso (FOCO ACTUAL)
- [ ] **Feature activo**: [Descripción breve]
  - Archivo: `src/components/FeatureX.tsx`
  - Problema: [Si hay alguno]
  - Siguiente: [Acción concreta]

### 📋 TODOs Prioritarios
1. **URGENTE**: [Bug crítico/feature bloqueante]
2. **Alta**: [Feature importante próxima]
3. **Media**: [Mejoras pendientes]

## 🐛 Bugs Conocidos
```yaml
BUG-001:
  archivo: src/utils/helper.js:45
  descripción: "Off-by-one en array processing"
  impacto: Alto
  workaround: "Usar slice(0, -1) temporalmente"

BUG-002:
  archivo: src/api/users.js
  descripción: "Memory leak en websocket"
  impacto: Medio
  nota: "Solo en desarrollo"
```

## 🔄 Decisiones Técnicas Recientes
- **[FECHA]**: Migrado de X a Y porque [razón]
- **[FECHA]**: Adoptado patrón Z para [beneficio]

## 📊 Métricas de Performance Target
- LCP: < 2.5s
- Bundle size: < 200kb gzipped
- Test coverage: > 80%

## 🚀 Contexto de Sesión Actual
**Última tarea**: [Qué se completó]
**Branch**: feature/[nombre]
**PRs pendientes**: #123, #124
**Bloqueadores**: [Si hay alguno]

## 💡 Notas Rápidas para Claude
- NO modificar `/legacy`
- SIEMPRE usar transactions en DB
- PREFERIR composición sobre herencia
- EVITAR any types en TypeScript
- Al modificar esquema, actualizar migrations

## 🔗 Referencias Externas Críticas
- [API Docs](URL) - endpoints
- [Design System](URL) - componentes UI
- [Project Board](URL) - contexto tareas

---
<!-- 
PARA CLAUDE: Este es tu memoria persistente.
- Actualiza si algo está desactualizado
- Si supera 5K tokens, mueve a /docs
- Prioriza info frecuente
- Actualiza "Sesión Actual" al terminar
-->
```

---

## ⌨️ Comandos Esenciales {#comandos-esenciales}

### Comandos de Gestión
```bash
/clear              # Reinicia sesión completamente
/compact            # Compacta contexto manteniendo esencial
/context            # Muestra uso actual del contexto
/cost               # Muestra estadísticas de tokens y costo
/model [opus/sonnet] # Cambia modelo
```

### Comandos de Productividad
```bash
/install-github-app  # Configura reviews automáticos de PRs
/terminal-setup      # Configura terminal (fix Shift+Enter)
/dangerously-skip-permissions  # Skip confirmaciones (usar con cuidado)
```

### Crear Comandos Personalizados
```bash
# En .claude/commands/refactor.md
---
name: refactor
description: Refactoriza código siguiendo best practices
---

Refactoriza el código seleccionado siguiendo:
1. SOLID principles
2. Clean Code practices  
3. Mantén types de TypeScript
4. Añade tests si no existen
5. Actualiza documentación
```

---

## ⚠️ Errores Comunes a Evitar {#errores-comunes}

### 1. ❌ Múltiples Instancias Paralelas
```bash
# MALO - Consume límites 3x más rápido
terminal1: claude "refactor auth"
terminal2: claude "update UI"  
terminal3: claude "fix tests"
```

### 2. ❌ Sesiones Largas sin Limpiar
```bash
# MALO - Acumula contexto innecesario
[100 mensajes en la misma sesión sobre temas diferentes]

# BUENO - Limpia entre tareas
claude "complete feature A"
/clear
claude "start feature B"
```

### 3. ❌ Usar Opus para Todo
```bash
# MALO - Desperdicia recursos caros
/model opus
"cambiar color del botón a azul"

# BUENO - Usa el modelo apropiado
/model sonnet
"cambiar color del botón a azul"
```

### 4. ❌ Re-subir Archivos
```bash
# MALO
"aquí está config.json" [upload]
...después...
"aquí está config.json otra vez" [upload]

# BUENO  
"usa el config.json que ya subí"
```

### 5. ❌ Prompts Fragmentados
```bash
# MALO - Genera múltiples interacciones
> "arregla el bug"
> "el de la línea 45"
> "en el archivo utils.js"
> "es un off-by-one"

# BUENO - Todo en un prompt
> "Fix off-by-one bug in utils.js line 45 that skips last array element"
```

---

## 🔄 Workflow Optimizado {#workflow-optimizado}

### Inicio de Sesión
```bash
# 1. Verifica reset time
claude /cost

# 2. Si es nueva feature, limpia
/clear

# 3. Planifica con Opus
/model opus
"Plan implementation for [feature]. Create step-by-step approach"

# 4. Cambia a Sonnet para implementar
/model sonnet
"Implement step 1: [specific task]"
```

### Durante el Desarrollo
```bash
# Cada 30-45 minutos
/context  # Verifica uso

# Si > 60% usado
/compact "focus on [current feature]"

# Si cambias de contexto
/clear
```

### Final de Sesión
```bash
# Actualiza CLAUDE.md
"Update CLAUDE.md session context with:
- Completed: [tasks]
- Current branch: [name]
- Next steps: [todos]"

# Guarda estado si cerca del límite
git add . && git commit -m "WIP: session limit approaching"
```

---

## 📊 Métricas y Monitoreo {#métricas-monitoreo}

### Dashboard de Uso
```bash
# Comando principal
/cost

# Output esperado
Total tokens: 245,000 (input: 200,000, output: 45,000)
Total cost: $3.55
Session duration: 2h 15m
Code changes: 450 lines added, 120 removed
Model usage: Opus 20%, Sonnet 80%
```

### Métricas Target

| Métrica | Objetivo | Alerta |
|---------|----------|--------|
| Tokens/hora | < 100k | > 150k |
| Cost/feature | < $5 | > $10 |
| Opus usage | < 25% | > 40% |
| Context usage | < 70% | > 85% |
| Sessions/día | 3-4 | > 6 |

### Script de Monitoreo
```bash
#!/bin/bash
# monitor-claude.sh

while true; do
  clear
  echo "=== Claude Code Monitor ==="
  claude /cost
  echo ""
  echo "Context Usage:"
  claude /context | grep "Usage:"
  echo ""
  echo "Next reset in: $(calculate_reset_time)"
  sleep 300  # Actualiza cada 5 minutos
done
```

---

## 🎓 Tips Avanzados {#tips-avanzados}

### 1. Sub-agentes para Tareas Complejas
```bash
"Use sub-agents to:
1. Agent A: Research best approach for [problem]
2. Agent B: Implement solution
3. Agent C: Write comprehensive tests
Coordinate results and provide unified solution"
```

### 2. Git Worktrees para Paralelización
```bash
# Setup para múltiples agentes
git worktree add ../project-agent1 feature/agent1
git worktree add ../project-agent2 feature/agent2

# Cada agente trabaja aislado
cd ../project-agent1 && claude "implement auth"
cd ../project-agent2 && claude "implement UI"
```

### 3. Templates de Proyectos
```bash
# .claude/templates/nextjs-project.md
PROJECT_TEMPLATE:
- Next.js 14 with App Router
- TypeScript strict
- Tailwind CSS
- Prisma ORM
- Jest + React Testing Library
- GitHub Actions CI/CD

CONVENTIONS:
- Feature-based structure
- Barrel exports
- Custom hooks for logic
- Server components default
```

### 4. Aliases Productivos
```bash
# ~/.zshrc o ~/.bashrc
alias cc="claude"
alias ccc="/clear && claude"
alias cco="claude --model opus"
alias ccs="claude --model sonnet"
alias ccost="claude /cost"
alias ccontext="claude /context"
```

### 5. Integración con VS Code
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude: Refactor Current File",
      "type": "shell",
      "command": "claude",
      "args": [
        "refactor ${file} following our conventions in CLAUDE.md"
      ]
    },
    {
      "label": "Claude: Generate Tests",
      "type": "shell",
      "command": "claude", 
      "args": [
        "generate comprehensive tests for ${file}"
      ]
    }
  ]
}
```

### 6. Automatización con Hooks
```bash
# .claude/hooks/pre-commit.sh
#!/bin/bash
# Auto-actualiza CLAUDE.md antes de cada commit

claude "Update CLAUDE.md with:
- Current branch: $(git branch --show-current)
- Changed files: $(git diff --name-only --cached)
- Update session context
Keep under 5000 tokens"
```

### 7. Estrategia de Caché Avanzada
```markdown
# Project Knowledge Structure
knowledge/
├── core/               # Siempre cacheado
│   ├── schemas.ts     # Types y interfaces
│   ├── constants.ts   # Configuración
│   └── utils.ts       # Helpers comunes
├── reference/         # Cache selectivo
│   ├── api-spec.yaml  # Cuando trabajas con API
│   └── db-schema.sql  # Cuando trabajas con DB
└── examples/          # Cache on-demand
    ├── patterns.md    # Patrones de código
    └── solutions.md   # Soluciones a problemas comunes
```

---

## 🚦 Quick Start Checklist

### Configuración Inicial
- [ ] Crear CLAUDE.md con template
- [ ] Configurar estructura de `/docs`
- [ ] Setup comandos personalizados en `.claude/commands/`
- [ ] Configurar git hooks si necesario
- [ ] Establecer aliases en terminal

### Cada Sesión
- [ ] Verificar tiempo hasta reset con `/cost`
- [ ] Limpiar contexto si nueva tarea con `/clear`
- [ ] Elegir modelo apropiado para la tarea
- [ ] Actualizar CLAUDE.md al finalizar

### Optimización Continua
- [ ] Revisar CLAUDE.md semanalmente
- [ ] Analizar métricas de uso
- [ ] Refinar comandos personalizados
- [ ] Ajustar workflows según patrones de uso

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
- [API Pricing](https://www.anthropic.com/pricing)
- [Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

### Comunidad
- [r/ClaudeAI](https://reddit.com/r/ClaudeAI) - Discusiones y tips
- [GitHub Issues](https://github.com/anthropics/claude-code/issues) - Problemas y soluciones

### Herramientas Complementarias
- **LiteLLM** - Tracking de costos para equipos
- **Portkey** - Gateway para múltiples LLMs
- **Claude-Flow** - Orquestación multi-agente

---

## 🎯 Resumen Ejecutivo

### Los 5 Mandamientos de Claude Code

1. **🧹 Limpia Obsesivamente** - `/clear` entre tareas, `/compact` cuando > 60%
2. **🎯 Sé Específico** - Prompts completos y precisos ahorran interacciones
3. **💎 Opus es Oro** - Úsalo solo para planificación, no para ejecución
4. **📦 Cachea Todo** - Projects knowledge = tokens gratis en reusos
5. **📊 Mide Siempre** - `/cost` es tu amigo, úsalo frecuentemente

### ROI Esperado

Con estas prácticas optimizadas deberías lograr:
- **50-70% reducción** en consumo de tokens
- **2-3x más productividad** por sesión de 5 horas
- **80% uso en Sonnet**, 20% en Opus
- **< $150/mes** costo promedio con Max 5x para desarrollo intensivo

---

*Documento creado para maximizar el valor de Claude Code con plan Max. Actualiza regularmente según evolucionen tus patrones de uso.*

**Versión**: 1.0  
**Última actualización**: Octubre 2025  
**Mantenido por**: [Tu equipo]

---

## 📝 Notas de Versión

### v1.0 - Octubre 2025
- Guía inicial completa
- Template CLAUDE.md optimizado
- Mejores prácticas validadas
- Estrategias de optimización de tokens
- Workflows y automatización

### Próximas Actualizaciones
- [ ] Integración con nuevos límites semanales (Agosto 2025)
- [ ] Scripts de automatización adicionales
- [ ] Métricas de equipo y colaboración
- [ ] Integración con CI/CD pipelines
