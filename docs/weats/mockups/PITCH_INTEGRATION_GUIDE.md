# 🎯 Guía de Integración al Pitch Deck

## 📊 Estructura Recomendada del Pitch

### Slide 1-3: Problema
**NO incluir mockups aquí**
- Muestra el problema actual del delivery en Colombia
- Stats: 65% abandona apps por complejidad, 45% prefiere WhatsApp

---

### Slide 4: Solución (Introducción Visual)
**Mockup:** Preview del header de WhatsApp

```
"Todo sucede en WhatsApp.
Cero apps. Cero fricción.
100% conversacional en español."
```

Inserta solo el header de `customer_ordering.txt`:
```
┌─────────────────────────────────────────┐
│ ← WPFoods                        🔍💬📞 │
└─────────────────────────────────────────┘
```

---

### Slide 5-7: Customer Journey (3 slides)

#### Slide 5: "Ordena en Lenguaje Natural"
**Mockup:** `customer_ordering.txt` (primeros 30 líneas)

**Bullet points al lado:**
- Query en español colombiano natural
- AI entiende presupuesto y preferencias
- 3 opciones personalizadas instantáneas
- Confirmación en 2 clicks

**Métrica destacada:**
> "3 minutos del pedido a confirmación"

---

#### Slide 6: "Tracking Proactivo Automático"
**Mockup:** `customer_tracking.txt` (primeras 25 líneas - status bar)

**Bullet points al lado:**
- 6 actualizaciones automáticas en 20 min
- Status visual con checkmarks progresivos
- Link de ubicación en vivo del domiciliario
- ETA dinámico actualizado en tiempo real

**Métrica destacada:**
> "0 preguntas del cliente. 100% proactividad."

---

#### Slide 7: "Engagement Post-Entrega"
**Mockup:** `customer_tracking.txt` (últimas 15 líneas - calificación)

**Bullet points al lado:**
- NPS integrado en la conversación
- Sistema de puntos gamificado
- Feedback inmediato para restaurantes
- Loop de mejora continua

**Métrica destacada:**
> "85% tasa de respuesta NPS (vs 12% email)"

---

### Slide 8-10: Restaurant Value Prop (2 slides)

#### Slide 8: "Gestión Sin Apps"
**Mockup:** `restaurant_order.txt` (completo lado izquierdo)

**Bullet points al lado:**
- Notificación push instantánea 🔔
- Info completa en un mensaje
- Workflow ultra-simple: SI → LISTO
- Timer de urgencia (60 seg)
- Pago automático semanal

**Métrica destacada:**
> "60 segundos promedio de aceptación"

---

#### Slide 9: "AI que Aumenta Ventas"
**Mockup:** `restaurant_analytics.txt` (sección de insights)

**Bullet points al lado:**
- Reporte EOD automático con métricas clave
- AI identifica patrones (hora pico, best sellers)
- Recomendaciones accionables de inventario
- Estrategias de precios dinámicos
- Proyección de impacto (+15-20%)

**Métrica destacada:**
> "Restaurantes con insights de AI venden 18% más"

---

### Slide 11-13: Worker Value Prop (2 slides)

#### Slide 11: "Asignación Inteligente"
**Mockup:** `worker_delivery.txt` (primeras 35 líneas - oferta + timer)

**Bullet points al lado:**
- Oferta con timer de 30 seg (urgency)
- Pago desglosado upfront (transparencia)
- Distancias calculadas automáticamente
- Navegación GPS integrada
- Workflow guiado paso a paso

**Métrica destacada:**
> "12 segundos promedio de aceptación"

---

#### Slide 12: "Transparencia Total de Pagos"
**Mockup:** `worker_payment.txt` (sección de breakdown)

**Bullet points al lado:**
- 7 líneas de desglose (cada peso explicado)
- 5 tipos de bonos desbloqueables
- Ranking gamificado vs otros workers
- Depósito bancario automático
- AI coaching personalizado

**Métrica destacada:**
> "$1.4M COP/semana promedio top performers"

---

### Slide 13: Network Effects (Diagrama)

**Layout:** 3 mockups conectados en triángulo

```
        [CUSTOMER]
       /          \
      /            \
     /              \
[RESTAURANT] ---- [WORKER]
```

**Bajo cada vértice:**
- Customer: "Más restaurantes = más variedad"
- Restaurant: "Más clientes = más ventas"
- Worker: "Más órdenes = más earnings"

**Caption central:**
> "Plataforma de 3 lados con network effects virales"

---

## 🎨 Tips de Diseño Visual

### Opción A: Screenshots Estáticos
1. Abre Terminal/VSCode
2. Cambia fuente a Monaco/Courier New (14pt)
3. Copia mockup y pega
4. Screenshot con fondo blanco
5. Crop a 450x800px
6. Inserta en slide con sombra sutil

**Ventaja:** Rápido y profesional

---

### Opción B: Video Animado (60 segundos)
Script recomendado:

**0-10s:** Customer ordering
- Texto aparece letra por letra
- Sonido de typing
- Notificación WhatsApp cuando llega respuesta bot

**10-20s:** Customer tracking
- Status bar se actualiza con animación
- Checkmarks aparecen progresivamente
- Sonido de notificación en cada update

**20-35s:** Restaurant order + analytics
- Split screen: orden arriba, analytics abajo
- Números aumentan animated (counter effect)
- Insight de AI aparece con highlight

**35-50s:** Worker delivery + payment
- Timer countdown visible (30... 29... 28...)
- Navegación GPS mock animation
- Breakdown de pago expande línea por línea

**50-60s:** Network effects diagram
- 3 mockups rotan hacia el centro
- Se conectan con líneas animadas
- Fade to logo + tagline

**Herramientas:**
- After Effects (pro)
- Keynote Magic Move (simple)
- Figma Smart Animate (intermedio)

---

### Opción C: Prototipo Interactivo Figma

**Frames necesarios:**
1. customer_ordering_1 (inicio)
2. customer_ordering_2 (opciones)
3. customer_ordering_3 (selección)
4. customer_ordering_4 (confirmación)
5. customer_tracking_1 (status)
6. etc...

**Interacciones:**
- Tap en "1" → Siguiente frame (confirmación)
- Tap en "SI" → Siguiente frame (orden confirmada)
- Auto-animate entre frames (300ms ease-out)

**Ventaja:** Deja que inversionistas exploren

---

## 📏 Especificaciones Técnicas

### Tamaños Recomendados

**Para PowerPoint/Keynote (1920x1080):**
- Mockup individual: 500x850px
- Mockup side-by-side: 400x700px cada uno
- Mockup full screen: 900x1200px centrado

**Para PDF impreso (A4):**
- Mockup individual: 600x1000px
- DPI: 300 mínimo
- Formato: PNG con fondo transparente

**Para video (1080p):**
- Mockup individual: 600x1000px
- Posición: centrado con 200px padding
- Codec: H.264, 30fps

---

## 🎭 Narrativa Recomendada

### Para Pitch Presencial (10 min)

**Min 0-2:** Problema
- No mockups, solo stats y pain points

**Min 2-5:** Solución - Customer
- Slide 5: "Imagina pedir pizza como le hablas a un amigo..."
- [Muestra `customer_ordering.txt`]
- "Eso es WPFoods. Lenguaje natural en WhatsApp."
- Slide 6: "Y tracking automático sin que preguntes..."
- [Muestra `customer_tracking.txt`]

**Min 5-7:** Value Prop - Restaurant
- Slide 8: "Para restaurantes, gestión ultra-simple..."
- [Muestra `restaurant_order.txt`]
- Slide 9: "Pero lo poderoso es el AI que aumenta ventas..."
- [Muestra `restaurant_analytics.txt` - DETENTE en insights]
- **Pausa:** "Estos insights no los tiene Rappi. No los tiene Uber Eats."

**Min 7-9:** Value Prop - Worker
- Slide 11: "Domiciliarios ganan más con mejor UX..."
- [Muestra `worker_delivery.txt` - enfatiza timer]
- Slide 12: "Transparencia total. Cada peso explicado."
- [Muestra `worker_payment.txt` - señala breakdown]

**Min 9-10:** Network Effects + Traction
- Slide 13: "3 stakeholders. Beneficio mutuo. Viral loop."
- [Cierra con métricas de traction]

---

### Para Pitch Virtual (Zoom/Meet)

**Screen Share Strategy:**

1. **Comparte solo la ventana de presentación** (no escritorio)
2. **Antes de cada mockup:**
   - "Les voy a mostrar EXACTAMENTE cómo se ve..."
   - Genera expectativa
3. **Durante mockup:**
   - **SILENCIO de 5 segundos** - deja que lean
   - Luego destaca 2-3 elementos clave
4. **Después de mockup:**
   - "¿Se imaginan ordenando así?" (engagement)

---

## 🎯 Key Messages por Mockup

### customer_ordering.txt
**Message:** "Cero fricción. Todo en lenguaje natural."

**Highlight visual:**
- Círculo rojo en "Quiero pizza para 2 personas bajo $40.000"
- Flecha apuntando a las 3 opciones
- Círculo en "1" y "SI" (solo 2 clicks)

**Stat callout:**
> "3 min del hambre a la confirmación"

---

### customer_tracking.txt
**Message:** "Proactividad 100%. El cliente nunca pregunta 'dónde está?'"

**Highlight visual:**
- Círculo en timestamps (6:22, 6:25, 6:35, 6:37)
- Highlight en "🔔 Actualización" (cada mensaje)
- Flecha en status bar (✅✅⏳⬜)

**Stat callout:**
> "6 updates en 20 min. 0 queries del cliente."

---

### restaurant_order.txt
**Message:** "Workflow ultra-simple. SI → LISTO. Eso es todo."

**Highlight visual:**
- Círculo en "SI" y "LISTO" (solo 2 palabras)
- Highlight en timer "60 segundos" (urgency)
- Box alrededor de instrucciones especiales

**Stat callout:**
> "60 seg promedio de aceptación"

---

### restaurant_analytics.txt
**Message:** "AI que genera revenue, no solo procesa pedidos."

**Highlight visual:**
- Box grande en sección "🤖 INSIGHT DE AI"
- Círculo en "+15-20%" (proyección)
- Highlight en recomendaciones específicas

**Stat callout:**
> "Restaurantes con AI insights venden 18% más"

---

### worker_delivery.txt
**Message:** "Transparencia + gamificación = mejor UX = más ganancias."

**Highlight visual:**
- Círculo en timer "30 SEGUNDOS"
- Box en desglose de pago (base + distancia)
- Highlight en bonos ($1.000 extra)

**Stat callout:**
> "Workers con bonos ganan 23% más"

---

### worker_payment.txt
**Message:** "Cada peso explicado. Depósito automático. Cero sorpresas."

**Highlight visual:**
- Box en "BREAKDOWN DE PAGOS" (7 líneas)
- Círculo en total "$1.449.200 COP"
- Highlight en insights de AI (tip accionable)

**Stat callout:**
> "$1.4M COP/semana top performers"

---

## 📱 Mockups Físicos (Opcional - High Impact)

### Para Pitch Presencial Premium

**Materiales:**
- Imprimir mockups en cartón foam board (50x80cm)
- Mounting en atril tipo easel
- Ubicar alrededor de la sala

**Layout sala:**
```
    [PROYECTOR]
        
[CUSTOMER]  [YOU]  [RESTAURANT]

              [WORKER]
```

**Ventaja:**
- Inversionistas pueden levantarse y ver de cerca
- Conversaciones espontáneas
- Experiencia inmersiva

---

## 🧪 A/B Testing en Pitch

### Variante A: Customer First
Orden: Customer → Restaurant → Worker

**Hipótesis:** Inversionistas B2C prefieren empezar con UX del usuario final

---

### Variante B: Restaurant First
Orden: Restaurant → Customer → Worker

**Hipótesis:** Inversionistas enterprise prefieren ver business model primero

---

### Variante C: Worker First
Orden: Worker → Customer → Restaurant

**Hipótesis:** Inversionistas sociales prefieren impacto en empleo

---

**Recomendación:** Investiga el perfil del inversionista antes. Default: Customer First.

---

## 🎬 Checklist Final Pre-Pitch

### Mockups
- [ ] Todos los 6 mockups exportados como PNG 300dpi
- [ ] Fondo transparente o blanco limpio
- [ ] Sin pixelación al hacer zoom 200%
- [ ] Emojis renderizados correctamente

### Slides
- [ ] Mockups centrados y alineados
- [ ] Key messages como bullets al lado
- [ ] Stats destacadas con color/tamaño
- [ ] Highlights visuales (círculos, flechas) sutiles
- [ ] Fuente monoespacio legible (min 12pt)

### Narrativa
- [ ] Script preparado para cada mockup
- [ ] Pausas de 5 seg para dejar leer
- [ ] 2-3 highlights por mockup (no más)
- [ ] Transiciones suaves entre stakeholders
- [ ] Cierre con network effects

### Tech
- [ ] Presentación probada en proyector/Zoom
- [ ] Backup en USB + cloud (Google Drive)
- [ ] Video demo renderizado (si aplica)
- [ ] Mockups impresos (si presencial)
- [ ] Links de tracking funcionales o disclaimers

---

**Éxitos con el pitch!** 🚀

Si necesitas ajustes o versiones alternativas de los mockups, editá los archivos `.txt` directamente (son plain text).
