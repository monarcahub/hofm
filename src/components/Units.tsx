import React from 'react';
import { UNITS } from '../data/content';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Navigation } from 'lucide-react';

interface UnitsProps {
  onOpenAppointment: (defaultUnit?: string) => void;
}

export const Units: React.FC<UnitsProps> = ({ onOpenAppointment }) => {
  return (
    <section id="unidades" className="py-20 lg:py-28 bg-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
            NOSSAS UNIDADES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
            Timbó e Pomerode
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Duas unidades estrategicamente posicionadas no Vale do Itajaí com infraestrutura moderna, salas de exames e atendimento personalizado.
          </p>
        </div>

        {/* Units Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {UNITS.map((unit) => (
            <div
              key={unit.id}
              className="bg-[#F8FAFB] rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with City & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#be7b52] uppercase tracking-wider">
                      Santa Catarina
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#004d5a] tracking-tight">
                      Unidade {unit.city}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#004d5a] flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-[#be7b52]" />
                  </div>
                </div>

                {/* Details List */}
                <div className="space-y-4 text-sm text-slate-600">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#004d5a] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{unit.address}</p>
                      <p className="text-xs text-slate-500">CEP {unit.cep} · {unit.city} - SC</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#004d5a] shrink-0" />
                    <div>
                      <a
                        href={`tel:${unit.phone.replace(/[^0-9]/g, '')}`}
                        className="font-bold text-slate-900 hover:text-[#004d5a] transition-colors"
                      >
                        {unit.phone}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#004d5a] shrink-0" />
                    <div>
                      <p className="font-medium">{unit.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={unit.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 bg-[#004d5a] hover:bg-[#003842] text-white py-3 px-4 rounded-xl font-bold text-xs tracking-tight transition-colors shadow-xs"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Como Chegar</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <button
                  onClick={() => onOpenAppointment(unit.city)}
                  className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-[#be7b52] hover:text-[#be7b52] py-3 px-4 rounded-xl font-bold text-xs tracking-tight transition-colors cursor-pointer bg-white text-slate-800"
                >
                  <MessageSquare className="w-4 h-4 text-[#be7b52]" />
                  <span>Agendar em {unit.city}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
