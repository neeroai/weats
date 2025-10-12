'use client';

import { motion } from 'framer-motion';
import { Shield, Users, DollarSign, Award } from 'lucide-react';

export default function Slide11_WhyWorkersSwitch() {
  const incomeComparison = [
    {
      metric: 'Pago por Entrega',
      wpfoods: '$3,500-$6,000',
      rappi: '$1,800-$3,700',
      improvement: '+50-100%',
    },
    {
      metric: 'Reembolso Gasolina',
      wpfoods: '30% + fondo mantenimiento',
      rappi: '0%',
      improvement: 'Beneficio nuevo',
    },
    {
      metric: 'Pedidos Mensuales',
      wpfoods: '~800 pedidos',
      rappi: '~800 pedidos',
      improvement: 'Mismo volumen',
    },
    {
      metric: 'Ingreso Bruto',
      wpfoods: '$2.8M-4.8M',
      rappi: '$1.44M-2.96M',
      improvement: '+$1.36-1.84M',
    },
    {
      metric: 'Costos Gasolina',
      wpfoods: '-$600K (reembolso 30%)',
      rappi: '-$900K',
      improvement: '-$300K ahorro',
    },
    {
      metric: 'Ingreso Neto',
      wpfoods: '$2.2M-4.2M',
      rappi: '$540K-2.06M',
      improvement: '+2-3x',
      highlight: true,
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Ingreso Predecible',
      description: 'Mínimo garantizado',
      details: 'Ruteo inteligente, bonos pico, estructura transparente',
      color: '#10B981',
    },
    {
      icon: Shield,
      title: 'Beneficios y Apoyo',
      description: 'Fondo mantenimiento',
      details: '30% reembolso gasolina, comunidad WhatsApp, seguro',
      color: '#3B82F6',
    },
    {
      icon: Users,
      title: 'Dignidad y Respeto',
      description: 'Tratados como socios',
      details: 'Voz en decisiones, resolución justa, eventos comunidad',
      color: '#8B5CF6',
    },
    {
      icon: Award,
      title: '4.4x Salario Mínimo',
      description: '$2,650K/mes neto',
      details: 'vs $600K en Rappi, vida digna para familias',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 py-16 pb-32 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">🛵</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Por Qué los Domiciliarios Cambiarían
          </h1>
          <p className="text-2xl text-gray-600">
            Triple el ingreso, mitad del estrés
          </p>
        </motion.div>

        {/* Income Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Comparación de Ingresos Mensuales
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-gradient-to-r from-purple-50 to-blue-100 border-b border-gray-200">
                <div className="px-4 py-3 font-semibold text-gray-900 text-sm">
                  Métrica
                </div>
                <div className="px-4 py-3 font-semibold text-purple-700 text-sm text-center">
                  WPFoods
                </div>
                <div className="px-4 py-3 font-semibold text-gray-700 text-sm text-center">
                  Rappi
                </div>
                <div className="px-4 py-3 font-semibold text-purple-700 text-sm text-center">
                  Mejora
                </div>
              </div>

              {/* Table Rows */}
              {incomeComparison.map((row, index) => (
                <motion.div
                  key={row.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className={`grid grid-cols-4 border-b border-gray-100 last:border-b-0 ${
                    row.highlight ? 'bg-purple-50' : 'bg-white hover:bg-gray-50'
                  } transition-colors`}
                >
                  <div
                    className={`px-4 py-3 font-medium text-sm ${
                      row.highlight ? 'text-gray-900 font-bold' : 'text-gray-700'
                    }`}
                  >
                    {row.metric}
                  </div>
                  <div
                    className={`px-4 py-3 text-center text-sm ${
                      row.highlight ? 'font-bold text-purple-700' : 'text-gray-900'
                    }`}
                  >
                    {row.wpfoods}
                  </div>
                  <div className="px-4 py-3 text-center text-gray-600 text-sm">
                    {row.rappi}
                  </div>
                  <div
                    className={`px-4 py-3 text-center font-semibold text-sm ${
                      row.highlight ? 'text-purple-700 text-base' : 'text-purple-600'
                    }`}
                  >
                    {row.improvement}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Math Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-center">
              Las Matemáticas Que Cambian Vidas
            </h3>

            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span>800 entregas × $4,500 prom</span>
                <span className="font-bold">$3,600K bruto</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>- Gasolina (30% reembolso):</span>
                <span>-$600K</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>- Mantenimiento (fondo):</span>
                <span>-$300K</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>- Celular/datos:</span>
                <span>-$50K</span>
              </div>
              <div className="border-t-2 border-white pt-3 mt-3 flex justify-between text-xl font-bold">
                <span>NETO:</span>
                <span className="text-green-400">$2,650K/mes</span>
              </div>
              <div className="text-center mt-4 text-gray-400 text-xs">
                vs $600K en Rappi
              </div>
              <div className="text-center mt-2">
                <span className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold">
                  = 4.4x MEJOR que salario mínimo
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Más Allá del Pago: La Experiencia
          </h2>
          <p className="text-lg text-gray-600">
            Tratamos a los domiciliarios como socios, no como contratistas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
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

              {/* Description */}
              <div
                className="text-sm font-semibold text-center mb-2"
                style={{ color: benefit.color }}
              >
                {benefit.description}
              </div>

              {/* Details */}
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                {benefit.details}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Retention Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Retención de Domiciliarios
                </div>
                <div className="text-white text-lg leading-relaxed">
                  Domiciliarios felices = mejor servicio = clientes felices. Rappi tiene{' '}
                  <strong className="text-red-300">80% rotación anual</strong>. Nuestro
                  modelo apunta a{' '}
                  <strong className="text-yellow-300">&lt;20% retención</strong>.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
