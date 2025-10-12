'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface LocationMessageProps {
  name: string;
  address: string;
  delay?: number;
}

export default function LocationMessage({
  name,
  address,
  delay = 0,
}: LocationMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-start mb-2"
    >
      <div className="max-w-[75%]">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-green-100 to-blue-100 h-32 flex items-center justify-center relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute"
            >
              <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
            </motion.div>
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700">
              Live
            </div>
          </div>
          {/* Location info */}
          <div className="px-3 py-2 border-t border-gray-100">
            <div className="font-medium text-sm text-gray-900">{name}</div>
            <div className="text-xs text-gray-600">{address}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
