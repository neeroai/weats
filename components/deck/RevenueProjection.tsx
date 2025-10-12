'use client';

import { motion } from 'framer-motion';

export interface YearProjection {
  year: number;
  users: string;
  ordersPerDay: string;
  gmvAnnual: string;
  revenue: string;
  costs: string;
  netIncome: string;
  margin: string;
  profitable: boolean;
}

interface RevenueProjectionProps {
  projections: YearProjection[];
  delay?: number;
}

export default function RevenueProjection({
  projections,
  delay = 0,
}: RevenueProjectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="w-full overflow-x-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[800px]">
        {/* Table Header */}
        <div className="grid grid-cols-8 bg-gradient-to-r from-indigo-50 to-purple-100 border-b border-gray-200">
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Año
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Usuarios
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Pedidos/Día
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            GMV Anual
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Ingreso
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Costos
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Neto
          </div>
          <div className="px-3 py-3 font-semibold text-gray-900 text-xs text-center">
            Margen
          </div>
        </div>

        {/* Table Rows */}
        {projections.map((projection, index) => (
          <motion.div
            key={projection.year}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.2 + index * 0.1 }}
            className={`grid grid-cols-8 border-b border-gray-100 last:border-b-0 ${
              projection.profitable
                ? 'bg-green-50 hover:bg-green-100'
                : 'bg-white hover:bg-gray-50'
            } transition-colors`}
          >
            {/* Year */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div
                className={`text-sm font-bold ${
                  projection.profitable ? 'text-green-800' : 'text-gray-900'
                }`}
              >
                {projection.year}
              </div>
            </div>

            {/* Users */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div className="text-xs text-gray-700 text-center">
                {projection.users}
              </div>
            </div>

            {/* Orders Per Day */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div className="text-xs text-gray-700 text-center">
                {projection.ordersPerDay}
              </div>
            </div>

            {/* GMV Annual */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div className="text-xs font-semibold text-indigo-700 text-center">
                {projection.gmvAnnual}
              </div>
            </div>

            {/* Revenue */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div className="text-xs font-semibold text-blue-700 text-center">
                {projection.revenue}
              </div>
            </div>

            {/* Costs */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div className="text-xs text-red-600 text-center">
                {projection.costs}
              </div>
            </div>

            {/* Net Income */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div
                className={`text-xs font-bold text-center ${
                  projection.profitable ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {projection.netIncome}
              </div>
            </div>

            {/* Margin */}
            <div className="px-3 py-3 flex items-center justify-center">
              <div
                className={`text-xs font-bold text-center ${
                  projection.profitable ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {projection.margin}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
