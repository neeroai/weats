'use client';

import { motion } from 'framer-motion';
import ChatContainer from '../whatsapp/ChatContainer';
import ChatBubble from '../whatsapp/ChatBubble';
import InteractiveList from '../whatsapp/InteractiveList';
import InteractiveButton from '../whatsapp/InteractiveButton';
import { orderingFlow } from '@/lib/deck/data/whatsapp-flows';
import { Zap } from 'lucide-react';

export default function Slide05_WhatsAppOrdering() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-8 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-2 gap-12 items-center">
        {/* Left: Key Messages */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl font-bold text-gray-900 mb-4"
            >
              Pedidos Conversacionales
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-gray-600"
            >
              La IA entiende lenguaje natural. Sin navegar menús por 5 minutos.
            </motion.p>
          </div>

          {/* Big Stat Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-[#FF6B35] to-[#FF2D55] rounded-2xl p-8 text-white shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <Zap className="w-12 h-12" />
              <div>
                <div className="text-6xl font-bold">30 seg</div>
                <div className="text-2xl opacity-90">para completar pedido</div>
              </div>
            </div>
            <div className="border-t border-white/30 pt-4 mt-4">
              <div className="text-lg font-semibold mb-2">vs 5+ minutos en apps tradicionales</div>
              <div className="text-sm opacity-80">
                "Quiero tacos para 2 por menos de $20" → Listo
              </div>
            </div>
          </motion.div>

          {/* Flow Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-3"
          >
            {[
              { step: '1', text: 'Consulta en lenguaje natural' },
              { step: '2', text: 'IA encuentra 3 opciones perfectas' },
              { step: '3', text: 'Seleccionar y confirmar' },
              { step: '4', text: '¡Pedido realizado!' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4 bg-white rounded-lg px-5 py-3 shadow-md"
              >
                <div className="w-8 h-8 bg-[#FF6B35] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div className="text-gray-700 font-medium">{item.text}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: WhatsApp Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ChatContainer title="WPFoods" subtitle="En línea">
            {orderingFlow.map((message, index) => (
              <div key={index}>
                {(message.sender === 'customer' || message.sender === 'wpfoods') && (
                  <ChatBubble
                    sender={message.sender}
                    message={message.message}
                    timestamp={message.timestamp}
                    delay={index * 0.4}
                  />
                )}
                {message.listItems && (
                  <InteractiveList
                    items={message.listItems}
                    buttonText="Ver Opciones"
                    delay={index * 0.4 + 0.2}
                  />
                )}
                {message.buttons && (
                  <InteractiveButton
                    buttons={message.buttons}
                    delay={index * 0.4 + 0.2}
                  />
                )}
              </div>
            ))}
          </ChatContainer>
        </motion.div>
      </div>
    </div>
  );
}
