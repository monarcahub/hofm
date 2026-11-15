import React, { useState, useEffect } from 'react';
import { IMAGES } from '../../config/images';
import { DOCTORS, REVIEWS, Doctor } from '../../data/content';
import { CheckCircle2, Award, Star, ChevronLeft, ChevronRight, CheckCircle, ExternalLink, Calendar, MapPin, Play, X, Minimize2, Maximize2 } from 'lucide-react';
import { Newsletter } from '../Newsletter';

interface AboutPageProps {
  onOpenAppointment: (unit?: string, specialty?: string, doctor?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onNavigateHome: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onOpenAppointment,
  onSelectDoctor,
  onNavigateHome,
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Close floating video on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoModalOpen(false);
    };
    if (videoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoModalOpen]);
  const pillars = [
    { title: 'Tecnologia moderna e segura' },
    { title: 'Atendimento para todas as idades' },
    { title: 'Convênios com ampla cobertura' },
    { title: 'Equipe médica especializada' },
  ];

  // Specific doctors displayed on the official Sobre page
  const doctorsOnAbout = [
    {
      doctor: DOCTORS.find((d) => d.id === 'dr-lucas-leitis') || DOCTORS[1],
      photoUrl: IMAGES.doctors.lucasLeitis.url,
      customRole: 'Especialista em retina aqui no HOFM',
    },
    {
      doctor: DOCTORS.find((d) => d.id === 'dr-mauricio-munareto') || DOCTORS[2],
      photoUrl: IMAGES.doctors.mauricioMunareto.url,
      customRole: 'Especialista catarata, lentes de contato e crosslinking.',
    },
    {
      doctor: DOCTORS.find((d) => d.id === 'dr-alexandre-freitag') || DOCTORS[0],
      photoUrl: IMAGES.doctors.alexandreFreitag.url,
      customRole: 'Fundador e diretor técnico do HOFM.',
    },
  ];

  // Specific reviews displayed on the official Sobre page
  const reviewsOnAbout = [
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
      {/* 1. HERO BREADCRUMB BANNER (Exact reproduction of freitagmunareto.com.br/sobre) */}
      <section className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden flex items-center bg-[#004d5a]">
        {/* Banner Background Image */}
        <img
          src={IMAGES.aboutPage.bannerBackground}
          alt="Hospital de Olhos Freitag Munareto - Sobre a HOFM"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter blur-[0.5px]"
        />

        {/* Ambient Dark/Warm Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full text-left space-y-2 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Sobre a HOFM
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
            <span className="text-teal-200 font-normal">Sobre nós</span>
          </nav>
        </div>
      </section>

      {/* 2. SECTION "O QUE FAZEMOS" */}
      <section className="py-20 lg:py-24 bg-white transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column: Dr. Alexandre in Consultation Room */}
            <div className="lg:col-span-5 relative">
              {/* Dotted pattern decoration behind top of image */}
              <div className="absolute -top-7 -left-7 w-36 h-36 text-teal-300/40 pointer-events-none">
                <svg width="100%" height="100%">
                  <pattern id="dot-pattern-about" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" fill="currentColor" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dot-pattern-about)" />
                </svg>
              </div>

              {/* Photo Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-50 group">
                <img
                  src={IMAGES.aboutPage.drAlexandreConsultation}
                  alt="Dr. Alexandre Rocha Freitag no consultório do Hospital de Olhos Freitag Munareto"
                  className="w-full h-[420px] object-cover object-top transform transition-transform duration-700 group-hover:scale-[1.03]"
                />

                {/* Video Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pb-12 pointer-events-none">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoModalOpen(true);
                      setIsMinimized(false);
                    }}
                    className="pointer-events-auto group/btn relative flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#004d5a]/95 hover:bg-[#be7b52] text-white shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-300/80 active:scale-95"
                    aria-label="Assistir ao vídeo institucional sobre o Hospital de Olhos Freitag Munareto"
                  >
                    {/* Pulsing ring animation */}
                    <span className="absolute inset-0 rounded-full bg-white/30 animate-ping duration-1000 pointer-events-none" />
                    <Play className="w-8 h-8 fill-white text-white ml-1 transition-transform group-hover/btn:scale-110" />
                  </button>
                </div>

                {/* Floating "Referência em Oftalmologia" Badge (Faithful to Screenshot) */}
                <div className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-4 sm:max-w-xs bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      Referência em Oftalmologia
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Reconhecido pela qualidade técnica e humana no atendimento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
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
                Oferecemos diagnósticos precisos, tratamentos modernos e cirurgias com tecnologia de ponta. Seja para consultas de rotina, procedimentos especializados ou cuidados preventivos, nossa equipe está pronta para cuidar da sua saúde visual com acolhimento e excelência.
              </p>

              {/* 4 Core Check Items (2x2 Grid, matching screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-4 rounded-xl bg-[#f8fafb] border border-slate-100 shadow-2xs hover:border-teal-200 transition-colors flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#004d5a] shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {pillar.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION "CORPO CLÍNICO" / "Nossos médicos" */}
      <section className="py-20 bg-[#F8FAFB] border-t border-slate-100 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              CORPO CLÍNICO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              Nossos médicos
            </h2>
          </div>

          {/* 3 Doctors Grid (Dr. Lucas, Dr. Mauricio, Dr. Alexandre - matching screenshot) */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
              {doctorsOnAbout.map(({ doctor, photoUrl, customRole }) => (
                <div
                  key={doctor.id}
                  className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Doctor Avatar Circle Container with Halo */}
                  <div className="relative mb-6">
                    <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-[#004d5a]/20 via-teal-100 to-[#be7b52]/20 p-1 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center">
                        <img
                          src={photoUrl}
                          alt={`Fotografia oficial de ${doctor.name}`}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Doctor Identification Card */}
                  <div className="w-full bg-[#f8fafb] rounded-2xl p-6 border border-slate-100 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#004d5a] transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {customRole}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200/60">
                      <button
                        onClick={() => onSelectDoctor(doctor)}
                        className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:border-[#004d5a] text-xs font-bold text-[#004d5a] hover:bg-teal-50 transition-all cursor-pointer"
                      >
                        Ver detalhes e agendar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION "AVALIAÇÕES" / "O que os clientes falam sobre a HOFM" */}
      <section className="py-20 lg:py-24 bg-white border-y border-slate-100 transition-colors relative overflow-hidden">
        {/* Subtle World/Region Dotted Map Vector Background (per screenshot) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center">
          <svg className="w-[1000px] h-[500px]" viewBox="0 0 1000 500" fill="currentColor">
            <pattern id="map-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" />
            </pattern>
            <rect width="1000" height="500" fill="url(#map-dots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              AVALIAÇÕES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              O que os clientes falam sobre a HOFM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Nossos pacientes são a maior prova do nosso compromisso com a excelência. Veja o que dizem aqueles que confiaram sua saúde ocular ao Hospital de Olhos Freitag.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Google Score Summary Column */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="p-6 text-center w-full max-w-xs">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  BOM
                </h3>

                {/* 5 Golden Stars */}
                <div className="flex items-center justify-center gap-1 text-amber-400 my-2" aria-label="Avaliação 5 estrelas">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-500 font-medium">
                  Com base em <strong className="text-slate-900 font-bold">17 avaliações</strong>
                </p>

                {/* Google Logo */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-sm font-bold text-slate-800">Google Avaliações</span>
                </div>
              </div>
            </div>

            {/* Testimonials Cards (Edu, Ramires, Ernani - matching screenshot) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {reviewsOnAbout.map((review, i) => (
                  <div
                    key={i}
                    className="bg-[#F8FAFB] text-slate-800 rounded-2xl p-6 shadow-2xs border border-slate-200/80 flex flex-col justify-between"
                  >
                    <div>
                      {/* Author Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-[#004d5a] font-bold text-xs flex items-center justify-center shrink-0">
                            {review.initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight line-clamp-1 text-slate-900">
                              {review.name}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {review.timeAgo}
                            </span>
                          </div>
                        </div>

                        {/* Google G badge */}
                        <span className="text-xs font-semibold text-[#4285F4]">G</span>
                      </div>

                      {/* 5 Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                        {[...Array(review.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
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

      {/* 5. NEWSLETTER SECTION */}
      <Newsletter />

      {/* 6. FLOATING VERTICAL VIDEO WIDGET (PICTURE-IN-PICTURE - NÃO BLOQUEIA A NAVEGAÇÃO) */}
      {videoModalOpen && (
        <aside
          aria-label="Vídeo institucional flutuante do Hospital de Olhos Freitag Munareto"
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto"
        >
          {isMinimized ? (
            /* Minimized Floating Pill */
            <div className="flex items-center gap-2 bg-[#004d5a] text-white p-2 sm:p-2.5 rounded-full shadow-2xl border-2 border-white/90 hover:bg-[#003842] transition-all">
              <button
                type="button"
                onClick={() => setIsMinimized(false)}
                className="flex items-center gap-2 px-2 text-xs font-semibold cursor-pointer"
                title="Expandir vídeo institucional"
              >
                <span className="w-2 h-2 rounded-full bg-[#be7b52] animate-ping" />
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Vídeo HOFM</span>
              </button>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-teal-200 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar vídeo"
                title="Fechar vídeo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Floating Vertical Player (9:16 Aspect Ratio) */
            <div className="relative w-[210px] sm:w-[250px] md:w-[270px] bg-slate-950 rounded-2xl overflow-hidden shadow-[0_22px_50px_rgba(0,0,0,0.5)] border-2 border-white/90 flex flex-col transition-all">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-slate-950 via-[#004d5a] to-slate-900 text-white border-b border-white/15 select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#be7b52] animate-pulse shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold tracking-tight text-teal-100 truncate">
                    Vídeo Institucional
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded text-teal-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Minimizar vídeo para ler a página"
                    aria-label="Minimizar vídeo"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(false)}
                    className="p-1 rounded text-teal-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Fechar vídeo"
                    aria-label="Fechar vídeo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Vertical Video Element (Aspect Ratio 9:16 for vertical reels video) */}
              <div className="relative w-full aspect-[9/16] max-h-[440px] bg-black flex items-center justify-center overflow-hidden">
                <video
                  src="https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/Sobre-Hospital-Olhos-Freitag-Munareto.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover bg-black"
                >
                  Seu navegador não suporta a reprodução deste vídeo.
                </video>
              </div>

              {/* Sub-footer caption */}
              <div className="px-3 py-1.5 bg-slate-900/90 text-[10px] text-teal-200/90 text-center flex items-center justify-center gap-1 border-t border-white/10">
                <span>Acompanhe enquanto navega pelo site</span>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
