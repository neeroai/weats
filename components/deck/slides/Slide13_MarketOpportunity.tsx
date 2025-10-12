'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, MapPin, Zap } from 'lucide-react';

export default function Slide13_MarketOpportunity() {
  const marketShare = [
    { player: 'Rappi', share: 64, gmv: '$2.03B', color: '#EF4444' },
    { player: 'DiDi Food', share: 18, gmv: '$570M', color: '#F59E0B' },
    { player: 'Uber Eats', share: 12, gmv: '$380M', color: '#10B981' },
    { player: 'Otros', share: 6, gmv: '$190M', color: '#9CA3AF' },
  ];

  const growthProjection = [
    {
      year: 'Año 1',
      cities: '1 (Bogotá)',
      users: '10,000',
      ordersPerDay: '200',
      gmv: '$5M',
      marketShare: '0.4%',
    },
    {
      year: 'Año 2',
      cities: '2 (Bogotá+)',
      users: '50,000',
      ordersPerDay: '1,200',
      gmv: '$30M',
      marketShare: '0.9%',
    },
    {
      year: 'Año 3',
      cities: '5 (3 ciudades mayores)',
      users: '200,000',
      ordersPerDay: '5,000',
      gmv: '$100M',
      marketShare: '3.2%',
      highlight: true,
    },
    {
      year: 'Año 5',
      cities: '10+ ciudades',
      users: '1,000,000',
      ordersPerDay: '27,000',
      gmv: '$500M',
      marketShare: '11.2%',
      highlight: true,
    },
  ];

  const captureReasons = [
    {
      icon: TrendingUp,
      title: 'Economía Unitaria 10x Mejor',
      description: 'Crecimiento sostenible sin quemar capital',
      color: '#10B981',
    },
    {
      icon: Target,
      title: 'Ventaja WhatsApp',
      description: 'Sin barrera de adopción, escala instantánea',
      color: '#3B82F6',
    },
    {
      icon: Zap,
      title: 'Foso de IA',
      description: 'Imposible para incumbentes replicar rápido',
      color: '#F59E0B',
    },
    {
      icon: MapPin,
      title: 'Todos Ganan',
      description: 'Viralidad construida en el modelo',
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 py-16 pb-32 overflow-y-auto">
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
            Oportunidad de Mercado
          </h1>
          <p className="text-2xl text-gray-600">
            $3.17B TAM en Colombia, creciendo 12% CAGR
          </p>
        </motion.div>

        {/* TAM Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Mercado Total Direccionable (TAM)
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-black mb-2">$3.17B</div>
                <div className="text-sm opacity-90">GMV Actual (2024)</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2">12%</div>
                <div className="text-sm opacity-90">CAGR</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2">$4.45B</div>
                <div className="text-sm opacity-90">Proyección 2027</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black mb-2">35M</div>
                <div className="text-sm opacity-90">Usuarios smartphone</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current Market Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Market Share Hoy
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {marketShare.map((player, index) => (
                <motion.div
                  key={player.player}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${player.color}20` }}
                  >
                    <div
                      className="text-3xl font-black"
                      style={{ color: player.color }}
                    >
                      {player.share}%
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">{player.player}</div>
                  <div className="text-sm text-gray-600">{player.gmv}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <strong>Rappi domina 64%</strong> - vulnerable a disrupción por mejor economía
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="max-w-5xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Growth Projection Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
              Mercado Obtenible Servible (SOM)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-purple-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                      Año
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 text-sm">
                      Ciudades
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900 text-sm">
                      Usuarios Activos
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900 text-sm">
                      Pedidos/Día
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900 text-sm">
                      GMV
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-900 text-sm">
                      Market Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {growthProjection.map((row, index) => (
                    <motion.tr
                      key={row.year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.5 + index * 0.1 }}
                      className={`border-b border-gray-100 last:border-b-0 ${
                        row.highlight
                          ? 'bg-indigo-50 font-bold'
                          : 'bg-white hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">
                        {row.year}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{row.cities}</td>
                      <td className="px-4 py-3 text-center text-gray-900 text-sm">
                        {row.users}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-900 text-sm">
                        {row.ordersPerDay}
                      </td>
                      <td className="px-4 py-3 text-center text-indigo-700 font-semibold text-sm">
                        {row.gmv}
                      </td>
                      <td className="px-4 py-3 text-center text-green-700 font-bold text-sm">
                        {row.marketShare}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Why We Can Capture This */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Por Qué Podemos Capturar Esto
          </h2>
          <p className="text-lg text-gray-600">
            Ventajas estructurales que permiten crecimiento sostenible
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {captureReasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.1 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: `${reason.color}20` }}
              >
                <reason.icon className="w-7 h-7" style={{ color: reason.color }} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                {reason.title}
              </h3>

              <p className="text-sm text-gray-600 text-center leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Capital Efficiency Advantage
                </div>
                <div className="text-white text-lg leading-relaxed">
                  Generamos <strong className="text-yellow-300">$13.33 GMV por dólar levantado</strong> vs $1.29 de Rappi.
                  Nuestra eficiencia de capital es <strong className="text-yellow-300">10x mejor</strong> que incumbentes,
                  permitiendo crecimiento sostenible sin quemar capital.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
