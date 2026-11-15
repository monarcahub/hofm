import React from 'react';
import { IMAGES } from '../../config/images';
import { DOCTORS, Doctor } from '../../data/content';
import { Star, ChevronLeft, ChevronRight, CheckCircle, Calendar, GraduationCap, Award, MapPin } from 'lucide-react';
import { Newsletter } from '../Newsletter';

interface DoctorsPageProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onOpenAppointment: (unit?: string, specialty?: string, doctor?: string) => void;
  onNavigateHome: () => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onSelectDoctor,
  onOpenAppointment,
  onNavigateHome,
}) => {
  // Reviews data identical to institutional standard
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
      {/* 1. HERO BREADCRUMB BANNER (Faithful to image_e11a5385.png) */}
      <section className="relative h-72 sm:h-84 md:h-96 lg:h-[420px] w-full overflow-hidden flex items-center bg-[#004d5a]">
        {/* Banner Background Image with Dr. Alexandre positioned at top to reveal his face */}
        <img
          src={IMAGES.aboutPage.drAlexandreConsultation}
          alt="Corpo Clínico do Hospital de Olhos Freitag Munareto"
          className="absolute inset-0 w-full h-full object-cover object-[center_top] sm:object-[center_8%]"
        />

        {/* Ambient Dark/Teal Overlay Gradient (Fade to teal on the left for crisp typography, clear on the right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#004d5a] via-[#004d5a]/75 sm:via-[#004d5a]/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full text-left space-y-2 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Corpo Clínico
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
            <span className="text-teal-200 font-normal">Corpo Clínico</span>
          </nav>
        </div>
      </section>

      {/* 2. DOCTORS GRID (Exact reproduction of image_e11a5385.png) */}
      <section className="py-20 lg:py-24 bg-white transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 items-stretch">
            {DOCTORS.map((doctor) => (
              <div
                key={doctor.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 justify-between"
              >
                <div>
                  {/* Doctor Photo Box with Hospital Symbol Watermark */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={doctor.photoUrl || IMAGES.doctors.alexandreFreitag.url}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top transform transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  {/* Doctor Name */}
                  <h2 className="text-xl sm:text-[22px] font-bold text-[#004d5a] tracking-tight mt-6 mb-2 leading-snug">
                    {doctor.name}
                  </h2>

                  {/* Subtitle in Terracotta */}
                  {doctor.subtitle && (
                    <p className="text-sm sm:text-[15px] text-[#be7b52] font-medium leading-snug mb-5">
                      {doctor.subtitle}
                    </p>
                  )}

                  {/* Curriculum Details */}
                  {doctor.curriculum && (
                    <div className="space-y-3 text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      {doctor.curriculum.map((item, idx) => (
                        <p key={idx} className="flex items-start gap-2">
                          <span className="text-teal-600 mt-0.5">•</span>
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Unit Attendance */}
                  {doctor.unitAttendance && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-[#004d5a]">
                      <MapPin className="w-3.5 h-3.5 text-[#be7b52] shrink-0" />
                      <span>{doctor.unitAttendance}</span>
                    </div>
                  )}
                </div>

                {/* Appointment Action */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => onOpenAppointment('Timbó', 'Consulta Geral', doctor.name)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#004d5a] hover:bg-[#be7b52] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar com {doctor.name.split(' ')[0]} {doctor.name.split(' ')[1]}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. AVALIAÇÕES DO GOOGLE COM MAPA PONTILHADO */}
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
