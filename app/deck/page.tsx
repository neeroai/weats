'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DeckNavigation from '@/components/deck/DeckNavigation';

// Import all 18 slides
import Slide01_Cover from '@/components/deck/slides/Slide01_Cover';
import Slide02_Problem from '@/components/deck/slides/Slide02_Problem';
import Slide03_Solution from '@/components/deck/slides/Slide03_Solution';
import Slide04_WhatsAppOnboarding from '@/components/deck/slides/Slide04_WhatsAppOnboarding';
import Slide05_WhatsAppOrdering from '@/components/deck/slides/Slide05_WhatsAppOrdering';
import Slide06_WhatsAppMenu from '@/components/deck/slides/Slide06_WhatsAppMenu';
import Slide07_WhatsAppTracking from '@/components/deck/slides/Slide07_WhatsAppTracking';
import Slide08_UnitEconomics from '@/components/deck/slides/Slide08_UnitEconomics';
import Slide09_WhyCustomersSwitch from '@/components/deck/slides/Slide09_WhyCustomersSwitch';
import Slide10_WhyRestaurantsSwitch from '@/components/deck/slides/Slide10_WhyRestaurantsSwitch';
import Slide11_WhyWorkersSwitch from '@/components/deck/slides/Slide11_WhyWorkersSwitch';
import Slide12_AIAdvantage from '@/components/deck/slides/Slide12_AIAdvantage';
import Slide13_MarketOpportunity from '@/components/deck/slides/Slide13_MarketOpportunity';
import Slide14_TheAsk from '@/components/deck/slides/Slide14_TheAsk';
import Slide15_CompetitiveAnalysis from '@/components/deck/slides/Slide15_CompetitiveAnalysis';
import Slide16_Financials from '@/components/deck/slides/Slide16_Financials';
import Slide17_GTMStrategy from '@/components/deck/slides/Slide17_GTMStrategy';
import Slide18_Traction from '@/components/deck/slides/Slide18_Traction';

const slides = [
  Slide01_Cover,
  Slide02_Problem,
  Slide03_Solution,
  Slide04_WhatsAppOnboarding,
  Slide05_WhatsAppOrdering,
  Slide06_WhatsAppMenu,
  Slide07_WhatsAppTracking,
  Slide08_UnitEconomics,
  Slide09_WhyCustomersSwitch,
  Slide10_WhyRestaurantsSwitch,
  Slide11_WhyWorkersSwitch,
  Slide12_AIAdvantage,
  Slide13_MarketOpportunity,
  Slide14_TheAsk,
  Slide15_CompetitiveAnalysis,
  Slide16_Financials,
  Slide17_GTMStrategy,
  Slide18_Traction,
];

export default function InvestorDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          <CurrentSlideComponent />
        </motion.div>
      </AnimatePresence>

      <DeckNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNext={nextSlide}
        onPrev={prevSlide}
        onSlideChange={goToSlide}
      />
    </div>
  );
}
