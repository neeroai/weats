'use client';

import { motion } from 'framer-motion';
import ChatContainer from '../whatsapp/ChatContainer';
import ChatBubble from '../whatsapp/ChatBubble';
import InteractiveButton from '../whatsapp/InteractiveButton';
import { onboardingFlow } from '@/lib/deck/data/whatsapp-flows';
import { Clock } from 'lucide-react';

export default function Slide04_WhatsAppOnboarding() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-2 gap-12 items-center">
        {/* Left: WhatsApp Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ChatContainer title="WPFoods" subtitle="Online">
            {onboardingFlow.map((message, index) => (
              <div key={index}>
                {message.sender === 'customer' || message.sender === 'wpfoods' ? (
                  <ChatBubble
                    sender={message.sender}
                    message={message.message}
                    timestamp={message.timestamp}
                    delay={index * 0.5}
                  />
                ) : null}
                {message.buttons && (
                  <InteractiveButton
                    buttons={message.buttons}
                    delay={index * 0.5 + 0.3}
                  />
                )}
              </div>
            ))}
          </ChatContainer>
        </motion.div>

        {/* Right: Key Messages */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-8"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-5xl font-bold text-gray-900 mb-4"
            >
              Onboarding por WhatsApp
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xl text-gray-600"
            >
              Sin descargar app. Sin fricción. Solo envía mensaje y comienza.
            </motion.p>
          </div>

          {/* Big Stat Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl p-8 text-white shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <Clock className="w-12 h-12" />
              <div>
                <div className="text-6xl font-bold">30 sec</div>
                <div className="text-2xl opacity-90">vs 5-10 min (Rappi)</div>
              </div>
            </div>
            <div className="border-t border-white/30 pt-4 mt-4">
              <div className="text-lg font-semibold mb-2">10-20x Más Rápido</div>
              <div className="text-sm opacity-80">
                Clientes listos para pedir en menos de 30 segundos
              </div>
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-wrap gap-3"
          >
            {[
              'Sin Descargar App',
              'UI Conversacional',
              'Setup Instantáneo',
              '90% Penetración',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                className="bg-white px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 shadow-md"
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
