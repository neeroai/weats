# WEATS: CUSTOMER FLOWS
## Complete Conversational Ordering Experience via WhatsApp

**Version:** 1.0
**Last Updated:** January 11, 2025
**Target:** Customers (50M WhatsApp users in Colombia)

---

## EXECUTIVE SUMMARY

Weats customers order food through **natural conversation** on WhatsApp - no app download, no rigid menus, no friction. The AI understands requests like "I want tacos for 2 people under $20" and handles the entire journey from discovery to delivery tracking.

**Key Metrics:**
- **Onboarding:** 30 seconds (vs. Rappi 5-10 minutes)
- **Ordering:** 30 seconds (vs. Rappi 5+ minutes)
- **Response Time:** <1 second (AI-powered)
- **Customer Satisfaction:** Target 90% (vs. Rappi 70%)

---

## CUSTOMER JOURNEY OVERVIEW

```
START → DISCOVERY → BROWSE → ORDER → CUSTOMIZE → PAYMENT → TRACK → DELIVERED → FEEDBACK
  ↓         ↓         ↓        ↓         ↓          ↓         ↓         ↓          ↓
 30s      10s       20s      15s       10s        20s       30min     5s         10s

TOTAL TIME TO ORDER: 30 seconds
TOTAL TIME TO DELIVERY: 30-45 minutes
```

---

## FLOW 1: ONBOARDING (FIRST-TIME USER)

### Trigger
Customer sends first message to Weats WhatsApp number

### Flow Diagram
```
User: "Hi" / "Hello" / "Hola"
         ↓
    [NEW USER DETECTED]
         ↓
    [AI GREETING]
         ↓
    [COLLECT INFO]
    • Name
    • Delivery address
    • Payment method
         ↓
    [ACCOUNT CREATED]
         ↓
    [READY TO ORDER]
```

### Message Exchange

**Message 1: User → Weats**
```
Customer: Hi
```

**Message 2: Weats → User (Welcome)**
```typescript
// AI-generated personalized greeting
const welcomeMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'text',
  text: {
    body: `👋 ¡Hola! Bienvenido a Weats

$0 tarifas de servicio. Precios justos. Entrega rápida.

Para empezar, necesito algunos datos:
1. ¿Cómo te llamas?
2. ¿Cuál es tu dirección de entrega?

Después podrás ordenar comida en 30 segundos 🚀`
  }
};
```

**Message 3: User → Weats (Provides info)**
```
Customer: Soy Juan Pérez, Calle 85 #15-30, Bogotá
```

**Message 4: Weats → User (Confirmation + First Order Prompt)**
```typescript
const confirmationMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: {
      text: `✅ Perfecto, Juan!

Tu cuenta está lista:
📍 Dirección: Calle 85 #15-30, Bogotá

¿Qué te gustaría ordenar hoy?

Puedes decirme:
• "Quiero pizza"
• "Tacos para 2 personas"
• "Comida saludable bajo $20"

O elige una opción:`
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'browse_restaurants',
            title: '🍽️ Ver restaurantes'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'popular_now',
            title: '🔥 Lo más popular'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'help',
            title: '❓ Ayuda'
          }
        }
      ]
    }
  }
};
```

### TypeScript Implementation

```typescript
// Onboarding handler
export class OnboardingHandler {
  async handleFirstContact(phoneNumber: string, message: string): Promise<void> {
    // Check if user exists
    const existingUser = await this.findUser(phoneNumber);

    if (existingUser) {
      await this.sendWelcomeBackMessage(phoneNumber, existingUser);
      return;
    }

    // New user onboarding
    await this.initiateOnboarding(phoneNumber);
  }

  async initiateOnboarding(phoneNumber: string): Promise<void> {
    // Create conversation
    const conversation = await supabase
      .from('conversations')
      .insert({
        phone_number: phoneNumber,
        status: 'onboarding',
        window_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .select()
      .single();

    // Send welcome message
    await this.sendMessage(phoneNumber, {
      type: 'text',
      text: {
        body: `👋 ¡Hola! Bienvenido a Weats

$0 tarifas de servicio. Precios justos. Entrega rápida.

Para empezar, necesito algunos datos:
1. ¿Cómo te llamas?
2. ¿Cuál es tu dirección de entrega?

Escribe tu nombre y dirección en un mensaje:`
      }
    });

    // Set state
    await this.setConversationState(conversation.id, {
      step: 'awaiting_user_info',
      started_at: new Date().toISOString(),
    });
  }

  async processUserInfo(phoneNumber: string, message: string): Promise<void> {
    // Extract info using AI
    const userInfo = await this.extractUserInfo(message);

    if (!userInfo.name || !userInfo.address) {
      await this.askForMissingInfo(phoneNumber, userInfo);
      return;
    }

    // Create user
    const user = await supabase
      .from('users')
      .insert({
        phone_number: phoneNumber,
        user_type: 'customer',
        name: userInfo.name,
        profile_data: {
          delivery_address: userInfo.address,
          onboarding_completed: true,
        },
      })
      .select()
      .single();

    // Send confirmation
    await this.sendOnboardingComplete(phoneNumber, user);

    // Track metric
    await this.trackEvent('onboarding_completed', {
      user_id: user.id,
      duration_seconds: this.getOnboardingDuration(),
    });
  }

  async extractUserInfo(message: string): Promise<UserInfo> {
    // Use Gemini to extract structured data
    const prompt = `Extract name and address from this message:
"${message}"

Return JSON: { "name": "...", "address": "..." }`;

    const response = await this.callGemini(prompt);
    return JSON.parse(response);
  }
}
```

---

## FLOW 2: FOOD DISCOVERY (BROWSE RESTAURANTS)

### Trigger
- User sends: "I want [food]"
- User presses "Ver restaurantes" button
- Proactive: "It's 7pm Friday, hungry?"

### Flow Diagram
```
User: "Quiero tacos"
         ↓
    [AI UNDERSTANDS INTENT]
         ↓
    [SEARCH RESTAURANTS]
    • Near user location
    • Matching cuisine
    • Open now
         ↓
    [SHOW CATALOG/LIST]
    • Top 3-10 results
    • Rating, price, ETA
         ↓
    [USER SELECTS RESTAURANT]
         ↓
    [SHOW MENU]
```

### Message Exchange (Conversational)

**Message 1: User → Weats**
```
Customer: Quiero tacos para 2 personas bajo $20
```

**Message 2: Weats → User (AI Understanding + Results)**
```typescript
// AI classifies intent and extracts parameters
const intent = {
  type: 'order_food',
  cuisine: 'tacos',
  servings: 2,
  budget: 20,
  urgency: 'normal',
};

// Search restaurants
const restaurants = await this.searchRestaurants({
  cuisine: 'mexican',
  location: user.delivery_address,
  openNow: true,
  priceRange: [0, 20],
});

// Send interactive list
const listMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'list',
    header: {
      type: 'text',
      text: '🌮 Tacos Cerca de Ti'
    },
    body: {
      text: `Encontré ${restaurants.length} opciones de tacos para 2 personas bajo $20:

Todas abiertas ahora y a menos de 3 km.`
    },
    footer: {
      text: 'Entrega en 25-35 min • $0 tarifas'
    },
    action: {
      button: 'Ver Opciones',
      sections: [
        {
          title: 'Top Recomendados',
          rows: restaurants.slice(0, 3).map(r => ({
            id: `restaurant_${r.id}`,
            title: `${r.name} ⭐${r.rating}`,
            description: `${r.specialty} • $${r.avg_price} • ${r.delivery_time} min`
          }))
        },
        {
          title: 'Más Opciones',
          rows: restaurants.slice(3, 10).map(r => ({
            id: `restaurant_${r.id}`,
            title: `${r.name} ⭐${r.rating}`,
            description: `${r.specialty} • $${r.avg_price} • ${r.delivery_time} min`
          }))
        }
      ]
    }
  }
};
```

**Alternative: Product Catalog (Visual Browsing)**
```typescript
// For rich visual experience
const catalogMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'product_list',
    header: {
      type: 'text',
      text: '🌮 Tacos Cerca de Ti'
    },
    body: {
      text: 'Desliza para ver restaurantes y menús'
    },
    action: {
      catalog_id: WEATS_CATALOG_ID,
      sections: [
        {
          title: 'Top Taquerías',
          product_items: restaurants.slice(0, 30).map(r => ({
            product_retailer_id: `restaurant_${r.id}`,
          }))
        }
      ]
    }
  }
};
```

### TypeScript Implementation

```typescript
// Discovery handler
export class DiscoveryHandler {
  async handleFoodSearch(
    userId: string,
    query: string
  ): Promise<RestaurantList> {
    // 1. Parse intent using AI
    const intent = await this.parseIntent(query);

    // 2. Get user location
    const user = await this.getUser(userId);
    const location = this.parseAddress(user.profile_data.delivery_address);

    // 3. Search restaurants
    const restaurants = await supabase
      .from('restaurants')
      .select(`
        id,
        name,
        category,
        rating,
        avg_prep_time_mins,
        location
      `)
      .eq('is_active', true)
      .ilike('category', `%${intent.cuisine}%`)
      .order('rating', { ascending: false })
      .limit(10);

    // 4. Calculate delivery times
    const enrichedRestaurants = await Promise.all(
      restaurants.data.map(async (r) => ({
        ...r,
        distance_km: this.calculateDistance(location, r.location),
        delivery_time_mins: r.avg_prep_time_mins + 15, // prep + delivery
        delivery_fee_cop: this.calculateDeliveryFee(distance),
        matches_budget: await this.checkBudget(r.id, intent.budget),
      }))
    );

    // 5. Filter by distance and budget
    const filtered = enrichedRestaurants.filter(
      r => r.distance_km <= 5 && r.matches_budget
    );

    // 6. Rank by relevance
    const ranked = this.rankRestaurants(filtered, intent);

    return ranked;
  }

  async parseIntent(query: string): Promise<FoodIntent> {
    const prompt = `Parse this food order request:
"${query}"

Extract:
1. Cuisine/dish type
2. Number of servings
3. Budget (USD)
4. Dietary restrictions
5. Urgency (now/later)

Return JSON.`;

    const response = await this.callGemini(prompt);
    return JSON.parse(response);
  }

  async sendRestaurantList(
    phoneNumber: string,
    restaurants: Restaurant[]
  ): Promise<void> {
    if (restaurants.length === 0) {
      await this.sendNoResultsMessage(phoneNumber);
      return;
    }

    // Use list for 4-10 options
    if (restaurants.length <= 10) {
      await this.sendInteractiveList(phoneNumber, restaurants);
      return;
    }

    // Use catalog for 10+ options
    await this.sendProductCatalog(phoneNumber, restaurants);
  }

  async sendInteractiveList(
    phoneNumber: string,
    restaurants: Restaurant[]
  ): Promise<void> {
    const message = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: this.getListHeader(restaurants),
        },
        body: {
          text: this.getListBody(restaurants),
        },
        footer: {
          text: '$0 tarifas de servicio • Entrega rápida',
        },
        action: {
          button: 'Ver Restaurantes',
          sections: this.buildListSections(restaurants),
        },
      },
    };

    await this.sendMessage(phoneNumber, message);
  }
}
```

---

## FLOW 3: MENU BROWSING & ITEM SELECTION

### Trigger
User selects restaurant from list/catalog

### Flow Diagram
```
User: [Selects "Taquería El Paisa"]
         ↓
    [LOAD MENU]
         ↓
    [SHOW CATEGORIES]
    • Tacos
    • Burritos
    • Drinks
         ↓
    [USER BROWSES]
         ↓
    [ADD TO CART]
```

### Message Exchange

**Message 1: User Selects Restaurant**
```
Customer: [Clicks "Taquería El Paisa ⭐4.8"]
```

**Message 2: Weats → User (Menu)**
```typescript
const menuMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'list',
    header: {
      type: 'text',
      text: '🌮 Taquería El Paisa'
    },
    body: {
      text: `⭐ 4.8 (230 reseñas)
🕒 25-30 min de entrega
💰 Precio promedio: $8-12 por persona

¿Qué te gustaría ordenar?`
    },
    footer: {
      text: 'Todos los precios incluyen IVA'
    },
    action: {
      button: 'Ver Menú',
      sections: [
        {
          title: '🌮 Tacos',
          rows: [
            {
              id: 'item_101',
              title: 'Taco al Pastor',
              description: '$4.500 • Cerdo marinado, piña, cilantro'
            },
            {
              id: 'item_102',
              title: 'Taco de Asada',
              description: '$5.000 • Carne asada, cebolla, guacamole'
            },
            {
              id: 'item_103',
              title: 'Taco Vegetariano',
              description: '$3.800 • Frijoles, queso, verduras'
            }
          ]
        },
        {
          title: '🌯 Burritos',
          rows: [
            {
              id: 'item_201',
              title: 'Burrito Mixto',
              description: '$12.000 • Carne, arroz, frijoles, queso'
            }
          ]
        },
        {
          title: '🥤 Bebidas',
          rows: [
            {
              id: 'item_301',
              title: 'Agua Fresca',
              description: '$2.500 • Jamaica o horchata'
            }
          ]
        }
      ]
    }
  }
};
```

**Message 3: User Adds Items**
```
Customer: [Clicks "Taco al Pastor"]
```

**Message 4: Weats → User (Customization)**
```typescript
const customizationMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: {
      text: `🌮 Taco al Pastor - $4.500

¿Cuántos tacos quieres?
¿Alguna personalización?

Opciones:
• Sin cebolla
• Extra picante 🌶️
• Sin cilantro

Escribe tu pedido o elige:`
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'add_1',
            title: '➕ Agregar 1'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'add_2',
            title: '➕ Agregar 2'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'add_3',
            title: '➕ Agregar 3'
          }
        }
      ]
    }
  }
};
```

### TypeScript Implementation

```typescript
// Menu handler
export class MenuHandler {
  async showRestaurantMenu(
    userId: string,
    restaurantId: string
  ): Promise<void> {
    // 1. Get restaurant details
    const restaurant = await this.getRestaurant(restaurantId);

    // 2. Get menu items
    const menuItems = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    // 3. Group by category
    const groupedMenu = this.groupByCategory(menuItems.data);

    // 4. Send interactive list
    await this.sendMenuList(userId, restaurant, groupedMenu);

    // 5. Initialize cart
    await this.initializeCart(userId, restaurantId);
  }

  async handleItemSelection(
    userId: string,
    itemId: string
  ): Promise<void> {
    // 1. Get item details
    const item = await this.getMenuItem(itemId);

    // 2. Check for customizations
    if (item.customizations && item.customizations.length > 0) {
      await this.showCustomizationOptions(userId, item);
      return;
    }

    // 3. Show quantity selector
    await this.showQuantitySelector(userId, item);
  }

  async addItemToCart(
    userId: string,
    itemId: string,
    quantity: number,
    customizations?: string[]
  ): Promise<void> {
    // 1. Get cart
    const cart = await this.getCart(userId);

    // 2. Add item
    cart.items.push({
      item_id: itemId,
      quantity,
      customizations,
      added_at: new Date().toISOString(),
    });

    // 3. Save cart
    await this.saveCart(cart);

    // 4. Send confirmation
    await this.sendItemAddedConfirmation(userId, itemId, quantity);

    // 5. Ask for more
    await this.askContinueShopping(userId);
  }

  async showCartSummary(userId: string): Promise<void> {
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      await this.sendEmptyCartMessage(userId);
      return;
    }

    // Calculate totals
    const subtotal = await this.calculateSubtotal(cart);
    const deliveryFee = await this.calculateDeliveryFee(cart);
    const total = subtotal + deliveryFee;

    // Send summary
    const summaryMessage = {
      messaging_product: 'whatsapp',
      to: userId,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: {
          type: 'text',
          text: '🛒 Tu Pedido'
        },
        body: {
          text: this.formatCartSummary(cart, subtotal, deliveryFee, total)
        },
        footer: {
          text: '$0 tarifas de servicio • Ahorra $6-8 vs Rappi'
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'checkout',
                title: '✅ Confirmar Pedido'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'add_more',
                title: '➕ Agregar Más'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'edit_cart',
                title: '✏️ Editar'
              }
            }
          ]
        }
      }
    };

    await this.sendMessage(userId, summaryMessage);
  }

  formatCartSummary(
    cart: Cart,
    subtotal: number,
    deliveryFee: number,
    total: number
  ): string {
    let summary = '';

    cart.items.forEach(item => {
      const menuItem = this.getMenuItem(item.item_id);
      summary += `${item.quantity}x ${menuItem.name}\n`;

      if (item.customizations && item.customizations.length > 0) {
        summary += `   → ${item.customizations.join(', ')}\n`;
      }

      summary += `   $${this.formatPrice(menuItem.price_cop * item.quantity)}\n\n`;
    });

    summary += `───────────────────\n`;
    summary += `Subtotal: $${this.formatPrice(subtotal)}\n`;
    summary += `Entrega: $${this.formatPrice(deliveryFee)}\n`;
    summary += `───────────────────\n`;
    summary += `Total: $${this.formatPrice(total)}`;

    return summary;
  }
}
```

---

## FLOW 4: CHECKOUT & PAYMENT

### Trigger
User clicks "Confirmar Pedido" from cart

### Flow Diagram
```
User: [Clicks "Confirmar Pedido"]
         ↓
    [REVIEW ORDER]
         ↓
    [WHATSAPP FLOW: CHECKOUT]
    • Confirm address
    • Add special instructions
    • Select payment method
    • Confirm total
         ↓
    [PROCESS PAYMENT]
         ↓
    [CREATE ORDER]
         ↓
    [NOTIFY RESTAURANT]
         ↓
    [ASSIGN WORKER]
         ↓
    [SEND CONFIRMATION]
```

### Message Exchange (WhatsApp Flow)

**Message 1: Launch Checkout Flow**
```typescript
const checkoutFlowMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'flow',
    header: {
      type: 'text',
      text: '🛒 Finalizar Pedido'
    },
    body: {
      text: `Total a pagar: $${total_cop.toLocaleString()}

Confirma tu información para completar el pedido.`
    },
    footer: {
      text: 'Pago seguro • $0 tarifas'
    },
    action: {
      name: 'flow',
      parameters: {
        flow_message_version: '3',
        flow_id: CHECKOUT_FLOW_ID,
        flow_cta: 'Continuar al Pago',
        flow_action: 'data_exchange',
        flow_token: `checkout_${orderId}`,
        flow_action_payload: {
          screen: 'REVIEW_ORDER',
          data: {
            order_items: cart.items,
            subtotal_cop: subtotal,
            delivery_fee_cop: deliveryFee,
            total_cop: total,
            delivery_address: user.profile_data.delivery_address,
            saved_payment_methods: user.payment_methods,
          }
        }
      }
    }
  }
};
```

**WhatsApp Flow Screens:**

1. **REVIEW_ORDER** - Order summary
2. **DELIVERY_DETAILS** - Address confirmation, special instructions
3. **PAYMENT_METHOD** - Select/add payment method
4. **CONFIRM** - Final confirmation

### WhatsApp Flow Implementation

```typescript
// Checkout flow endpoint
// POST /api/whatsapp/flow-endpoint/checkout

export async function POST(req: Request): Promise<Response> {
  // 1. Validate signature
  const isValid = await validateFlowSignature(req);
  if (!isValid) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body: FlowRequest = await req.json();

  // 2. Handle flow actions
  switch (body.action) {
    case 'INIT':
      return await this.initCheckoutFlow(body);

    case 'data_exchange':
      return await this.handleCheckoutStep(body);

    default:
      return new Response('Invalid action', { status: 400 });
  }
}

async function initCheckoutFlow(request: FlowRequest): Promise<Response> {
  // Load order data
  const orderId = request.flow_token.replace('checkout_', '');
  const order = await this.getOrder(orderId);

  return Response.json({
    version: '3.0',
    screen: 'REVIEW_ORDER',
    data: {
      items: order.items,
      subtotal: order.subtotal_cop,
      delivery_fee: order.delivery_fee_cop,
      total: order.total_cop,
      currency: 'COP',
    }
  });
}

async function handleCheckoutStep(request: FlowRequest): Promise<Response> {
  const screen = request.screen;
  const data = request.data;

  switch (screen) {
    case 'REVIEW_ORDER':
      // User reviewed order, move to delivery details
      return Response.json({
        version: '3.0',
        screen: 'DELIVERY_DETAILS',
        data: {
          current_address: data.delivery_address,
        }
      });

    case 'DELIVERY_DETAILS':
      // User confirmed address, move to payment
      const address = data.delivery_address;
      const instructions = data.special_instructions;

      // Save to order
      await this.updateOrder(data.order_id, {
        delivery_address: address,
        special_instructions: instructions,
      });

      return Response.json({
        version: '3.0',
        screen: 'PAYMENT_METHOD',
        data: {
          saved_methods: await this.getSavedPaymentMethods(data.user_id),
        }
      });

    case 'PAYMENT_METHOD':
      // User selected payment, show confirmation
      const paymentMethod = data.payment_method;

      return Response.json({
        version: '3.0',
        screen: 'CONFIRM',
        data: {
          payment_method: paymentMethod,
          total: data.total_cop,
        }
      });

    case 'CONFIRM':
      // User confirmed, process order
      const result = await this.processCheckout(data);

      if (!result.success) {
        return Response.json({
          version: '3.0',
          error_messages: [{
            field_id: 'payment',
            message: result.error_message,
          }]
        });
      }

      // Close flow, send confirmation message
      return Response.json({
        version: '3.0',
        data: {
          success: true,
          order_number: result.order_number,
        }
      });

    default:
      return new Response('Unknown screen', { status: 400 });
  }
}
```

### Alternative: Simple Button Checkout (No Flow)

```typescript
// For users without Flow support
async function simpleCheckout(userId: string, cart: Cart): Promise<void> {
  // 1. Confirm address
  await this.sendMessage(userId, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: `📍 Dirección de entrega:
${user.profile_data.delivery_address}

¿Es correcta?`
      },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'address_ok', title: '✅ Sí' }},
          { type: 'reply', reply: { id: 'change_address', title: '📝 Cambiar' }},
        ]
      }
    }
  });

  // 2. Special instructions (optional)
  await this.sendMessage(userId, {
    type: 'text',
    text: {
      body: '¿Alguna instrucción especial? (opcional)\n\nEjemplo: "Tocar el timbre 2 veces"'
    }
  });

  // 3. Payment method
  await this.sendMessage(userId, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: `💳 Método de pago:`
      },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'card', title: '💳 Tarjeta' }},
          { type: 'reply', reply: { id: 'cash', title: '💵 Efectivo' }},
          { type: 'reply', reply: { id: 'transfer', title: '🏦 Transferencia' }},
        ]
      }
    }
  });

  // 4. Final confirmation
  await this.sendMessage(userId, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: this.formatOrderSummary(cart)
      },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'confirm_order', title: '✅ Confirmar Pedido' }},
          { type: 'reply', reply: { id: 'cancel', title: '❌ Cancelar' }},
        ]
      }
    }
  });
}
```

### Payment Processing

```typescript
// Payment handler
export class PaymentHandler {
  async processPayment(
    orderId: string,
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> {
    const order = await this.getOrder(orderId);

    switch (paymentMethod.type) {
      case 'card':
        return await this.processCardPayment(order, paymentMethod);

      case 'cash':
        return await this.processCashPayment(order);

      case 'transfer':
        return await this.processTransferPayment(order);

      default:
        throw new Error('Unsupported payment method');
    }
  }

  async processCardPayment(
    order: Order,
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> {
    try {
      // 1. Create Stripe payment intent
      const intent = await stripe.paymentIntents.create({
        amount: order.total_cop * 100, // Convert to cents
        currency: 'cop',
        payment_method: paymentMethod.stripe_payment_method_id,
        confirmation_method: 'automatic',
        confirm: true,
        customer: order.customer_stripe_id,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
        },
      });

      // 2. Save payment record
      await supabase.from('payments').insert({
        order_id: order.id,
        amount_cop: order.total_cop,
        payment_method: 'card',
        status: intent.status,
        provider: 'stripe',
        provider_transaction_id: intent.id,
      });

      // 3. Update order
      if (intent.status === 'succeeded') {
        await this.confirmOrder(order.id);

        return {
          success: true,
          transaction_id: intent.id,
        };
      }

      return {
        success: false,
        error: 'Payment failed',
      };

    } catch (error) {
      console.error('[PAYMENT] Card payment failed', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async processCashPayment(order: Order): Promise<PaymentResult> {
    // 1. Save payment record (pending)
    await supabase.from('payments').insert({
      order_id: order.id,
      amount_cop: order.total_cop,
      payment_method: 'cash',
      status: 'pending',
    });

    // 2. Confirm order
    await this.confirmOrder(order.id);

    return {
      success: true,
      transaction_id: null,
    };
  }
}
```

---

## FLOW 5: ORDER TRACKING

### Trigger
- User sends: "Where is my order?"
- Proactive updates from system
- User clicks "Track Order" button

### Flow Diagram
```
Order Created
     ↓
Restaurant Confirmed (2-5 min)
     ↓
Preparing (10-20 min)
     ↓
Ready for Pickup (notification)
     ↓
Worker Assigned & En Route (5-10 min)
     ↓
Picked Up (notification)
     ↓
Delivering (10-20 min)
     ↓
Delivered (confirmation)
```

### Message Exchange (Proactive Updates)

**Status Update 1: Order Confirmed**
```typescript
const orderConfirmedMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'text',
  text: {
    body: `✅ Pedido Confirmado!

Pedido #${orderNumber}
Taquería El Paisa

Tu pedido está siendo preparado.
Tiempo estimado: 25-30 minutos

Puedes rastrear tu pedido en cualquier momento escribiendo "track" o "estado"`
  }
};

// Send reaction for quick feedback
await this.sendReaction(phoneNumber, lastMessageId, '✅');
```

**Status Update 2: Preparing**
```typescript
const preparingMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'text',
  text: {
    body: `👨‍🍳 Tu pedido está siendo preparado

Pedido #${orderNumber}
Estado: Preparando (5 min restantes)

Te avisamos cuando esté listo para recoger.`
  }
};
```

**Status Update 3: Ready for Pickup (Worker Assigned)**
```typescript
const readyMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: {
      text: `🚀 Tu pedido está listo!

Pedido #${orderNumber}
Repartidor asignado: ${worker.name}
⭐ Calificación: ${worker.rating}

${worker.name} está en camino al restaurante.
Llegará a tu puerta en ~15 minutos.`
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'track_live',
            title: '📍 Rastrear en Vivo'
          }
        }
      ]
    }
  }
};
```

**Status Update 4: Out for Delivery**
```typescript
const outForDeliveryMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'location',
  location: {
    latitude: worker.current_location.lat,
    longitude: worker.current_location.lng,
    name: `${worker.name} - En camino`,
    address: 'Rastreando en tiempo real'
  }
};

// Follow up with text
await this.sendMessage(phoneNumber, {
  type: 'text',
  text: {
    body: `🚴 ${worker.name} recogió tu pedido

Llegada estimada: ${eta}
Distancia: ${distance} km

Ubicación en vivo actualizada 👆`
  }
});
```

**Status Update 5: Nearby**
```typescript
const nearbyMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'text',
  text: {
    body: `📍 ${worker.name} está cerca!

A solo 2 minutos de tu puerta.
Prepárate para recibir tu pedido.

Pedido #${orderNumber}`
  }
};
```

**Status Update 6: Delivered**
```typescript
const deliveredMessage = {
  messaging_product: 'whatsapp',
  to: phoneNumber,
  type: 'interactive',
  interactive: {
    type: 'button',
    body: {
      text: `✅ Pedido Entregado!

Pedido #${orderNumber}
Entregado por: ${worker.name}
Total pagado: $${total_cop.toLocaleString()}

¡Que lo disfrutes! 🎉

¿Cómo estuvo tu experiencia?`
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'rate_excellent',
            title: '⭐⭐⭐⭐⭐ Excelente'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'rate_good',
            title: '⭐⭐⭐⭐ Bueno'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'rate_ok',
            title: '⭐⭐⭐ OK'
          }
        }
      ]
    }
  }
};
```

### TypeScript Implementation

```typescript
// Tracking handler
export class TrackingHandler {
  async handleTrackingRequest(userId: string): Promise<void> {
    // 1. Get active orders
    const orders = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(*),
        worker:workers(*)
      `)
      .eq('customer_id', userId)
      .in('status', ['confirmed', 'preparing', 'ready', 'picked_up'])
      .order('created_at', { ascending: false });

    if (orders.data.length === 0) {
      await this.sendNoActiveOrdersMessage(userId);
      return;
    }

    // 2. Show most recent order
    const order = orders.data[0];
    await this.sendOrderStatus(userId, order);
  }

  async sendOrderStatus(userId: string, order: Order): Promise<void> {
    const statusMessage = this.buildStatusMessage(order);

    await this.sendMessage(userId, statusMessage);

    // Send live location if out for delivery
    if (order.status === 'picked_up' && order.worker) {
      await this.sendWorkerLocation(userId, order.worker);
    }
  }

  buildStatusMessage(order: Order): WhatsAppMessage {
    const progress = this.getProgressBar(order.status);
    const eta = this.calculateETA(order);

    return {
      messaging_product: 'whatsapp',
      to: order.customer_id,
      type: 'text',
      text: {
        body: `📦 Estado de tu Pedido

Pedido #${order.order_number}
${order.restaurant.name}

${progress}

Estado actual: ${this.getStatusText(order.status)}
Tiempo estimado: ${eta}

${this.getNextStepText(order.status)}`
      }
    };
  }

  getProgressBar(status: OrderStatus): string {
    const steps = {
      confirmed: '✅▶️⏸️⏸️⏸️',
      preparing: '✅✅▶️⏸️⏸️',
      ready: '✅✅✅▶️⏸️',
      picked_up: '✅✅✅✅▶️',
      delivered: '✅✅✅✅✅',
    };

    return `
Confirmado → Preparando → Listo → En Camino → Entregado
${steps[status]}
    `.trim();
  }

  async sendWorkerLocation(
    userId: string,
    worker: Worker
  ): Promise<void> {
    // Update worker location (real-time from GPS)
    const location = await this.getWorkerLocation(worker.id);

    await this.sendMessage(userId, {
      type: 'location',
      location: {
        latitude: location.lat,
        longitude: location.lng,
        name: `${worker.name} - Repartidor`,
        address: 'En camino a tu dirección',
      }
    });

    // Calculate ETA
    const eta = await this.calculateDeliveryETA(
      location,
      order.delivery_location
    );

    await this.sendMessage(userId, {
      type: 'text',
      text: {
        body: `📍 Ubicación en tiempo real de ${worker.name}

Llegada estimada: ${eta} minutos
Distancia: ${distance} km

La ubicación se actualiza automáticamente.`
      }
    });
  }

  // Proactive status updates (triggered by state changes)
  async notifyOrderConfirmed(orderId: string): Promise<void> {
    const order = await this.getOrder(orderId);

    await this.sendMessage(order.customer_id, {
      type: 'text',
      text: {
        body: `✅ ¡Pedido Confirmado!

Pedido #${order.order_number}
${order.restaurant.name}

El restaurante está preparando tu pedido.
Tiempo estimado: ${order.estimated_delivery_mins} minutos

Te avisamos cuando esté listo.`
      }
    });

    // Send reaction
    await this.sendReaction(
      order.customer_id,
      order.last_message_id,
      '✅'
    );
  }

  async notifyWorkerAssigned(orderId: string): Promise<void> {
    const order = await this.getOrder(orderId);

    await this.sendMessage(order.customer_id, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: `🚴 Repartidor Asignado!

${order.worker.name}
⭐ ${order.worker.rating} (${order.worker.total_deliveries} entregas)

${order.worker.name} está recogiendo tu pedido.
Llegada estimada: ${this.calculateETA(order)}`
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'track_live',
                title: '📍 Rastrear'
              }
            }
          ]
        }
      }
    });
  }

  async notifyNearby(orderId: string): Promise<void> {
    const order = await this.getOrder(orderId);

    await this.sendMessage(order.customer_id, {
      type: 'text',
      text: {
        body: `📍 ${order.worker.name} está cerca!

A solo 2-3 minutos de tu puerta.
Pedido #${order.order_number}

Prepárate para recibir tu pedido 🎉`
      }
    });
  }

  async notifyDelivered(orderId: string): Promise<void> {
    const order = await this.getOrder(orderId);

    await this.sendMessage(order.customer_id, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: `✅ ¡Entregado!

Pedido #${order.order_number}
Entregado por: ${order.worker.name}

Total: $${order.total_cop.toLocaleString()}

¡Que lo disfrutes!

¿Cómo fue tu experiencia?`
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'rate_5',
                title: '⭐⭐⭐⭐⭐'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'rate_4',
                title: '⭐⭐⭐⭐'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'rate_3',
                title: '⭐⭐⭐'
              }
            }
          ]
        }
      }
    });

    // Mark conversation as completed
    await this.completeOrderConversation(order.id);
  }
}
```

---

## FLOW 6: CUSTOMER SUPPORT

### Common Support Queries

1. **Order Status** - "Where is my order?"
2. **Order Modification** - "Can I change my order?"
3. **Cancellation** - "I want to cancel"
4. **Payment Issues** - "My payment failed"
5. **Refund Request** - "I want a refund"
6. **Missing Items** - "My order is incomplete"
7. **Quality Issues** - "Food arrived cold"
8. **General Help** - "How does Weats work?"

### AI-Powered Support (90% Automated)

```typescript
// Support handler
export class SupportHandler {
  async handleSupportQuery(
    userId: string,
    query: string
  ): Promise<void> {
    // 1. Classify intent
    const intent = await this.classifyIntent(query);

    // 2. Route to appropriate handler
    switch (intent.type) {
      case 'order_status':
        await this.handleOrderStatusQuery(userId);
        break;

      case 'cancel_order':
        await this.handleCancellation(userId);
        break;

      case 'modify_order':
        await this.handleModification(userId, intent.details);
        break;

      case 'refund':
        await this.handleRefundRequest(userId, intent.reason);
        break;

      case 'missing_items':
        await this.handleMissingItems(userId, intent.items);
        break;

      case 'quality_issue':
        await this.handleQualityComplaint(userId, intent.issue);
        break;

      case 'general_help':
        await this.handleGeneralHelp(userId, query);
        break;

      default:
        // Escalate to human (10% of cases)
        await this.escalateToHuman(userId, query);
    }
  }

  async handleCancellation(userId: string): Promise<void> {
    // Get active order
    const order = await this.getActiveOrder(userId);

    if (!order) {
      await this.sendMessage(userId, {
        type: 'text',
        text: {
          body: 'No tienes pedidos activos para cancelar.'
        }
      });
      return;
    }

    // Check if cancellable
    if (order.status !== 'confirmed') {
      await this.sendMessage(userId, {
        type: 'text',
        text: {
          body: `❌ No podemos cancelar tu pedido

Pedido #${order.order_number}
Estado: ${this.getStatusText(order.status)}

El pedido ya está siendo preparado/entregado.
Si tienes un problema, escribe "ayuda" para hablar con soporte.`
        }
      });
      return;
    }

    // Confirm cancellation
    await this.sendMessage(userId, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: `¿Seguro que quieres cancelar?

Pedido #${order.order_number}
${order.restaurant.name}
Total: $${order.total_cop.toLocaleString()}

Si cancelas ahora, se reembolsará el 100%.`
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'confirm_cancel',
                title: '✅ Sí, Cancelar'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'keep_order',
                title: '❌ No, Mantener'
              }
            }
          ]
        }
      }
    });
  }

  async processCancellation(orderId: string): Promise<void> {
    // 1. Update order status
    await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: 'customer_request',
      })
      .eq('id', orderId);

    // 2. Process refund
    await this.processRefund(orderId);

    // 3. Notify restaurant
    await this.notifyRestaurantCancellation(orderId);

    // 4. Confirm to customer
    const order = await this.getOrder(orderId);

    await this.sendMessage(order.customer_id, {
      type: 'text',
      text: {
        body: `✅ Pedido Cancelado

Pedido #${order.order_number}
Reembolso: $${order.total_cop.toLocaleString()}

El reembolso llegará a tu método de pago en 3-5 días hábiles.

¿Algo que podamos mejorar? Escríbenos.`
      }
    });
  }

  async handleRefundRequest(
    userId: string,
    reason: string
  ): Promise<void> {
    const order = await this.getLastDeliveredOrder(userId);

    if (!order) {
      await this.sendMessage(userId, {
        type: 'text',
        text: {
          body: 'No encontramos pedidos recientes para reembolsar.'
        }
      });
      return;
    }

    // Auto-approve refund for quality issues (trust-first approach)
    if (this.isQualityIssue(reason)) {
      await this.processAutoRefund(order.id, reason);

      await this.sendMessage(userId, {
        type: 'text',
        text: {
          body: `✅ Reembolso Aprobado

Pedido #${order.order_number}
Motivo: ${reason}
Reembolso: $${order.total_cop.toLocaleString()}

Lamentamos lo ocurrido. El reembolso llegará en 3-5 días.

Tu satisfacción es importante para nosotros.`
        }
      });

      // Track for pattern detection (fraud prevention)
      await this.trackRefund(order.id, userId, reason);

      return;
    }

    // Manual review for other cases
    await this.escalateRefundRequest(userId, order.id, reason);
  }

  async handleGeneralHelp(userId: string, query: string): Promise<void> {
    // Generate AI response
    const response = await this.generateAIResponse(query, {
      context: 'customer_support',
      knowledge_base: WEATS_KB,
    });

    await this.sendMessage(userId, {
      type: 'text',
      text: {
        body: response
      }
    });

    // Offer human support
    await this.sendMessage(userId, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: '¿Te ayudó esta respuesta?'
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'helpful_yes',
                title: '✅ Sí'
              }
            },
            {
              type: 'reply',
              reply: {
                id: 'talk_human',
                title: '👤 Hablar con Persona'
              }
            }
          ]
        }
      }
    });
  }

  async escalateToHuman(userId: string, query: string): Promise<void> {
    // Create support ticket
    const ticket = await this.createSupportTicket(userId, query);

    await this.sendMessage(userId, {
      type: 'text',
      text: {
        body: `👤 Conectando con Soporte Humano

Ticket #${ticket.id}

Un miembro de nuestro equipo responderá en menos de 5 minutos.

Mientras tanto, ¿puedes darnos más detalles sobre tu problema?`
      }
    });

    // Notify support team
    await this.notifySupportTeam(ticket);

    // Set conversation state
    await this.setConversationState(userId, {
      status: 'awaiting_human_support',
      ticket_id: ticket.id,
    });
  }
}
```

---

## FLOW 7: PROACTIVE FEATURES

### 1. Reorder Favorites

```typescript
// Proactive reorder suggestions
export class ProactiveHandler {
  async sendReorderSuggestion(userId: string): Promise<void> {
    // Get user's favorite orders
    const favorites = await this.getUserFavoriteOrders(userId);

    if (favorites.length === 0) return;

    const favorite = favorites[0]; // Most ordered

    // Send at optimal time (e.g., Friday 7pm)
    const now = new Date();
    if (now.getDay() === 5 && now.getHours() === 19) {
      await this.sendMessage(userId, {
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: `👋 ¡Hola! Es viernes por la noche 🎉

¿Quieres tu pedido favorito de ${favorite.restaurant_name}?

${favorite.items.map(i => `• ${i.name}`).join('\n')}

Total: $${favorite.total_cop.toLocaleString()}
Entrega: ~30 min`
          },
          action: {
            buttons: [
              {
                type: 'reply',
                reply: {
                  id: 'reorder_favorite',
                  title: '✅ Sí, Ordenar'
                }
              },
              {
                type: 'reply',
                reply: {
                  id: 'browse_menu',
                  title: '🍽️ Ver Menú'
                }
              }
            ]
          }
        }
      });
    }
  }

  async handleReorderFavorite(userId: string): Promise<void> {
    const favorite = await this.getUserFavorite(userId);

    // Recreate cart
    const cart = await this.recreateCart(userId, favorite);

    // Skip menu browsing, go straight to checkout
    await this.showCartSummary(userId);
  }
}
```

### 2. Personalized Recommendations

```typescript
// AI-powered recommendations
export class RecommendationEngine {
  async generateRecommendations(userId: string): Promise<Restaurant[]> {
    // Get user history
    const history = await this.getOrderHistory(userId);

    // Get preferences
    const preferences = await this.getUserPreferences(userId);

    // Context-aware recommendations
    const context = {
      dayOfWeek: new Date().getDay(),
      timeOfDay: new Date().getHours(),
      weather: await this.getWeather(user.location),
      lastOrdered: history[0]?.created_at,
    };

    // AI recommendation
    const prompt = `Recommend restaurants for this user:

History: ${JSON.stringify(history)}
Preferences: ${JSON.stringify(preferences)}
Context: ${JSON.stringify(context)}

Return top 3 restaurants with reasoning.`;

    const response = await this.callGemini(prompt);

    return this.parseRecommendations(response);
  }

  async sendPersonalizedRecommendations(userId: string): Promise<void> {
    const recommendations = await this.generateRecommendations(userId);

    await this.sendMessage(userId, {
      type: 'interactive',
      interactive: {
        type: 'list',
        header: {
          type: 'text',
          text: '🎯 Recomendado Para Ti'
        },
        body: {
          text: 'Basado en tus preferencias y pedidos anteriores'
        },
        action: {
          button: 'Ver Recomendaciones',
          sections: [
            {
              title: 'Top Picks',
              rows: recommendations.map(r => ({
                id: `restaurant_${r.id}`,
                title: `${r.name} ⭐${r.rating}`,
                description: r.recommendation_reason,
              }))
            }
          ]
        }
      }
    });
  }
}
```

---

## KEY PERFORMANCE INDICATORS (KPIs)

### Customer Experience Metrics

```typescript
export const CUSTOMER_KPIS = {
  // Onboarding
  onboarding_time_target: 30,        // seconds
  onboarding_completion_rate: 0.95,  // 95%

  // Ordering
  order_time_target: 30,             // seconds
  order_completion_rate: 0.90,       // 90%

  // Response Time
  ai_response_time_p50: 1000,        // 1 second
  ai_response_time_p95: 3000,        // 3 seconds

  // Satisfaction
  nps_target: 70,                    // Net Promoter Score
  csat_target: 4.5,                  // Customer Satisfaction (1-5)

  // Retention
  retention_rate_month_1: 0.85,      // 85%
  retention_rate_month_6: 0.75,      // 75%

  // Engagement
  orders_per_month: 4,               // 4 orders/month
  reorder_rate: 0.70,                // 70% reorder

  // Support
  ai_resolution_rate: 0.90,          // 90% automated
  escalation_rate: 0.10,             // 10% to human
  resolution_time_target: 300,       // 5 minutes
};
```

---

## CONCLUSION

Weats customer experience delivers:

**Speed:**
- 30-second onboarding
- 30-second ordering
- <1 second AI responses

**Simplicity:**
- Natural conversation (no rigid menus)
- WhatsApp native (no app download)
- One-tap reorders

**Cost Savings:**
- $0 service fees
- 35-40% cheaper than Rappi
- $336/year saved (4 orders/month)

**Satisfaction:**
- 90% AI automation
- Proactive updates
- Trust-first support (auto-refunds)

This creates a **10x better ordering experience** than traditional app-based platforms.

---

**Related Documentation:**
- [WhatsApp Architecture](/docs/weats/technical/whatsapp-architecture.md)
- [Restaurant Flows](/docs/weats/technical/restaurant-flows.md)
- [AI Integration](/docs/weats/technical/ai-integration.md)

**Status:** ✅ Complete
**Last Updated:** January 11, 2025
**Version:** 1.0
