'use client';

import { motion } from 'framer-motion';

export interface BreakdownItem {
  category: string;
  percentage: number;
  amount: string;
  description: string;
  color: string;
}

interface BreakdownChartProps {
  title: string;
  subtitle?: string;
  total: string;
  items: BreakdownItem[];
  delay?: number;
}

export default function BreakdownChart({
  title,
  subtitle,
  total,
  items,
  delay = 0,
}: BreakdownChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
        <div className="mt-3 text-3xl font-black text-indigo-700">
          {total}
        </div>
      </div>

      {/* Breakdown Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.2 + index * 0.05 }}
            className="relative"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.category}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: item.color }}
                >
                  ({item.percentage}%)
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {item.amount}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: delay + 0.4 + index * 0.05 }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              ></motion.div>
            </div>

            {/* Description */}
            <div className="mt-1 text-xs text-gray-600 ml-5">
              {item.description}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
