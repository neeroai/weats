'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';

interface DeckNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onSlideChange: (index: number) => void;
}

export default function DeckNavigation({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
  onSlideChange,
}: DeckNavigationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: showControls ? 1 : 0.2 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-opacity"
    >
      <div className="bg-gray-900/90 backdrop-blur-md rounded-full px-6 py-4 shadow-2xl flex items-center gap-6">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={currentSlide === 0}
          className="text-white hover:text-[#25D366] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => onSlideChange(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? 'bg-[#25D366] w-8'
                    : 'bg-gray-500 hover:bg-gray-400'
                }`}
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Slide {index + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="text-white hover:text-[#25D366] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Counter */}
        <div className="text-white text-sm font-medium border-l border-gray-700 pl-6">
          {currentSlide + 1} / {totalSlides}
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="text-white hover:text-[#25D366] transition-colors border-l border-gray-700 pl-6"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute -top-2 left-0 right-0 h-1 bg-gray-700/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#25D366]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
