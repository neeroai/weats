'use client';

import { motion } from 'framer-motion';
import RevenueProjection, { YearProjection } from '../RevenueProjection';
import BreakdownChart, { BreakdownItem } from '../BreakdownChart';

export default function Slide16_Financials() {
  const projections: YearProjection[] = [
    {
      year: 1,
      users: '10,000',
      ordersPerDay: '200',
      gmvAnnual: '$2.2B',
      revenue: '$202K',
      costs: '$1.1M',
      netIncome: '-$1.08M',
      margin: '-535% ❌',
      profitable: false,
    },
    {
      year: 2,
      users: '50,000',
      ordersPerDay: '1,200',
      gmvAnnual: '$13B',
      revenue: '$1.5M',
      costs: '$2.2M',
      netIncome: '-$700K',
      margin: '-47% ❌',
      profitable: false,
    },
    {
      year: 3,
      users: '200,000',
      ordersPerDay: '5,000',
      gmvAnnual: '$54B',
      revenue: '$6.2M',
      costs: '$3.7M',
      netIncome: '+$2.5M',
      margin: '40% ✅',
      profitable: true,
    },
    {
      year: 4,
      users: '500,000',
      ordersPerDay: '13,500',
      gmvAnnual: '$146B',
      revenue: '$16.8M',
      costs: '$10.2M',
      netIncome: '+$6.6M',
      margin: '39% ✅',
      profitable: true,
    },
    {
      year: 5,
      users: '1,000,000',
      ordersPerDay: '27,000',
      gmvAnnual: '$292B',
      revenue: '$33.6M',
      costs: '$23.5M',
      netIncome: '+$10.1M',
      margin: '30% ✅',
      profitable: true,
    },
  ];

  const revenueBreakdown: BreakdownItem[] = [
    {
      category: 'Comisiones Restaurante',
      percentage: 70,
      amount: '$4.34M',
      description: '5-10% del GMV',
      color: '#10B981',
    },
    {
      category: 'Tarifas Delivery',
      percentage: 25,
      amount: '$1.55M',
      description: '$800-1,000 por pedido',
      color: '#3B82F6',
    },
    {
      category: 'Publicidad y Data',
      percentage: 5,
      amount: '$310K',
      description: 'Ubicaciones premium, analítica',
      color: '#8B5CF6',
    },
  ];

  const costBreakdown: BreakdownItem[] = [
    {
      category: 'Pagos Domiciliarios',
      percentage: 55,
      amount: '$2.04M',
      description: '$4,000 prom por entrega',
      color: '#EF4444',
    },
    {
      category: 'Tecnología e IA',
      percentage: 15,
      amount: '$555K',
      description: 'Infraestructura, costos API',
      color: '#F59E0B',
    },
    {
      category: 'Marketing y CAC',
      percentage: 15,
      amount: '$555K',
      description: 'Adquisición clientes',
      color: '#EC4899',
    },
    {
      category: 'Operaciones',
      percentage: 10,
      amount: '$370K',
      description: 'Soporte, admin',
      color: '#6366F1',
    },
    {
      category: 'Procesamiento Pagos',
      percentage: 5,
      amount: '$185K',
      description: '2% comisiones transacción',
      color: '#14B8A6',
    },
  ];

  const keyMetrics = [
    {
      metric: 'CAC',
      year1: '$25',
      year2: '$18',
      year3: '$12',
      year5: '$8',
    },
    {
      metric: 'LTV',
      year1: '$120',
      year2: '$180',
      year3: '$240',
      year5: '$360',
    },
    {
      metric: 'LTV:CAC',
      year1: '4.8:1',
      year2: '10:1',
      year3: '20:1',
      year5: '45:1 ✅',
    },
    {
      metric: 'Recuperación',
      year1: '2.5 meses',
      year2: '1.8 meses',
      year3: '1.2 meses',
      year5: '0.8 meses',
    },
    {
      metric: 'Churn',
      year1: '25%',
      year2: '18%',
      year3: '12%',
      year5: '8%',
    },
    {
      metric: 'Pedidos/Usuario',
      year1: '2.0/mes',
      year2: '2.4/mes',
      year3: '2.8/mes',
      year5: '3.2/mes',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-y-auto p-8 py-16 pb-32">
      <div className="max-w-7xl w-full space-y-12 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">📊</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Proyecciones Financieras
          </h1>
          <p className="text-2xl text-gray-600">
            Rentabilidad Año 3 con $500K seed
          </p>
        </motion.div>

        {/* 5-Year Financial Projection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Modelo Financiero 5 Años
          </h2>
          <RevenueProjection projections={projections} delay={0.5} />
          <p className="text-sm md:text-base text-gray-600 text-center mt-3">
            *Montos en COP excepto GMV en equivalente USD
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Breakdown Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Desglose Año 3 (RENTABILIDAD)
          </h2>
          <p className="text-lg text-gray-600">
            200K clientes, 5,000 pedidos/día
          </p>
        </motion.div>

        {/* Revenue and Cost Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <BreakdownChart
            title="Ingreso Anual"
            subtitle="Fuentes de ingreso"
            total="$6.2M"
            items={revenueBreakdown}
            delay={1.4}
          />
          <BreakdownChart
            title="Costos Anuales"
            subtitle="Distribución de gastos"
            total="$3.7M"
            items={costBreakdown}
            delay={1.6}
          />
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Key Metrics Evolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Evolución Métricas Clave
          </h2>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-gradient-to-r from-purple-50 to-indigo-100 border-b border-gray-200">
              <div className="px-4 py-3 font-semibold text-gray-900 text-base">
                Métrica
              </div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-base text-center">
                Año 1
              </div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-base text-center">
                Año 2
              </div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-base text-center">
                Año 3
              </div>
              <div className="px-4 py-3 font-semibold text-gray-900 text-base text-center">
                Año 5
              </div>
            </div>

            {/* Table Rows */}
            {keyMetrics.map((row, index) => (
              <motion.div
                key={row.metric}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 2.2 + index * 0.05 }}
                className="grid grid-cols-5 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="px-4 py-3 font-semibold text-gray-900 text-base">
                  {row.metric}
                </div>
                <div className="px-4 py-3 text-center text-gray-700 text-base">
                  {row.year1}
                </div>
                <div className="px-4 py-3 text-center text-gray-700 text-base">
                  {row.year2}
                </div>
                <div className="px-4 py-3 text-center text-indigo-700 font-semibold text-base">
                  {row.year3}
                </div>
                <div className="px-4 py-3 text-center text-green-700 font-bold text-base">
                  {row.year5}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Path to Unicorn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 shadow-2xl text-white">
            <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
              <span>Camino a Estatus Unicornio</span>
              <span className="text-3xl">🦄</span>
            </h2>

            <div className="space-y-4 font-mono text-base">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-black text-lg">
                  5
                </div>
                <div>
                  <div className="font-bold">Año 5: $292M GMV, 1M usuarios Colombia</div>
                </div>
              </div>

              <div className="ml-6 pl-6 border-l-2 border-white border-opacity-30 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-black">
                    7
                  </div>
                  <div>
                    <div className="font-bold">Año 7: Expandir a 5 países LatAm</div>
                    <div className="text-base opacity-90">México, Chile, Perú, Argentina, Ecuador</div>
                    <div className="text-base opacity-90">TAM: $15B mercado combinado</div>
                    <div className="text-base opacity-90">Objetivo: $2B GMV (13% share)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-black text-purple-900">
                    10
                  </div>
                  <div>
                    <div className="font-bold text-yellow-300">Año 10: Líder Regional</div>
                    <div className="text-base opacity-90">10M+ usuarios a través LatAm</div>
                    <div className="text-base opacity-90">$10B GMV anualmente</div>
                    <div className="text-base opacity-90">$1.2B ingreso (12% take rate)</div>
                    <div className="text-base opacity-90">$350M ingreso neto (29% margen)</div>
                    <div className="text-lg font-black text-yellow-300 mt-1">
                      Valoración: $3-5B (9-14x ingreso) 🦄
                    </div>
                  </div>
                </div>
              </div>
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
                  Ventaja Inversionista
                </div>
                <div className="text-white text-lg leading-relaxed">
                  Entregamos eficiencia de capital{' '}
                  <strong className="text-yellow-300">10-40x mejor</strong> que incumbentes.
                  Tu dólar va <strong className="text-yellow-300">más lejos</strong> con
                  arquitectura nativa IA. <strong>$500K seed → Rentabilidad Año 3 → $150-600M valoración Año 5.</strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
