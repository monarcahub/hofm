import React from 'react';
import { Doctor } from '../data/content';
import { IMAGES } from '../config/images';
import { X, Calendar, MapPin, Stethoscope, CheckCircle2 } from 'lucide-react';

interface DoctorModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctorName: string) => void;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  const docImageConfig =
    doctor.id === 'dr-alexandre-freitag'
      ? IMAGES.doctors.alexandreFreitag
      : doctor.id === 'dr-lucas-leitis'
      ? IMAGES.doctors.lucasLeitis
      : IMAGES.doctors.mauricioMunareto;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Fechar detalhes do médico"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-teal-50 border-2 border-teal-100/60 shadow-xs shrink-0 flex items-center justify-center">
              {docImageConfig?.url ? (
                <img
                  src={docImageConfig.url}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <Stethoscope className="w-7 h-7 text-[#be7b52]" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#be7b52]">
                {doctor.role}
              </span>
              <h3 id="doctor-modal-title" className="text-xl sm:text-2xl font-bold text-[#004d5a]">
                {doctor.name}
              </h3>
            </div>
          </div>

          <div className="bg-[#F8FAFB] p-4 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Áreas de Atuação e Especialidades:
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {doctor.specialtyDetails}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Locais de Atendimento:
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-[#004d5a] shrink-0" />
              <span>Unidades de {doctor.units.join(' e ')}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor.name);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#be7b52] hover:bg-[#aa6840] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar com {doctor.name.split(' ')[1]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
