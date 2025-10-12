'use client';

import { motion } from 'framer-motion';
import PieChart from '../charts/PieChart';
import MetricCard from '../ui/MetricCard';
import { DollarSign, TrendingUp, Target } from 'lucide-react';

export default function Slide08_UnitEconomics() {
  const wpfoodsData = [
    { name: 'Para Plataforma', value: 8.4, color: '#25D366' },
    { name: 'Para Restaurante', value: 91.6, color: '#128C7E' },
  ];

  const rappiData = [
    { name: 'Para Plataforma', value: 34, color: '#FF2D55' },
    { name: 'Para Restaurante', value: 66, color: '#FFB6C1' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-8 overflow-y-auto pb-32">
      <div className="max-w-7xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-5xl font-black text-center text-gray-900 mb-16"
        >
          Economía Unitaria: Rentable por Pedido
        </motion.h1>

        <div className="grid grid-cols-2 gap-12 mb-12">
          {/* WPFoods */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-[#25D366] mb-6 text-center">WPFoods</h2>
            <div className="h-64">
              <PieChart data={wpfoodsData} delay={0.3} />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Tasa de Comisión</div>
                <div className="text-4xl font-black text-[#25D366]">8.4%</div>
              </div>
            </div>
          </motion.div>

          {/* Rappi */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-[#FF2D55] mb-6 text-center">Rappi</h2>
            <div className="h-64">
              <PieChart data={rappiData} delay={0.4} />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Tasa de Comisión</div>
                <div className="text-4xl font-black text-[#FF2D55]">34%</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="grid grid-cols-3 gap-6"
        >
          <MetricCard
            title="Ingreso por Pedido"
            value="$2.53"
            subtitle="$10.44K COP"
            icon={DollarSign}
            color="#25D366"
            delay={1}
          />
          <MetricCard
            title="Utilidad por Pedido"
            value="$0.86"
            subtitle="$3.55K COP"
            icon={Target}
            color="#128C7E"
            delay={1.1}
          />
          <MetricCard
            title="Margen de Utilidad"
            value="34%"
            subtitle="Sostenible y justo"
            icon={TrendingUp}
            color="#FF6B35"
            delay={1.2}
          />
        </motion.div>
      </div>
    </div>
  );
}
