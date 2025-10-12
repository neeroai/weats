'use client';

import { motion } from 'framer-motion';
import { Target, Bot, Smartphone, Heart } from 'lucide-react';
import CompetitorMatrix, { Competitor } from '../CompetitorMatrix';

export default function Slide15_CompetitiveAnalysis() {
  const competitors: Competitor[] = [
    {
      player: 'Rappi',
      marketShare: '64%',
      strength: 'Marca, escala, financiación ($3.5B)',
      weakness: 'Costos altos, sentimiento negativo',
      threatLevel: 'HIGH',
      description: 'ALTO pero atrapado',
    },
    {
      player: 'DiDi Food',
      marketShare: '18%',
      strength: 'Respaldo chino, agresivo',
      weakness: 'Misma estructura costos que Rappi',
      threatLevel: 'MEDIUM',
      description: 'MEDIO',
    },
    {
      player: 'Uber Eats',
      marketShare: '12%',
      strength: 'Marca global',
      weakness: 'Saliendo de mercados LatAm',
      threatLevel: 'LOW',
      description: 'BAJO',
    },
    {
      player: 'Jugadores Locales',
      marketShare: '6%',
      strength: 'Conocen mercado local',
      weakness: 'Falta escala y tech',
      threatLevel: 'LOW',
      description: 'BAJO',
    },
  ];

  const rappiOptions = [
    {
      letter: 'A',
      title: 'Bajar Comisiones para Competir',
      points: [
        'Necesitaría cortar 25-35% → 5-10%',
        'Pierde 60-80% de ingreso',
        'Se vuelve no rentable inmediatamente',
        'Inversionistas y junta directiva se rebelan',
      ],
      result: 'IMPOSIBLE',
      color: '#EF4444',
    },
    {
      letter: 'B',
      title: 'Agregar IA al Modelo Actual',
      points: [
        'Costos: $50-100M infraestructura',
        'Timeline: 24-36 meses',
        'Costo IA: $0.50/pedido vs nuestro $0.0003',
        'Canibalizar ops rentables existentes',
        'Resistencia interna (amenaza empleos)',
      ],
      result: 'MUY LENTO Y COSTOSO',
      color: '#F59E0B',
    },
    {
      letter: 'C',
      title: 'Construir Marca Low-Cost Separada',
      points: [
        'Divide foco y recursos',
        'Canibaliza marca principal',
        'Confunde posicionamiento mercado',
        'Aún no puede igualar nuestra estructura costos',
      ],
      result: 'PERDER-PERDER',
      color: '#8B5CF6',
    },
    {
      letter: 'D',
      title: 'No Hacer Nada',
      points: [
        'Crecemos 10% market share = $317M',
        'Clientes desertan por ahorros',
        'Restaurantes desertan por márgenes',
        'Domiciliarios desertan por pago',
      ],
      result: 'MUERTE LENTA',
      color: '#DC2626',
    },
  ];

  const advantages = [
    {
      icon: Target,
      title: 'Foso de Estructura de Costos',
      description: '91% menores costos (9.5% vs 24-30%)',
      detail: 'Matemáticamente imposible para incumbentes igualar',
      color: '#10B981',
    },
    {
      icon: Bot,
      title: 'Arquitectura IA-First',
      description: 'Costos IA 166x más baratos vía optimización',
      detail: 'Tier gratis + context caching',
      color: '#3B82F6',
    },
    {
      icon: Smartphone,
      title: 'Distribución WhatsApp',
      description: 'Cero costo de adquisición',
      detail: '90% penetración en Colombia',
      color: '#8B5CF6',
    },
    {
      icon: Heart,
      title: 'Alineación Stakeholders',
      description: 'Todos ganan excepto competidores',
      detail: 'Viralidad incorporada y advocacy',
      color: '#EC4899',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 overflow-y-auto p-8 py-16 pb-32">
      <div className="max-w-7xl w-full space-y-12 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-block mb-4">
            <div className="text-6xl">⚔️</div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-4">
            Análisis Competitivo
          </h1>
          <p className="text-2xl text-gray-600">
            El Dilema del Innovador en Acción
          </p>
        </motion.div>

        {/* Competitive Landscape */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
            Panorama Competitivo
          </h2>
          <CompetitorMatrix competitors={competitors} delay={0.5} />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Why Rappi Can't Respond */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Por Qué Rappi No Puede Responder Efectivamente
          </h2>
          <p className="text-lg text-gray-600">
            Opciones Imposibles de Rappi
          </p>
        </motion.div>

        {/* Four Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {rappiOptions.map((option, index) => (
            <motion.div
              key={option.letter}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200"
            >
              {/* Option Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl"
                  style={{ backgroundColor: option.color }}
                >
                  {option.letter}
                </div>
                <h3 className="text-lg font-bold text-gray-900 flex-1">
                  {option.title}
                </h3>
              </div>

              {/* Points List */}
              <ul className="space-y-2 mb-4">
                {option.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-base md:text-lg text-gray-700">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: option.color }}
                    ></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Result Badge */}
              <div
                className="text-center py-3 rounded-lg font-black text-base md:text-lg"
                style={{
                  backgroundColor: `${option.color}20`,
                  color: option.color,
                }}
              >
                Resultado: {option.result}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 2.0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </motion.div>

        {/* Our Sustainable Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Nuestras Ventajas Sostenibles
          </h2>
          <p className="text-lg text-gray-600">
            Construido en DNA, no agregado encima
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                style={{ backgroundColor: `${advantage.color}20` }}
              >
                <advantage.icon className="w-7 h-7" style={{ color: advantage.color }} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                {advantage.title}
              </h3>

              {/* Description */}
              <div
                className="text-base md:text-lg font-semibold text-center mb-2"
                style={{ color: advantage.color }}
              >
                {advantage.description}
              </div>

              {/* Detail */}
              <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed">
                {advantage.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Insight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 3.0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <div className="text-white text-xl font-bold mb-2">
                  Insight Competitivo
                </div>
                <div className="text-white text-lg leading-relaxed">
                  Rappi levantó <strong className="text-red-300">$3.5B y quema efectivo</strong>.
                  Necesitamos <strong className="text-green-300">$500K y somos rentables Año 3</strong>.
                  {' '}<strong className="text-yellow-300 text-xl">
                    Esta no es una pelea justa - tenemos ventajas estructurales que no pueden superar.
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
