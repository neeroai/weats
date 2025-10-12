'use client';

import { motion } from 'framer-motion';
import { Rocket, Target, TrendingUp } from 'lucide-react';
import MetricsGrid, { MetricCategory } from '../MetricsGrid';

export default function Slide18_Traction() {
  const currentStatus = [
    { item: 'Arquitectura tecnológica diseñada', status: 'done' },
    { item: 'Sistema pedidos IA construido y testeado', status: 'done' },
    { item: 'Integración API WhatsApp Business completa', status: 'done' },
    { item: 'Economía unitaria validada', status: 'done' },
    { item: 'Investor deck y modelo financiero completo', status: 'done' },
    { item: 'Primeros 20 restaurantes en pipeline', status: 'inProgress' },
    { item: 'Campaña reclutamiento domiciliarios planeada', status: 'inProgress' },
    { item: 'Financiación seed para lanzar', status: 'pending' },
  ];

  const milestones6Months = [
    { month: '1', milestone: 'Lanzamiento Plataforma', target: 'Zona T, Bogotá', success: '10 restaurantes live' },
    { month: '2', milestone: 'Primeros 500 Pedidos', target: '50 pedidos/día', success: '4.5/5 rating prom' },
    { month: '3', milestone: 'Escalar a 100/día', target: '25 restaurantes, 15 domiciliarios', success: '<30min entrega' },
    { month: '4', milestone: 'Expandir Chicó', target: '+25 restaurantes', success: '150 pedidos/día' },
    { month: '5', milestone: 'Llegar a 200/día', target: '1,500 clientes activos', success: '65% retención Mes 2' },
    { month: '6', milestone: 'Validar Economía', target: 'Rentabilidad unitaria', success: '$3.5K utilidad/pedido' },
  ];

  const kpiCategories: MetricCategory[] = [
    {
      title: 'Product-Market Fit',
      color: '#10B981',
      metrics: [
        'NPS > 60 (Rappi está ~30)',
        'Tasa Retención Mes 6 > 60%',
        'Coeficiente Viral > 1.2',
        'Rating Promedio > 4.5/5',
        'Recuperación CAC < 3 meses',
      ],
    },
    {
      title: 'Señales Crecimiento',
      color: '#3B82F6',
      metrics: [
        '20% crecimiento MoM usuarios',
        'Pedidos/usuario incrementando',
        'Crecimiento orgánico > 30%',
        'Lista espera restaurantes > 50',
        'Aplicaciones domiciliarios > slots',
      ],
    },
    {
      title: 'Señales Económicas',
      color: '#F59E0B',
      metrics: [
        'Margen contribución > 30%',
        'LTV:CAC > 5:1',
        'Burn rate declinando MoM',
        'Camino a rentabilidad visible',
        'Unit economics validadas',
      ],
    },
  ];

  const serieAProofPoints = [
    {
      category: 'Tracción',
      icon: TrendingUp,
      points: [
        '25,000+ clientes activos',
        '150+ restaurantes live',
        '800+ pedidos/día',
        '$10M+ GMV run rate',
      ],
      color: '#10B981',
    },
    {
      category: 'Economía',
      icon: Target,
      points: [
        'Economía unitaria rentable',
        '34%+ margen contribución',
        'LTV:CAC > 10:1',
        'Recuperación CAC < 2 meses',
      ],
      color: '#3B82F6',
    },
    {
      category: 'Producto',
      icon: Rocket,
      points: [
        '4.7+ rating app',
        'NPS > 70',
        '80%+ retención Mes 6',
        '15+ features IA live',
      ],
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8 py-16 pb-32 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">📈</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Tracción y Milestones
          </h1>
          <p className="text-2xl text-gray-600">
            Fase Pre-Lanzamiento → Product-Market Fit → Serie A
          </p>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Estado Actual: Fase Pre-Lanzamiento
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStatus.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  {item.status === 'done' && (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-lg">✅</span>
                    </div>
                  )}
                  {item.status === 'inProgress' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">🔄</span>
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 text-lg">⏳</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{item.item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 6-Month Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Milestones 6 Meses (Post-Financiación)
          </h2>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-gradient-to-r from-purple-50 to-pink-100 border-b border-gray-200">
              <div className="px-4 py-3 font-semibold text-gray-900 text-sm">Mes</div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-sm">Milestone</div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-sm">Objetivo</div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-sm">Métrica Éxito</div>
            </div>

            {/* Table Rows */}
            {milestones6Months.map((row, index) => (
              <motion.div
                key={row.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + index * 0.05 }}
                className="grid grid-cols-4 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="px-4 py-3 font-bold text-purple-700 text-sm">{row.month}</div>
                <div className="px-4 py-3 text-gray-900 font-semibold text-sm">{row.milestone}</div>
                <div className="px-4 py-3 text-gray-700 text-sm">{row.target}</div>
                <div className="px-4 py-3 text-green-700 font-semibold text-sm">{row.success}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Indicadores Clave de Rendimiento (KPIs)
          </h2>
          <MetricsGrid categories={kpiCategories} delay={1.9} />
        </motion.div>

        {/* Serie A Proof Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900">
            Proof Points que Tendremos en Serie A
          </h2>
          <p className="text-center text-gray-600 mb-6">(18 meses desde ahora)</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {serieAProofPoints.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2.5 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <category.icon className="w-7 h-7" style={{ color: category.color }} />
                </div>

                <h3
                  className="text-lg font-bold text-center mb-4"
                  style={{ color: category.color }}
                >
                  {category.category}
                </h3>

                <ul className="space-y-2">
                  {category.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Insight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Estrategia Milestones
                </div>
                <div className="text-white text-lg leading-relaxed">
                  No estamos adivinando. Cada objetivo está basado en benchmarks marketplace
                  early-stage comparables (DoorDash, Rappi, Uber Eats early days){' '}
                  <strong className="text-yellow-300">ajustados por nuestra economía unitaria superior</strong>.
                  Camino claro a <strong className="text-yellow-300">Serie A en 18 meses</strong> con
                  métricas validadas.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
