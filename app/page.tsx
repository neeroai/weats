'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#25D366] via-[#128C7E] to-[#075E54] flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl mb-8 shadow-2xl"
          >
            <div className="text-6xl font-black text-[#25D366]">WP</div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-7xl font-black text-white mb-6"
          >
            WhatsAppFoods
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl text-white/95 mb-4"
          >
            Desafiando a Rappi con un modelo Disruptivo
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
          >
            Delivery por WhatsApp impulsado por IA
            <br />
            $0 tarifas cliente · 5-10% comisiones restaurante · Pago 3x mejor domiciliarios
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* Investor Deck Link */}
            <Link
              href="/deck"
              className="group flex items-center gap-3 bg-white text-[#25D366] px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <FileText className="w-6 h-6" />
              <span>Investor Deck</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Documentation Link */}
            <Link
              href="/docs"
              className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold border-2 border-white/40 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <BookOpen className="w-6 h-6" />
              <span>Documentación</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-white mb-2">91%</div>
              <div className="text-white/80 text-sm">Costos más bajos vs Rappi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-white mb-2">34%</div>
              <div className="text-white/80 text-sm">Margen por pedido</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black text-white mb-2">$3.17B</div>
              <div className="text-white/80 text-sm">Mercado Colombia</div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 text-white/60 text-sm"
          >
            Pre-Launch · Seeking Seed Investment · Colombia 2025
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
