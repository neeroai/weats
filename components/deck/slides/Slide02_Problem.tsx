'use client';

import { motion } from 'framer-motion';
import { TrendingDown, AlertCircle, Frown } from 'lucide-react';

export default function Slide02_Problem() {
  const problems = [
    {
      title: 'Clientes',
      icon: Frown,
      stat: '40% más caro',
      detail: 'Pagan $42 por comida de $30',
      color: '#EF4444',
    },
    {
      title: 'Restaurantes',
      icon: TrendingDown,
      stat: '25-35% comisiones',
      detail: 'Delivery no rentable',
      color: '#F59E0B',
    },
    {
      title: 'Domiciliarios',
      icon: AlertCircle,
      stat: 'Por debajo del salario mínimo',
      detail: '48% caída en pago desde 2022',
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-black text-center text-gray-900 mb-4"
        >
          Todos Pierden con Rappi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl text-center text-gray-600 mb-16"
        >
          Los tres actores están insatisfechos
        </motion.p>

        <div className="grid grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2"
              style={{ borderColor: problem.color }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto"
                style={{ backgroundColor: `${problem.color}20` }}
              >
                <problem.icon className="w-8 h-8" style={{ color: problem.color }} />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                {problem.title}
              </h3>
              <div
                className="text-4xl font-black text-center mb-2"
                style={{ color: problem.color }}
              >
                {problem.stat}
              </div>
              <p className="text-sm text-center text-gray-600">{problem.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Center Problem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center shadow-2xl"
        >
          <div className="text-5xl font-black mb-3">Rappi extrae 44% de cada pedido</div>
          <div className="text-xl opacity-90">
            $54,820 COP en pedido de $124,000 → Explotación suma cero
          </div>
        </motion.div>
      </div>
    </div>
  );
}
