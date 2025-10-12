// WhatsApp conversation flows for mockups

export interface Message {
  sender: 'customer' | 'wpfoods';
  message: string;
  timestamp: string;
  buttons?: { id: string; title: string }[];
  listItems?: { id: string; title: string; description: string }[];
  location?: { name: string; address: string };
}

export const onboardingFlow: Message[] = [
  {
    sender: 'customer',
    message: 'Hi',
    timestamp: '6:15 PM',
  },
  {
    sender: 'wpfoods',
    message: `👋 ¡Hola! Bienvenido a WPFoods

$0 tarifas de servicio. Precios justos. Entrega rápida.

Para empezar, necesito algunos datos:
1. ¿Cómo te llamas?
2. ¿Cuál es tu dirección de entrega?`,
    timestamp: '6:15 PM',
  },
  {
    sender: 'customer',
    message: 'Soy Juan Pérez, Calle 85 #15-30, Bogotá',
    timestamp: '6:16 PM',
  },
  {
    sender: 'wpfoods',
    message: `✅ Perfecto, Juan!

Tu cuenta está lista:
📍 Dirección: Calle 85 #15-30

¿Qué te gustaría ordenar hoy?`,
    timestamp: '6:16 PM',
    buttons: [
      { id: 'browse', title: '🍽️ Ver restaurantes' },
      { id: 'popular', title: '🔥 Lo más popular' },
      { id: 'help', title: '❓ Ayuda' },
    ],
  },
];

export const orderingFlow: Message[] = [
  {
    sender: 'customer',
    message: 'Quiero tacos para 2 personas bajo $20',
    timestamp: '7:15 PM',
  },
  {
    sender: 'wpfoods',
    message: `🌮 Encontré 3 opciones cerca de ti:

Todas abiertas ahora y a menos de 3 km.`,
    timestamp: '7:15 PM',
    listItems: [
      {
        id: 'taqueria-paisa',
        title: 'Taquería El Paisa ⭐4.8',
        description: 'Tacos al pastor • $18 • 25 min',
      },
      {
        id: 'tacos-don-juan',
        title: 'Tacos Don Juan ⭐4.5',
        description: 'Tacos mixtos • $17 • 20 min',
      },
      {
        id: 'la-taqueria',
        title: 'La Taquería ⭐4.9',
        description: 'Tacos de asada • $19 • 30 min',
      },
    ],
  },
  {
    sender: 'customer',
    message: '[Selecciona: Taquería El Paisa]',
    timestamp: '7:16 PM',
  },
  {
    sender: 'wpfoods',
    message: `✅ Confirmando pedido de Taquería El Paisa

2x Tacos al Pastor - $18.00
Entrega: $0.80
─────────────
Total: $18.80

¿Confirmar?`,
    timestamp: '7:16 PM',
    buttons: [
      { id: 'confirm', title: 'SÍ' },
      { id: 'cancel', title: 'NO' },
    ],
  },
  {
    sender: 'customer',
    message: 'SÍ',
    timestamp: '7:16 PM',
  },
  {
    sender: 'wpfoods',
    message: `✅ Pedido confirmado!

Pedido #1234
Taquería El Paisa
ETA: 6:45pm (25 min)

Track: Reply "TRACK" anytime`,
    timestamp: '7:16 PM',
  },
];

export const menuBrowsingFlow: Message[] = [
  {
    sender: 'wpfoods',
    message: `🌮 Taquería El Paisa
⭐ 4.8 (230 reseñas)
🕒 25-30 min
💰 $8-12 por persona

¿Qué te gustaría ordenar?`,
    timestamp: '7:20 PM',
    listItems: [
      {
        id: 'taco-pastor',
        title: 'Taco al Pastor',
        description: '$4,500 • Cerdo marinado, piña, cilantro',
      },
      {
        id: 'taco-asada',
        title: 'Taco de Asada',
        description: '$5,000 • Carne asada, cebolla, guacamole',
      },
      {
        id: 'taco-veg',
        title: 'Taco Vegetariano',
        description: '$3,800 • Frijoles, queso, verduras',
      },
      {
        id: 'burrito',
        title: 'Burrito Mixto',
        description: '$12,000 • Carne, arroz, frijoles, queso',
      },
      {
        id: 'agua',
        title: 'Agua Fresca',
        description: '$2,500 • Jamaica o horchata',
      },
    ],
  },
];

export const trackingFlow: Message[] = [
  {
    sender: 'customer',
    message: 'TRACK',
    timestamp: '7:30 PM',
  },
  {
    sender: 'wpfoods',
    message: `📦 Estado de tu Pedido

Pedido #1234
Taquería El Paisa

✅ Confirmado
✅ Preparando
✅ Listo
✅ En Camino ← ahora
⏸️ Entregado

🚴 Carlos M. está en camino
ETA: 5 minutos
Distancia: 1.2 km`,
    timestamp: '7:30 PM',
    buttons: [
      { id: 'location', title: '📍 Ver ubicación en vivo' },
    ],
    location: {
      name: 'Carlos M. - En camino',
      address: 'Calle 80 #12-45',
    },
  },
];

export const comparisonData = {
  timeToOrder: {
    wpfoods: '30 seconds',
    rappi: '5+ minutes',
    advantage: '10x faster',
  },
  onboarding: {
    wpfoods: '30 seconds',
    rappi: '5-10 minutes',
    advantage: '10-20x faster',
  },
};
