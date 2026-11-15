import React, { useState, useEffect, useRef } from 'react';
import { PARTNERS } from '../data/content';
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface PartnersProps {
  onOpenAppointment: () => void;
}

export const Partners: React.FC<PartnersProps> = ({ onOpenAppointment }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalItems = PARTNERS.length;

  // Auto-slide advance every 2.8 seconds when not paused
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 2800);

    return () => clearInterval(timer);
  }, [isPaused, totalItems]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  return (
    <section id="convenios" className="py-16 bg-white border-y border-slate-100 transition-colors overflow-hidden font-['Jost',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Title */}
        <div className="mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
            NOSSOS CONVÊNIOS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#004d5a] tracking-tight">
            Parcerias para o seu bem-estar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Atendemos os principais convênios médicos, cooperativas e entidades de classe com agilidade e cobertura.
          </p>
        </div>

        {/* Auto-Slide Carousel Wrapper */}
        <div
          className="relative max-w-6xl mx-auto px-4 sm:px-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Navigation Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#004d5a] hover:border-[#004d5a] shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105"
            aria-label="Convênio anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Track */}
          <div className="overflow-hidden py-3">
            <div
              className="flex transition-transform duration-700 ease-in-out gap-4 sm:gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / Math.min(totalItems, 4))}%)`,
              }}
            >
              {/* Duplicate array to ensure endless seamless rotation */}
              {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
                <div
                  key={`${partner.id}-${idx}`}
                  className="w-[calc(50%-8px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] shrink-0 bg-white hover:bg-[#F8FAFB] rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col items-center justify-center text-center group min-h-[130px] select-none"
                >
                  <div className="h-12 w-full flex items-center justify-center mb-2">
                    <img
                      src={partner.logoUrl}
                      alt={`Logotipo oficial do convênio ${partner.name}`}
                      className="max-h-11 max-w-[125px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#004d5a] transition-colors leading-tight line-clamp-1 mt-1">
                    {partner.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
                    {partner.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#004d5a] hover:border-[#004d5a] shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105"
            aria-label="Próximo convênio"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {PARTNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === i
                    ? 'w-6 bg-[#004d5a]'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Ir para convênio ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Inquiry prompt */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 bg-[#F8FAFB] px-5 py-3 rounded-full border border-slate-200 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-[#004d5a] shrink-0" />
          <span>Possui outro plano de saúde ou deseja consultar coberturas cirúrgicas?</span>
          <button
            onClick={onOpenAppointment}
            className="font-bold text-[#be7b52] hover:underline cursor-pointer"
          >
            Fale com nossa recepção
          </button>
        </div>
      </div>
    </section>
  );
};
