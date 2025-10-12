'use client';

import { motion } from 'framer-motion';
import PieChart from '../charts/PieChart';
import { useOfFunds } from '@/lib/deck/data/financials';
import { Rocket, TrendingUp, Target } from 'lucide-react';

export default function Slide14_TheAsk() {
  // Transform useOfFunds data to match PieChart expected format
  const pieChartData = useOfFunds.seed.breakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    color: item.color,
  }));

  return (
    <div className="w-full h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-black text-center text-gray-900 mb-4"
        >
          Levantando Ronda Seed de $500K
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl text-center text-gray-600 mb-16"
        >
          16.7% equity | Valoración pre-money $3M
        </motion.p>

        <div className="grid grid-cols-2 gap-12 mb-12">
          {/* Use of Funds */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Uso de Fondos</h2>
            <div className="h-80">
              <PieChart data={pieChartData} delay={0.6} />
            </div>
          </motion.div>

          {/* Target & Returns */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Milestones */}
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Objetivo 6 Meses</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Clientes</span>
                  <span className="text-2xl font-bold">10,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Pedidos/Día</span>
                  <span className="text-2xl font-bold">200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">GMV</span>
                  <span className="text-2xl font-bold">$5M</span>
                </div>
              </div>
            </div>

            {/* Returns */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Retorno Inversionista</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-80 mb-1">Salida Año 3 ($35M)</div>
                  <div className="text-4xl font-black">11.3x</div>
                </div>
                <div className="border-t border-white/30 pt-4">
                  <div className="text-sm opacity-80 mb-1">IPO Año 5 ($300M)</div>
                  <div className="text-4xl font-black">96.9x</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl text-center">
              <Rocket className="w-12 h-12 mx-auto mb-3" />
              <div className="text-2xl font-bold">Disrumpamos Rappi juntos</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
