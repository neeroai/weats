'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface BubblePosition {
  x: number;
  y: number;
  scale: number;
  duration: number;
  targetX: number;
  targetY: number;
}

export default function Slide01_Cover() {
  const [bubbles, setBubbles] = useState<BubblePosition[]>([]);

  useEffect(() => {
    // Only run on client side after mount
    const initialBubbles = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 10 + 20,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
    }));
    setBubbles(initialBubbles);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] flex items-center justify-center overflow-hidden relative">
      {/* Animated WhatsApp bubbles in background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {bubbles.map((bubble, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: bubble.x,
              y: bubble.y,
              scale: bubble.scale,
            }}
            animate={{
              y: [null, bubble.targetY],
              x: [null, bubble.targetX],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <MessageCircle className="w-16 h-16 text-white" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center text-white px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl mb-6 shadow-2xl">
            <div className="text-5xl font-black text-[#25D366]">WP</div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-7xl font-black mb-6 leading-tight"
        >
          WhatsAppFoods
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-3xl font-semibold mb-4 text-white/95"
        >
          Desafiando a Rappi con un modelo Disruptivo
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-2xl text-white/90 mb-12"
        >
          Delivery por WhatsApp Impulsado por IA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center justify-center gap-8 text-lg"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 border-2 border-white/40">
            Investor Deck
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 border-2 border-white/40">
            Octubre 2025
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 text-sm text-white/70"
        >
          Presiona → o Espacio para continuar
        </motion.div>
      </div>
    </div>
  );
}
