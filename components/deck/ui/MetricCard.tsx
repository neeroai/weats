'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  color?: string;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#25D366',
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        )}
      </div>
      <div className="mb-2">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="text-3xl font-bold text-gray-900"
        >
          {value}
        </motion.div>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
    </motion.div>
  );
}
