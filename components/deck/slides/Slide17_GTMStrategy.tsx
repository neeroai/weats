'use client';

import { motion } from 'framer-motion';
import PhaseTimeline, { Phase } from '../PhaseTimeline';

export default function Slide17_GTMStrategy() {
  const phases: Phase[] = [
    {
      number: 1,
      title: 'Cabeza de Playa',
      timeframe: 'Meses 1-6',
      objective: 'Bogotá Zona T + Chicó (Barrios acomodados)',
      metrics: [
        '50 restaurantes onboarded',
        '2,000 clientes adquiridos',
        '100 pedidos/día Mes 3',
        '200 pedidos/día Mes 6',
      ],
      color: '#10B981',
    },
    {
      number: 2,
      title: 'Expansión',
      timeframe: 'Meses 7-12',
      objective: '+5 Barrios Bogotá (Usaquén, Chapinero, Cedritos, etc.)',
      metrics: [
        '300 restaurantes total',
        '10,000 clientes',
        '600 pedidos/día',
        '$5M GMV Año 1',
      ],
      color: '#3B82F6',
    },
    {
      number: 3,
      title: 'Multi-Ciudad',
      timeframe: 'Año 2',
      objective: 'Medellín + Cali (25% del mercado nacional)',
      metrics: [
        '1,000 restaurantes en 3 ciudades',
        '50,000 clientes',
        '1,200 pedidos/día',
        '$30M GMV Año 2',
      ],
      color: '#8B5CF6',
    },
    {
      number: 4,
      title: 'Dominación Nacional',
      timeframe: 'Año 3+',
      objective: '10+ Ciudades, 15M Población',
      metrics: [
        '3,000+ restaurantes nacional',
        '200,000+ clientes',
        '5,000+ pedidos/día',
        '$100M GMV Año 3',
      ],
      color: '#EC4899',
    },
  ];

  const flywheelSteps = [
    'Cliente ahorra $7K/pedido',
    'Le cuenta a 3 amigos sobre ahorros',
    'Amigos prueban WPFoods (bono referido)',
    'Restaurante ve incremento volumen',
    'Restaurante promociona WPFoods a clientes',
    'Más clientes, más pedidos',
    'Más domiciliarios atraídos por alto pago',
    'Entregas más rápidas, mejor servicio',
    'REPETIR Y AMPLIFICAR 🔄',
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8 py-16 pb-32 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">🚀</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Estrategia Go-to-Market
          </h1>
          <p className="text-2xl text-gray-600">
            Playbook probado para escala ciudad por ciudad
          </p>
        </motion.div>

        {/* Phase Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Fases de Expansión
          </h2>
          <PhaseTimeline phases={phases} delay={0.5} />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Viral Flywheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
            Flywheel de Crecimiento
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Objetivo Coeficiente Viral: <strong>1.4</strong> (cada cliente trae 1.4 más)
          </p>

          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 shadow-2xl text-white">
            <div className="space-y-3">
              {flywheelSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1.9 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  {/* Step Number */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      index === flywheelSteps.length - 1
                        ? 'bg-yellow-400 text-purple-900'
                        : 'bg-white bg-opacity-20'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Step Text */}
                  <div className="flex-1 text-base leading-relaxed">
                    {step}
                  </div>

                  {/* Arrow (except for last step) */}
                  {index < flywheelSteps.length - 1 && (
                    <div className="text-xl opacity-60 flex-shrink-0">↓</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Marketing Mix Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.4 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Mix de Marketing (Año 1)
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                channel: 'Programa Referidos',
                budget: '$30K',
                cac: '$8',
                strategy: 'Da $5K, Recibe $5K',
                color: '#10B981',
              },
              {
                channel: 'Redes Sociales',
                budget: '$60K',
                cac: '$15',
                strategy: 'Facebook/Instagram targeting',
                color: '#3B82F6',
              },
              {
                channel: 'Influencers',
                budget: '$40K',
                cac: '$12',
                strategy: 'Bloggers comida, celebs',
                color: '#EC4899',
              },
              {
                channel: 'PR y Contenido',
                budget: '$20K',
                cac: '$5',
                strategy: 'Medios ganados, SEO',
                color: '#8B5CF6',
              },
              {
                channel: 'Co-Marketing',
                budget: '$10K',
                cac: '$3',
                strategy: 'Códigos QR, cross-promo',
                color: '#F59E0B',
              },
              {
                channel: 'Broadcasts WhatsApp',
                budget: '$5K',
                cac: '$1',
                strategy: 'Re-engagement campaigns',
                color: '#14B8A6',
              },
            ].map((item, index) => (
              <motion.div
                key={item.channel}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 2.6 + index * 0.05 }}
                className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div
                    className="font-bold text-xs"
                    style={{ color: item.color }}
                  >
                    {item.cac}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 text-center mb-2">
                  {item.channel}
                </h3>
                <div
                  className="text-xl font-black text-center mb-2"
                  style={{ color: item.color }}
                >
                  {item.budget}
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {item.strategy}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="inline-block bg-white rounded-lg px-6 py-3 shadow-lg border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Total Año 1</div>
              <div className="text-3xl font-black text-indigo-700">$165K</div>
              <div className="text-sm text-gray-600 mt-1">CAC Promedio: <strong>$12</strong></div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Insight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Insight GTM
                </div>
                <div className="text-white text-lg leading-relaxed">
                  No necesitamos presupuestos marketing masivos. Los ahorros hablan por sí mismos.
                  Objetivo <strong className="text-yellow-300">40% crecimiento orgánico</strong> vía
                  boca a boca para Año 2. Cada peso invertido en marketing genera{' '}
                  <strong className="text-yellow-300">LTV:CAC de 20:1</strong> para Año 3.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
