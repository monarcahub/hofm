import React from 'react';
import { DOCTORS, Doctor } from '../data/content';
import { IMAGES } from '../config/images';
import { UserCheck, MapPin, Calendar, Stethoscope, Info } from 'lucide-react';

interface DoctorsProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onOpenAppointment: () => void;
  onNavigateDoctors?: () => void;
}

export const Doctors: React.FC<DoctorsProps> = ({
  onSelectDoctor,
  onOpenAppointment,
  onNavigateDoctors,
}) => {
  return (
    <section id="corpo-clinico" className="py-20 lg:py-28 bg-white transition-colors relative scroll-mt-12">
      <div id="medicos" className="absolute -top-16 left-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
            CORPO CLÍNICO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
            Nossos médicos
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Profissionais com dedicação integral à saúde ocular, combinando décadas de experiência clínica, avanços tecnológicos e respeito humano.
          </p>
        </div>

        {/* 3 Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {DOCTORS.map((doctor) => {
            const docImageConfig =
              doctor.id === 'dr-alexandre-freitag'
                ? IMAGES.doctors.alexandreFreitag
                : doctor.id === 'dr-lucas-leitis'
                ? IMAGES.doctors.lucasLeitis
                : IMAGES.doctors.mauricioMunareto;

            const hasRemoteImage = !!docImageConfig.url;

            return (
              <div
                key={doctor.id}
                className="group flex flex-col items-center text-center p-8 rounded-3xl bg-[#F8FAFB] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Doctor Avatar Circle Container with Teal Halo */}
                <div className="relative mb-6">
                  {/* Outer decorative ring */}
                  <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-[#004d5a]/20 via-teal-100 to-[#be7b52]/20 p-1 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white flex items-center justify-center relative">
                      {hasRemoteImage ? (
                        <img
                          src={docImageConfig.url}
                          alt={`Fotografia oficial de ${doctor.name}`}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        /* Identified Official Medical Placeholder - per prompt instruction */
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-slate-100 text-slate-400 p-4">
                          <Stethoscope className="w-12 h-12 text-[#004d5a] stroke-[1.5] mb-2 opacity-80" />
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center leading-tight">
                            Hospital de Olhos Freitag
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trust Icon Badge */}
                  <div className="absolute bottom-1 right-2 w-9 h-9 rounded-full bg-[#004d5a] text-white flex items-center justify-center shadow-md border-2 border-white">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Doctor Identification Card */}
                <div className="w-full bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-[#004d5a] transition-colors">
                      {doctor.name}
                    </h3>

                    {/* Role / Title */}
                    <p className="text-xs font-semibold text-[#be7b52] uppercase tracking-wide mb-2">
                      {doctor.role}
                    </p>

                    {/* Specialty details from original site */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {doctor.specialtyDetails}
                    </p>
                  </div>

                  {/* Units & Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#004d5a]" />
                      <span>Atendimento: {doctor.units.join(' e ')}</span>
                    </div>

                    <button
                      onClick={() => onSelectDoctor(doctor)}
                      className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:border-[#004d5a] text-xs font-bold text-[#004d5a] hover:bg-teal-50/50 transition-all cursor-pointer"
                    >
                      Ver detalhes e agendar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Link to full Corpo Clínico dedicated page */}
        {onNavigateDoctors && (
          <div className="text-center pt-10">
            <button
              onClick={onNavigateDoctors}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#004d5a] hover:text-[#be7b52] transition-colors cursor-pointer group"
            >
              <span>Conheça a formação e o histórico completo do Corpo Clínico</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
