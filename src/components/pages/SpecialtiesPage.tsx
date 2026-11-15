import React, { useState } from 'react';
import { IMAGES } from '../../config/images';
import { SPECIALTIES, Specialty } from '../../data/content';
import { Star, ChevronLeft, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';
import { Newsletter } from '../Newsletter';

interface SpecialtiesPageProps {
  onSelectSpecialty: (specialty: Specialty) => void;
  onOpenAppointment: (unit?: string, specialty?: string, doctor?: string) => void;
  onNavigateHome: () => void;
}

export const SpecialtiesPage: React.FC<SpecialtiesPageProps> = ({
  onSelectSpecialty,
  onOpenAppointment,
  onNavigateHome,
}) => {
  // 7 Official specialties shown on the reference screenshot
  const officialIds = [
    'ceratocone',
    'injecao-intravitrea',
    'plastica-ocular',
    'vias-lacrimais',
    'pterigio',
    'catarata',
    'yag-laser',
  ];

  const specialtyCards = officialIds
    .map((id) => SPECIALTIES.find((s) => s.id === id))
    .filter((s): s is Specialty => Boolean(s));

  // Reviews data identical to the reference screenshot
  const reviewsData = [
    {
      name: 'Edu Schlickmann',
      initials: 'ES',
      timeAgo: '1 ano atrás',
      rating: 5,
      text: 'Atendimento espetacular',
    },
    {
      name: 'Ramires Antônio S...',
      initials: 'RA',
      timeAgo: '2 anos atrás',
      rating: 5,
      text: 'Muito bem atendido!',
    },
    {
      name: 'Ernani Moser',
      initials: 'EM',
      timeAgo: '2 anos atrás',
      rating: 5,
      text: 'Hospital de excelente qualidade. Profissionais super preparados. Fiz consulta com exames para óculos, e cirurgi...',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 font-['Jost',sans-serif]">
      {/* 1. HERO BREADCRUMB BANNER */}
      <section className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden flex items-center bg-[#004d5a]">
        {/* Banner Background Image (same as Sobre) */}
        <img
          src={IMAGES.aboutPage.bannerBackground}
          alt="Hospital de Olhos Freitag Munareto - Especialidades"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter blur-[0.5px]"
        />

        {/* Ambient Dark/Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full text-left space-y-2 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Especialidades
          </h1>

          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-teal-100 font-medium">
            <button
              onClick={onNavigateHome}
              className="text-white hover:text-teal-200 transition-colors cursor-pointer hover:underline"
            >
              Home
            </button>
            <span className="text-teal-300/80">|</span>
            <span className="text-teal-200 font-normal">Especialidades</span>
          </nav>
        </div>
      </section>

      {/* 2. SECTION "VEJAM EM QUE NÓS SOMOS ESPECIALISTAS" (Matches image_12d0941c.png) */}
      <section className="py-20 lg:py-24 bg-white transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              VEJAM EM QUE NÓS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              Somos Especialistas
            </h2>
          </div>

          {/* 7 Specialties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch">
            {specialtyCards.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectSpecialty(item)}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSpecialty(item);
                  }
                }}
                aria-label={`Ver detalhes da especialidade: ${item.title}`}
              >
                {/* Specialty Image */}
                <div className="relative w-full aspect-[175/119] overflow-hidden rounded-t-xl bg-slate-100 shadow-sm border border-slate-200/60">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-[#004d5a]/0 group-hover:bg-[#004d5a]/10 transition-colors" />
                </div>

                {/* Specialty Title Box with Teal Border (Faithful to Screenshot) */}
                <div className="mt-3.5 bg-white border border-[#004d5a]/50 group-hover:border-[#004d5a] rounded-lg p-3.5 sm:p-4 text-center transition-all duration-200 shadow-2xs group-hover:shadow-md group-hover:bg-[#004d5a] text-[#004d5a] group-hover:text-white">
                  <h3 className="text-sm sm:text-base font-bold tracking-tight transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AVALIAÇÕES DO GOOGLE COM MAPA PONTILHADO (Identical standard to Sobre) */}
      <section className="py-20 lg:py-24 bg-white border-t border-slate-100 relative overflow-hidden">
        {/* Subtle World Map Dotted Pattern Background */}
        <div className="absolute inset-0 opacity-[0.22] pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full max-w-5xl" viewBox="0 0 1000 500" fill="currentColor">
            <g className="text-teal-400">
              {Array.from({ length: 48 }).map((_, r) =>
                Array.from({ length: 72 }).map((__, c) => {
                  const x = c * 14 + 10;
                  const y = r * 10 + 10;
                  const inContinent =
                    (c > 10 && c < 30 && r > 10 && r < 38) ||
                    (c > 38 && c < 62 && r > 8 && r < 40) ||
                    (c > 55 && c < 68 && r > 28 && r < 45);
                  if (!inContinent) return null;
                  return <circle key={`${r}-${c}`} cx={x} cy={y} r="1.3" />;
                })
              )}
            </g>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              AVALIAÇÕES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              O que os clientes falam sobre a HOFM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-xl mx-auto leading-relaxed pt-1">
              Nossos pacientes são a maior prova do nosso compromisso com a excelência. Veja o que dizem aqueles que confiaram sua saúde ocular ao Hospital de Olhos Freitag.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Google Rating Overview Box */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Google Full Logo */}
                  <div className="flex items-center gap-1 font-bold text-lg tracking-tight">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    BOM
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Com base em <strong className="font-bold text-slate-800">17 avaliações</strong> verificadas
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-slate-600 font-medium">Avaliações públicas do Google</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    aria-label="Avaliação anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                    aria-label="Próxima avaliação"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews Cards List */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {reviewsData.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Reviewer Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-[#004d5a] font-bold text-sm flex items-center justify-center shrink-0">
                          {review.initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {review.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {review.timeAgo}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: review.rating }).map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Avaliação Verificada</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEWSLETTER SECTION */}
      <Newsletter />
    </div>
  );
};
