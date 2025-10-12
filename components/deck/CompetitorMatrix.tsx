'use client';

import { motion } from 'framer-motion';

export interface Competitor {
  player: string;
  marketShare: string;
  strength: string;
  weakness: string;
  threatLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

interface CompetitorMatrixProps {
  competitors: Competitor[];
  delay?: number;
}

const threatColors = {
  HIGH: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  MEDIUM: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  LOW: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
};

const threatIcons = {
  HIGH: '🔴',
  MEDIUM: '🟡',
  LOW: '🟢',
};

export default function CompetitorMatrix({
  competitors,
  delay = 0,
}: CompetitorMatrixProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 bg-gradient-to-r from-red-50 to-orange-100 border-b border-gray-200">
          <div className="px-4 py-4 font-semibold text-gray-900 text-sm">
            Jugador
          </div>
          <div className="px-4 py-4 font-semibold text-gray-900 text-sm text-center">
            Market Share
          </div>
          <div className="px-4 py-4 font-semibold text-gray-900 text-sm">
            Fortaleza
          </div>
          <div className="px-4 py-4 font-semibold text-gray-900 text-sm">
            Debilidad
          </div>
          <div className="px-4 py-4 font-semibold text-gray-900 text-sm text-center">
            Nivel Amenaza
          </div>
        </div>

        {/* Table Rows */}
        {competitors.map((competitor, index) => {
          const colors = threatColors[competitor.threatLevel];

          return (
            <motion.div
              key={competitor.player}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.2 + index * 0.1 }}
              className="grid grid-cols-5 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition-colors"
            >
              {/* Player */}
              <div className="px-4 py-4 flex flex-col justify-center">
                <div className="font-bold text-gray-900 text-sm">
                  {competitor.player}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {competitor.description}
                </div>
              </div>

              {/* Market Share */}
              <div className="px-4 py-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-gray-900">
                    {competitor.marketShare}
                  </div>
                </div>
              </div>

              {/* Strength */}
              <div className="px-4 py-4 flex items-center">
                <div className="text-sm text-gray-700">{competitor.strength}</div>
              </div>

              {/* Weakness */}
              <div className="px-4 py-4 flex items-center">
                <div className="text-sm text-gray-700">{competitor.weakness}</div>
              </div>

              {/* Threat Level */}
              <div className="px-4 py-4 flex items-center justify-center">
                <div
                  className="px-3 py-2 rounded-lg border-2 text-xs font-bold flex items-center gap-2"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <span>{threatIcons[competitor.threatLevel]}</span>
                  <span>{competitor.threatLevel}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
