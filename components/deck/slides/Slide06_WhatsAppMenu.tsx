'use client';

import { motion } from 'framer-motion';
import ChatContainer from '../whatsapp/ChatContainer';
import InteractiveList from '../whatsapp/InteractiveList';
import { menuBrowsingFlow } from '@/lib/deck/data/whatsapp-flows';
import { List, Star } from 'lucide-react';

export default function Slide06_WhatsAppMenu() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-8 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-2 gap-12 items-center">
        {/* Left: WhatsApp Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ChatContainer title="WPFoods" subtitle="En línea">
            {menuBrowsingFlow.map((message, index) => (
              <div key={index}>
                {message.listItems && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="flex justify-start mb-2"
                    >
                      <div className="max-w-[85%] bg-white rounded-lg px-4 py-3 shadow-sm">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
                          {message.message}
                        </p>
                        <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                      </div>
                    </motion.div>
                    <InteractiveList
                      items={message.listItems}
                      buttonText="Ver Menú"
                      delay={0.6}
                    />
                  </>
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
              Menú Interactivo
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xl text-gray-600"
            >
              Lista Interactiva nativa de WhatsApp para navegar sin problemas
            </motion.p>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-4"
          >
            {[
              {
                icon: List,
                title: 'Organizado por Categoría',
                description: 'Tacos, Burritos, Bebidas - navegación fácil',
                color: '#8B5CF6',
              },
              {
                icon: Star,
                title: 'Detalles Completos',
                description: 'Precios, descripciones, calificaciones - todo en una vista',
                color: '#6366F1',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.15 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Big Stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl"
          >
            <div className="text-4xl font-bold mb-2">No necesitas una app aparte</div>
            <div className="text-lg opacity-90">
              Todo sucede nativamente en WhatsApp
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
