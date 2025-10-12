'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, BarChart3, Megaphone, Database, Clock } from 'lucide-react';

export default function Slide10_WhyRestaurantsSwitch() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Menor Comisión',
      impact: '5-10% vs 25-35%',
      value: '+20-25 puntos margen',
      color: '#10B981',
    },
    {
      icon: Zap,
      title: 'Herramientas IA Gratis',
      impact: 'Optimizador, pronósticos',
      value: '$200-500K/mes ahorrados',
      color: '#F59E0B',
    },
    {
      icon: Clock,
      title: 'Onboarding 30 Segundos',
      impact: 'Basado en WhatsApp',
      value: 'vs 2 semanas Rappi',
      color: '#3B82F6',
    },
    {
      icon: Database,
      title: 'Data Directa Clientes',
      impact: 'Propietario relaciones',
      value: 'Invaluable',
      color: '#8B5CF6',
    },
    {
      icon: Megaphone,
      title: 'Asistente Marketing',
      impact: 'Campañas con IA',
      value: '$150K/mes valor',
      color: '#EC4899',
    },
    {
      icon: BarChart3,
      title: 'Pronóstico Demanda',
      impact: 'Optimiza inventario',
      value: 'Reduce desperdicio 20-30%',
      color: '#14B8A6',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-8 py-16 pb-32 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">🍽️</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Por Qué los Restaurantes Cambiarían
          </h1>
          <p className="text-2xl text-gray-600">
            Quédate con 90-95% del ingreso vs 65-75% con Rappi
          </p>
        </motion.div>

        {/* Revenue Distribution Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Distribución de Ingresos: Orden de $30,000
            </h2>

            <div className="grid grid-cols-2 gap-8">
              {/* Rappi Column */}
              <div className="space-y-4">
                <div className="text-center font-bold text-lg text-gray-700 mb-4">
                  Rappi
                </div>

                {/* Restaurant Share */}
                <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
                  <div className="text-sm text-gray-700 mb-1">Restaurante:</div>
                  <div className="text-2xl font-black text-red-700">
                    $19.5K-22.5K
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    (65-75% neto)
                  </div>
                </div>

                {/* Platform Share */}
                <div className="bg-gray-200 rounded-lg p-4 border-2 border-gray-400">
                  <div className="text-sm text-gray-700 mb-1">Rappi:</div>
                  <div className="text-2xl font-black text-gray-800">
                    $7.5K-10.5K
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    (25-35% comisión)
                  </div>
                </div>
              </div>

              {/* WPFoods Column */}
              <div className="space-y-4">
                <div className="text-center font-bold text-lg text-green-700 mb-4">
                  WPFoods
                </div>

                {/* Restaurant Share */}
                <div className="bg-green-100 rounded-lg p-4 border-2 border-green-400">
                  <div className="text-sm text-gray-700 mb-1">Restaurante:</div>
                  <div className="text-2xl font-black text-green-700">
                    $27K-28.5K
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    (90-95% neto)
                  </div>
                </div>

                {/* Platform Share */}
                <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                  <div className="text-sm text-gray-700 mb-1">WPFoods:</div>
                  <div className="text-2xl font-black text-gray-700">
                    $1.5-3K
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    (5-10% comisión)
                  </div>
                </div>
              </div>
            </div>

            {/* Delta Highlight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 text-center bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-4 text-white"
            >
              <div className="text-xl font-bold">
                Restaurante se queda con{' '}
                <span className="text-yellow-300 text-2xl">18-27 puntos MÁS</span>{' '}
                de margen
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Valor Más Allá del Ahorro en Comisiones
          </h2>
          <p className="text-lg text-gray-600">
            Herramientas IA gratuitas + datos + marketing
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: `${benefit.color}20` }}
              >
                <benefit.icon
                  className="w-7 h-7"
                  style={{ color: benefit.color }}
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                {benefit.title}
              </h3>

              {/* Impact */}
              <div
                className="text-sm font-semibold text-center mb-2"
                style={{ color: benefit.color }}
              >
                {benefit.impact}
              </div>

              {/* Value */}
              <p className="text-xs text-gray-600 text-center font-medium">
                {benefit.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Economics Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Economía del Restaurante
                </div>
                <div className="text-white text-lg leading-relaxed">
                  Un restaurante facturando <strong>$100M/mes</strong> con Rappi paga{' '}
                  <strong>$25-35M</strong> en comisiones. Con WPFoods:{' '}
                  <strong>$5-10M</strong>. Eso es{' '}
                  <strong className="text-yellow-300 text-xl">
                    $15-25M/mes de vuelta en su bolsillo
                  </strong>{' '}
                  (<strong className="text-yellow-300">$180-300M/año</strong>)
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
