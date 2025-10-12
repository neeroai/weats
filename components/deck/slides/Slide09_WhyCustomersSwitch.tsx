'use client';

import { motion } from 'framer-motion';
import { Zap, Smartphone, Brain, MessageCircle } from 'lucide-react';
import ComparisonTable from '../ComparisonTable';

export default function Slide09_WhyCustomersSwitch() {
  const comparisonData = [
    {
      feature: 'Tarifa de Servicio',
      wpfoods: 0,
      rappi: 5000,
      savings: '15-20%',
    },
    {
      feature: 'Costo de Envío',
      wpfoods: 800,
      rappi: 6000,
      savings: '$1,000-$9,000',
    },
    {
      feature: 'Total por Pedido',
      wpfoods: 19000,
      rappi: 27000,
      savings: '$6-8K (35-40%)',
      highlight: true,
    },
  ];

  const experienceAdvantages = [
    {
      icon: Zap,
      title: '10x Más Rápido',
      description: '30 segundos vs 5-10 minutos',
      detail: 'Conversación natural en WhatsApp vs navegación UI compleja',
      color: '#FCD34D',
    },
    {
      icon: Smartphone,
      title: 'Cero Fricción',
      description: 'Ya tienen WhatsApp',
      detail: 'Sin app nueva que aprender, funciona en cualquier celular',
      color: '#60A5FA',
    },
    {
      icon: Brain,
      title: 'IA Predictiva',
      description: 'Aprende tus preferencias',
      detail: '"Son las 7pm viernes, ¿quieres tu pedido usual?"',
      color: '#A78BFA',
    },
    {
      icon: MessageCircle,
      title: 'Soporte Real-Time',
      description: 'IA responde en <30s',
      detail: '90% de problemas resueltos sin humano',
      color: '#34D399',
    },
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
            <div className="text-6xl">💚</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Por Qué los Clientes Cambiarían
          </h1>
          <p className="text-2xl text-gray-600">
            35-40% más económico + 10x mejor experiencia
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <ComparisonTable
            title="La Economía del Cliente"
            rows={comparisonData}
            delay={0.3}
          />
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Experience Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Más Allá del Precio: La Ventaja de Experiencia
          </h2>
          <p className="text-lg text-gray-600">
            No solo ahorras dinero, ahorras tiempo y frustración
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {experienceAdvantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: `${advantage.color}30` }}
              >
                <advantage.icon
                  className="w-7 h-7"
                  style={{ color: advantage.color }}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                {advantage.title}
              </h3>

              {/* Description */}
              <div
                className="text-2xl font-black text-center mb-2"
                style={{ color: advantage.color }}
              >
                {advantage.description}
              </div>

              {/* Detail */}
              <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                {advantage.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Insight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Economía del Cliente
                </div>
                <div className="text-white text-lg leading-relaxed">
                  Cliente promedio pide <strong>2.6x/mes</strong>. A{' '}
                  <strong>$7K ahorro por pedido</strong>, eso es{' '}
                  <strong className="text-yellow-300">$218K/año ahorrados</strong> ={' '}
                  <strong className="text-yellow-300">motor masivo de retención</strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
