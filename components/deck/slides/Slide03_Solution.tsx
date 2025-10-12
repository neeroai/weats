'use client';

import { motion } from 'framer-motion';
import { Check, TrendingUp, Heart } from 'lucide-react';

export default function Slide03_Solution() {
  const solutions = [
    {
      stakeholder: 'Clientes',
      before: '40% más caro',
      after: '$0 tarifas',
      icon: Check,
      color: '#10B981',
      savings: 'Ahorro $6-8 por pedido',
    },
    {
      stakeholder: 'Restaurantes',
      before: '25-35% comisiones',
      after: '5-10% comisiones',
      icon: TrendingUp,
      color: '#3B82F6',
      savings: 'Se quedan con 92-95% del ingreso',
    },
    {
      stakeholder: 'Domiciliarios',
      before: 'Por debajo del salario mínimo',
      after: '2-3x ingresos',
      icon: Heart,
      color: '#8B5CF6',
      savings: '$2.46M/mes vs $600K',
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-black text-center text-gray-900 mb-4"
        >
          WhatsAppFoods: Delivery Justo para Todos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl text-center text-gray-600 mb-16"
        >
          10x mejor para un actor, 2x mejor para todos
        </motion.p>

        <div className="space-y-6 mb-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.stakeholder}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            >
              <div className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${solution.color}20` }}
                  >
                    <solution.icon className="w-6 h-6" style={{ color: solution.color }} />
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {solution.stakeholder}
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  <div className="text-sm text-gray-500 mb-1">Antes (Rappi)</div>
                  <div className="text-xl font-semibold text-red-600 line-through">
                    {solution.before}
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="text-3xl text-gray-400">→</div>
                </div>
                <div className="col-span-3 text-center">
                  <div className="text-sm text-gray-500 mb-1">Después (WPFoods)</div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: solution.color }}
                  >
                    {solution.after}
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-sm font-medium text-gray-600">{solution.savings}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-2xl p-8 text-white text-center shadow-2xl"
        >
          <div className="text-4xl font-black mb-3">
            Impulsado por IA + WhatsApp = 91% menores costos
          </div>
          <div className="text-xl opacity-90">
            Modelo ganar-ganar-ganar, no explotación suma cero
          </div>
        </motion.div>
      </div>
    </div>
  );
}
