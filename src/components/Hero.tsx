import React, { useState, useEffect } from 'react';
import { IMAGES } from '../config/images';
import { getHospitalAge } from '../data/content';
import { Calendar, ChevronRight, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenAppointment: () => void;
  onNavigateAbout?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment, onNavigateAbout }) => {
  // Counter animation: counts from 1900 up to 1979 on page load
  const [year, setYear] = useState(1900);

  // Random initial unit, alternating between Timbó and Pomerode
  const [currentUnit, setCurrentUnit] = useState<string>(() =>
    Math.random() > 0.5 ? 'Timbó' : 'Pomerode'
  );

  useEffect(() => {
    const startYear = 1900;
    const targetYear = 1979;
    const duration = 1500; // ms
    const startTime = performance.now();

    const animateYear = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(startYear + (targetYear - startYear) * ease);
      setYear(val);

      if (progress < 1) {
        requestAnimationFrame(animateYear);
      }
    };

    const frameId = requestAnimationFrame(animateYear);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Interval alternating the unit periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUnit((prev) => (prev === 'Timbó' ? 'Pomerode' : 'Timbó'));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#003842] text-white min-h-[580px] lg:min-h-[660px] flex items-center pt-12 pb-24 lg:pt-16 lg:pb-32 font-['Jost',sans-serif]"
    >
      {/* 1. Full-Proportion Background Image with Balanced Opacity and Tone Fusion */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={IMAGES.hero.bannerBackground}
          alt={IMAGES.hero.alt}
          className="w-full h-full object-cover object-[center_20%] lg:object-center opacity-65 sm:opacity-70 transition-opacity duration-500"
          loading="eager"
        />

        {/* Balanced Gradient Fusion: Solid Contrast on Left, Soft Atmosphere on Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00313a]/75 via-[#003e4a]/45 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#003842] to-transparent" />
      </div>

      {/* 2. Autonomous Moving Optical Lines & Ambient Illumination (Self-moving without scroll/mouse) */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {/* Soft Ambient Light Glow Sweeps */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-400/15 blur-3xl animate-beam" />
        <div className="absolute top-1/3 -right-24 w-[450px] h-[450px] rounded-full bg-[#be7b52]/15 blur-3xl animate-float-slow" />

        {/* Large Orbiting Circular Lens Line (Slow continuous rotation) */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[520px] h-[520px] lg:w-[680px] lg:h-[680px] rounded-full border border-teal-300/30 animate-orbit-lines">
          {/* Accent node on the orbit ring */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-200 shadow-[0_0_12px_#38bdf8]" />
        </div>

        {/* Medium Counter-Rotating Optical Ring */}
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 w-[380px] h-[380px] lg:w-[500px] lg:h-[500px] rounded-full border border-white/20 border-dashed animate-orbit-reverse">
          <div className="absolute bottom-4 right-12 w-2.5 h-2.5 rounded-full bg-[#d89166] shadow-[0_0_10px_#d89166]" />
        </div>

        {/* Subtle Wave SVG Arc (Flowing smooth motion) */}
        <svg
          className="absolute right-0 top-0 h-full w-2/3 lg:w-1/2 opacity-25 animate-float-slow"
          viewBox="0 0 500 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 500,0 C 320,180 200,420 500,750"
            stroke="url(#hero-gradient-line)"
            strokeWidth="2.5"
            strokeDasharray="8 6"
          />
          <path
            d="M 500,80 C 360,260 260,480 500,800"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="hero-gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#be7b52" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Foreground Content (Impactful Institutional Narrative) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-7 text-left">
          {/* Institutional Kicker: lighter font and smaller text */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-normal tracking-wider sm:tracking-widest uppercase text-teal-100/90 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d89166] shrink-0" />
            <span>HOSPITAL DE OLHOS FREITAG MUNARETO</span>
          </div>

          {/* Main Headline: Exactly 3 lines, with 'seu olhar.' on the last line, dynamically computed */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-white drop-shadow-sm">
            São {getHospitalAge()} anos <br />
            cuidando do <br />
            <span className="text-teal-200">seu olhar.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-teal-50/90 max-w-xl font-normal leading-relaxed">
            Diagnósticos precisos, tratamentos modernos e cirurgias de alta complexidade com acolhimento humano nas unidades de Timbó e Pomerode.
          </p>

          {/* Conversion Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {/* Saiba Mais Button in warm Terracotta navigating to /sobre */}
            <a
              href="/sobre"
              onClick={(e) => {
                if (onNavigateAbout) {
                  e.preventDefault();
                  onNavigateAbout();
                }
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#be7b52] hover:bg-[#a96841] text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base tracking-tight shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>Saiba Mais</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            {/* Direct Appointment CTA */}
            <button
              onClick={onOpenAppointment}
              className="inline-flex items-center justify-center gap-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/25 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 backdrop-blur-xs cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-teal-200" />
              <span>Agendar Consulta</span>
            </button>
          </div>

          {/* Quick Institutional Highlights: animated counter from 1900 to 1979 & alternating units */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-teal-100/90 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d89166]" />
              <span>
                Desde{' '}
                <strong className="font-bold text-white tracking-wider tabular-nums">
                  {year}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
              <span>
                Unidade{' '}
                <span
                  key={currentUnit}
                  className="font-bold text-teal-200 inline-block transition-all duration-300 animate-in fade-in"
                >
                  {currentUnit}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
