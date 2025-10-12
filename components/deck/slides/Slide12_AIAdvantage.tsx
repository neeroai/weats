'use client';

import { motion } from 'framer-motion';
import { Bot, Layers, Shield, TrendingDown } from 'lucide-react';

export default function Slide12_AIAdvantage() {
  const costRevolution = [
    {
      function: 'Soporte al Cliente',
      rappi: '$0.25-0.50/pedido',
      wpfoods: '$0.0003/pedido',
      reduction: '99.94%',
    },
    {
      function: 'Procesamiento Pedidos',
      rappi: 'Ruteo manual',
      wpfoods: 'Ruteo inteligente IA',
      reduction: '30-50% más rápido',
    },
    {
      function: 'Marketing',
      rappi: 'Equipos de personas',
      wpfoods: 'Campañas IA',
      reduction: '90% más barato',
    },
    {
      function: 'Gestión Menús',
      rappi: 'Actualizaciones manuales',
      wpfoods: 'Optimización IA',
      reduction: 'Gratis',
    },
    {
      function: 'Pronóstico Demanda',
      rappi: 'Analistas',
      wpfoods: 'Predicción IA',
      reduction: 'Tiempo real',
    },
  ];

  const techStack = [
    {
      layer: 'Capa 1',
      title: 'Gemini 2.5 Flash (tier GRATIS)',
      features: [
        'Pedidos conversacionales',
        'Procesamiento lenguaje natural',
        'Context caching (75% ahorro costo)',
        'Costo por pedido: $0.0003',
      ],
      color: '#F59E0B',
    },
    {
      layer: 'Capa 2',
      title: 'Algoritmo Ruteo Inteligente',
      features: [
        'Optimización tráfico tiempo real',
        'Agrupación múltiples pedidos',
        'ETAs predictivos',
        'Reducción 30-50% tiempo entrega',
      ],
      color: '#3B82F6',
    },
    {
      layer: 'Capa 3',
      title: 'Inteligencia Predictiva',
      features: [
        'Aprendizaje preferencias usuario',
        'Pronóstico demanda',
        'Precios dinámicos',
        'Predicción churn',
      ],
      color: '#8B5CF6',
    },
    {
      layer: 'Capa 4',
      title: 'API WhatsApp Business',
      features: [
        'Manejo mensajes',
        'Integración pagos',
        'Sistema notificaciones',
        'Automatización soporte',
      ],
      color: '#10B981',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 py-16 pb-32 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">🤖</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            El Arma Secreta: Arquitectura IA Total
          </h1>
          <p className="text-2xl text-gray-600 mb-2">
            Arquitectura IA-first con supervisión humana
          </p>
          <p className="text-lg text-gray-500 italic">
            vs plataformas tradicionales = operaciones con humanos + app frontend
          </p>
        </motion.div>

        {/* Cost Revolution Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              La Revolución de Costos
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="grid grid-cols-4 bg-gradient-to-r from-blue-50 to-purple-100 border-b border-gray-200">
                <div className="px-4 py-3 font-semibold text-gray-900 text-sm">
                  Función
                </div>
                <div className="px-4 py-3 font-semibold text-gray-700 text-sm text-center">
                  Rappi (Con Humanos)
                </div>
                <div className="px-4 py-3 font-semibold text-blue-700 text-sm text-center">
                  WPFoods (Con IA)
                </div>
                <div className="px-4 py-3 font-semibold text-green-700 text-sm text-center">
                  Reducción Costo
                </div>
              </div>

              {costRevolution.map((row, index) => (
                <motion.div
                  key={row.function}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="grid grid-cols-4 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="px-4 py-3 font-medium text-gray-700 text-sm">
                    {row.function}
                  </div>
                  <div className="px-4 py-3 text-center text-gray-600 text-sm">
                    {row.rappi}
                  </div>
                  <div className="px-4 py-3 text-center text-blue-700 font-medium text-sm">
                    {row.wpfoods}
                  </div>
                  <div className="px-4 py-3 text-center text-green-700 font-bold text-sm">
                    {row.reduction}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-5xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Tech Stack Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Arquitectura Técnica
          </h2>
          <p className="text-lg text-gray-600">
            Stack de IA WPFoods en 4 capas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {techStack.map((stack, index) => (
            <motion.div
              key={stack.layer}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            >
              {/* Layer Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="px-3 py-1 rounded-full text-white font-bold text-sm"
                  style={{ backgroundColor: stack.color }}
                >
                  {stack.layer}
                </div>
                <Layers className="w-5 h-5" style={{ color: stack.color }} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {stack.title}
              </h3>

              {/* Features */}
              <ul className="space-y-2">
                {stack.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: stack.color }}
                    ></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* AI Moat Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  El Foso de IA: Por Qué Rappi No Puede Copiar Esto
                </h2>
                <p className="text-gray-700 text-lg">
                  Rappi necesitaría <strong>$50-100M</strong> y{' '}
                  <strong>24-36 meses</strong> para:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                'Reconstruir arquitectura desde cero',
                'Reentrenar todo el equipo operacional',
                'Migrar millones de usuarios',
                'Combatir resistencia interna',
                'Mantener sistemas duales',
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white rounded-lg p-3 shadow"
                >
                  <span className="text-red-600 font-bold">{index + 1}.</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-3 text-gray-900">
                Desventaja Estructural:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span>
                    Costo IA Rappi: <strong className="text-red-600">$0.50/pedido</strong>{' '}
                    (tier pago, sin optimización)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-600" />
                  <span>
                    Costo IA WPFoods:{' '}
                    <strong className="text-green-600">$0.0003/pedido</strong> (166x más
                    barato)
                  </span>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-gray-700">
                    Rappi no puede bajar tarifas sin destruir modelo de negocio.{' '}
                    <strong>Somos rentables mientras trasladamos ahorros a stakeholders.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Trap Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">La Trampa</div>
                <div className="text-white text-lg leading-relaxed">
                  Si Rappi baja comisiones para competir, se vuelve{' '}
                  <strong className="text-red-300">no rentable</strong> (actualmente apenas
                  rentable). Si mantiene comisiones altas, pierde{' '}
                  <strong className="text-red-300">clientes</strong>.{' '}
                  <strong className="text-yellow-300 text-xl">
                    Ganamos de cualquier forma.
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
