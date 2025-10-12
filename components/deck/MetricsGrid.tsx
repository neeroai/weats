'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export interface MetricCategory {
  title: string;
  metrics: string[];
  color: string;
}

interface MetricsGridProps {
  categories: MetricCategory[];
  delay?: number;
}

export default function MetricsGrid({ categories, delay = 0 }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {categories.map((category, catIndex) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + catIndex * 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border-2"
          style={{ borderColor: `${category.color}40` }}
        >
          {/* Category Header */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <CheckCircle2 className="w-6 h-6" style={{ color: category.color }} />
            </div>
            <h3
              className="text-lg font-bold"
              style={{ color: category.color }}
            >
              {category.title}
            </h3>
          </div>

          {/* Metrics List */}
          <ul className="space-y-3">
            {category.metrics.map((metric, metricIndex) => (
              <motion.li
                key={metricIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: delay + catIndex * 0.1 + 0.1 + metricIndex * 0.05,
                }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span>{metric}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
