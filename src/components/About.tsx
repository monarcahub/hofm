import React from 'react';
import { IMAGES } from '../config/images';
import { CheckCircle2, ShieldCheck, HeartHandshake, Sparkles, Building2, Eye } from 'lucide-react';

interface AboutProps {
  onOpenAppointment: () => void;
  onNavigateAbout?: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenAppointment, onNavigateAbout }) => {
  const pillars = [
    { title: 'Tecnologia moderna e segura' },
    { title: 'Atendimento para todas as idades' },
    { title: 'Convênios com ampla cobertura' },
    { title: 'Equipe médica especializada' },
  ];

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase Column (Macro Iris & Recognition Card) */}
          <div className="lg:col-span-5 relative">
            {/* Subtle decorative dot pattern behind image */}
            <div className="absolute -top-6 -left-6 w-32 h-32 text-teal-200/50 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="dot-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dot-pattern)" />
              </svg>
            </div>

            {/* Macro Eye Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src={IMAGES.hospital.macroEye}
                alt={IMAGES.hospital.altMacroEye}
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover object-center transform transition-transform duration-700 hover:scale-105"
              />

              {/* Floating Reference Badge - Faithful to original layout */}
              <div className="absolute -bottom-1 -left-1 sm:bottom-4 sm:left-4 sm:max-w-xs bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-[#004d5a] shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#be7b52]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    Referência em Oftalmologia
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Reconhecido pela qualidade técnica e cuidado humano no atendimento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
                O QUE FAZEMOS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004d5a] tracking-tight leading-snug">
                Cuidado oftalmológico completo para sua família
              </h2>
            </div>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              Oferecemos diagnósticos precisos, tratamentos modernos e cirurgias com tecnologia de ponta. Seja para consultas de rotina, procedimentos especializados ou cuidados preventivos, nossa equipe está pronta para cuidar da sua saúde visual com acolhimento e excelência em Santa Catarina.
            </p>

            {/* 4 Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="px-5 py-5 sm:py-6 rounded-xl bg-[#f8fafb] border border-slate-100 shadow-2xs hover:border-teal-200 transition-colors flex items-center justify-center text-center gap-3 min-h-[76px]"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#004d5a] shrink-0" />
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {pillar.title}
                  </h4>
                </div>
              ))}
            </div>

            {/* Call to Action Button */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href="/sobre"
                onClick={(e) => {
                  if (onNavigateAbout) {
                    e.preventDefault();
                    onNavigateAbout();
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#004d5a] hover:bg-[#003842] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-tight shadow-md transition-colors cursor-pointer"
              >
                <span>Saiba mais</span>
              </a>
              <a
                href="#unidades"
                className="text-xs font-semibold text-slate-600 hover:text-[#004d5a] underline underline-offset-4"
              >
                Ver localização das unidades →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
