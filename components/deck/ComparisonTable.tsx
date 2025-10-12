'use client';

import { motion } from 'framer-motion';

interface ComparisonRow {
  feature: string;
  wpfoods: string | number;
  rappi: string | number;
  savings: string;
  highlight?: boolean;
}

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  rows: ComparisonRow[];
  delay?: number;
}

/**
 * Comparison Table Component
 *
 * Displays side-by-side comparison between WPFoods and Rappi
 * with animated reveal and highlighting for key metrics.
 *
 * Used in Slide09_WhyCustomersSwitch to show cost savings.
 */
export default function ComparisonTable({
  title = 'La Propuesta de Valor',
  subtitle,
  rows,
  delay = 0,
}: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Title Section */}
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-lg bg-white">
        {/* Header Row */}
        <div className="grid grid-cols-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
          <div className="px-6 py-4 font-semibold text-gray-900 text-sm">
            Característica
          </div>
          <div className="px-6 py-4 font-semibold text-green-700 text-sm text-center">
            WPFoods
          </div>
          <div className="px-6 py-4 font-semibold text-gray-700 text-sm text-center">
            Rappi
          </div>
          <div className="px-6 py-4 font-semibold text-green-700 text-sm text-center">
            Ahorro
          </div>
        </div>

        {/* Data Rows */}
        {rows.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.1 + index * 0.1 }}
            className={`grid grid-cols-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
              row.highlight ? 'bg-green-50' : ''
            }`}
          >
            {/* Feature Name */}
            <div
              className={`px-6 py-4 font-medium text-sm ${
                row.highlight ? 'text-gray-900 font-bold' : 'text-gray-700'
              }`}
            >
              {row.feature}
            </div>

            {/* WPFoods Value */}
            <div
              className={`px-6 py-4 text-center ${
                row.highlight ? 'font-bold text-green-700' : 'text-gray-900'
              }`}
            >
              {typeof row.wpfoods === 'number' ? (
                <span className="text-sm">{formatCurrency(row.wpfoods)}</span>
              ) : (
                <span className="text-sm">{row.wpfoods}</span>
              )}
            </div>

            {/* Rappi Value */}
            <div
              className={`px-6 py-4 text-center ${
                row.highlight ? 'font-bold text-gray-700' : 'text-gray-600'
              }`}
            >
              {typeof row.rappi === 'number' ? (
                <span className="text-sm">{formatCurrency(row.rappi)}</span>
              ) : (
                <span className="text-sm">{row.rappi}</span>
              )}
            </div>

            {/* Savings */}
            <div
              className={`px-6 py-4 text-center font-semibold ${
                row.highlight ? 'text-green-700 text-base' : 'text-green-600 text-sm'
              }`}
            >
              {row.savings}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.5 + rows.length * 0.1 }}
        className="mt-4 text-center text-sm text-gray-600 italic"
      >
        Cliente promedio pide 2.6x/mes. A $7K ahorro por pedido, eso es{' '}
        <strong className="text-green-700">$218K/año ahorrados</strong> ={' '}
        <strong className="text-green-700">motor masivo de retención</strong>
      </motion.div>
    </motion.div>
  );
}

/**
 * Format number as Colombian Pesos (COP)
 */
function formatCurrency(value: number): string {
  if (value === 0) return '$0';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
