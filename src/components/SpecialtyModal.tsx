import React from 'react';
import { Specialty } from '../data/content';
import { X, CheckCircle2, Calendar, ShieldCheck, Info } from 'lucide-react';

interface SpecialtyModalProps {
  specialty: Specialty | null;
  onClose: () => void;
  onBookAppointment: (specialtyTitle: string) => void;
}

export const SpecialtyModal: React.FC<SpecialtyModalProps> = ({
  specialty,
  onClose,
  onBookAppointment,
}) => {
  if (!specialty) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="specialty-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-100 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Fechar detalhes da especialidade"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#be7b52]">
              ESPECIALIDADE OFTALMOLÓGICA
            </span>
            <h3 id="specialty-modal-title" className="text-2xl font-bold text-[#004d5a]">
              {specialty.title}
            </h3>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {specialty.fullDescription}
          </p>

          {/* Highlights */}
          <div className="bg-[#F8FAFB] p-5 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#004d5a] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#be7b52]" />
              <span>Diferenciais deste procedimento:</span>
            </h4>
            <ul className="space-y-2">
              {specialty.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-[#004d5a] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Indications */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs text-amber-900">
            <Info className="w-4 h-4 text-[#be7b52] shrink-0 mt-0.5" />
            <p>
              <strong>Indicação:</strong> {specialty.indications}
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Voltar à página
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(specialty.title);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#be7b52] hover:bg-[#aa6840] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar para esta especialidade</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
