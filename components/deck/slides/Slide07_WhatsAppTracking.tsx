'use client';

import { motion } from 'framer-motion';
import ChatContainer from '../whatsapp/ChatContainer';
import ChatBubble from '../whatsapp/ChatBubble';
import InteractiveButton from '../whatsapp/InteractiveButton';
import LocationMessage from '../whatsapp/LocationMessage';
import { trackingFlow } from '@/lib/deck/data/whatsapp-flows';
import { MapPin, Clock } from 'lucide-react';

export default function Slide07_WhatsAppTracking() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-8 overflow-hidden">
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
              Rastreo en Tiempo Real
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-gray-600"
            >
              Actualizaciones de ubicación en vivo y estado del pedido - todo en WhatsApp
            </motion.p>
          </div>

          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recorrido del Pedido</h3>
            <div className="space-y-3">
              {[
                { status: 'Confirmado', done: true, time: '2 min' },
                { status: 'Preparando', done: true, time: '15 min' },
                { status: 'Listo', done: true, time: '20 min' },
                { status: 'En Camino', done: true, active: true, time: '5 min' },
                { status: 'Entregado', done: false, time: '~' },
              ].map((step, index) => (
                <motion.div
                  key={step.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.done
                        ? 'bg-[#25D366] text-white'
                        : 'bg-gray-200 text-gray-400'
                    } ${step.active ? 'ring-4 ring-[#25D366]/30' : ''}`}
                  >
                    {step.done ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        step.active ? 'text-[#25D366]' : 'text-gray-900'
                      }`}
                    >
                      {step.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{step.time}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: MapPin, text: 'Ubicación GPS en Vivo', color: '#0EA5E9' },
              { icon: Clock, text: 'Tiempo de llegada en tiempo real', color: '#06B6D4' },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex items-center gap-3"
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div className="text-sm font-semibold text-gray-700">{feature.text}</div>
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
            {trackingFlow.map((message, index) => (
              <div key={index}>
                {(message.sender === 'customer' || message.sender === 'wpfoods') && (
                  <ChatBubble
                    sender={message.sender}
                    message={message.message}
                    timestamp={message.timestamp}
                    delay={index * 0.5}
                  />
                )}
                {message.buttons && (
                  <InteractiveButton
                    buttons={message.buttons}
                    delay={index * 0.5 + 0.3}
                  />
                )}
                {message.location && (
                  <LocationMessage
                    name={message.location.name}
                    address={message.location.address}
                    delay={index * 0.5 + 0.5}
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
