'use client';

import { motion } from 'framer-motion';

export interface Phase {
  number: number;
  title: string;
  timeframe: string;
  objective: string;
  metrics: string[];
  color: string;
}

interface PhaseTimelineProps {
  phases: Phase[];
  delay?: number;
}

export default function PhaseTimeline({ phases, delay = 0 }: PhaseTimelineProps) {
  return (
    <div className="space-y-6">
      {phases.map((phase, index) => (
        <motion.div
          key={phase.number}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + index * 0.15 }}
          className="relative"
        >
          {/* Connector Line (except for last phase) */}
          {index < phases.length - 1 && (
            <div
              className="absolute left-6 top-16 w-0.5 h-12 bg-gray-300"
              style={{ backgroundColor: phase.color, opacity: 0.3 }}
            ></div>
          )}

          <div className="flex items-start gap-4">
            {/* Phase Number Badge */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg"
              style={{ backgroundColor: phase.color }}
            >
              {phase.number}
            </div>

            {/* Phase Content */}
            <div className="flex-1 bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{phase.title}</h3>
                  <div className="text-sm text-gray-600 mt-1">{phase.timeframe}</div>
                </div>
              </div>

              {/* Objective */}
              <div className="mb-3">
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: phase.color }}
                >
                  Objetivo:
                </div>
                <div className="text-sm text-gray-700">{phase.objective}</div>
              </div>

              {/* Metrics */}
              <div>
                <div
                  className="text-sm font-semibold mb-2"
                  style={{ color: phase.color }}
                >
                  Métricas Clave:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {phase.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: phase.color }}
                      ></span>
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
