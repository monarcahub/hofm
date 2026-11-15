import React, { useState, useEffect } from 'react';
import { DOCTORS } from '../data/content';
import { X, MessageSquare, Check, MapPin } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUnit?: string;
  defaultSpecialty?: string;
  defaultDoctor?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultUnit = 'Timbó',
  defaultSpecialty = 'Consulta de Rotina / Check-up',
  defaultDoctor = '',
}) => {
  const [unit, setUnit] = useState(defaultUnit);
  const [specialty, setSpecialty] = useState(defaultSpecialty);
  const [otherReason, setOtherReason] = useState('');
  const [doctor, setDoctor] = useState(defaultDoctor);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync state whenever the modal opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setUnit(defaultUnit || 'Timbó');
      setSpecialty(defaultSpecialty || 'Consulta de Rotina / Check-up');
      setDoctor(defaultDoctor || '');
      setOtherReason('');
      setSubmitted(false);
    }
  }, [isOpen, defaultUnit, defaultSpecialty, defaultDoctor]);

  if (!isOpen) return null;

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneTarget = unit === 'Pomerode' ? '554733066699' : '554733820266';

    // Determina o texto final do motivo/especialidade
    let resolvedReason = specialty;
    if (specialty === 'outro motivo') {
      resolvedReason = otherReason.trim()
        ? `Outro motivo (${otherReason.trim()})`
        : 'Outro motivo';
    }

    // Monta a mensagem completa com todos os campos preenchidos pelo usuário
    const messageLines = [
      'Olá! Gostaria de agendar um atendimento no Hospital de Olhos Freitag Munareto.',
      '',
      `*Nome:* ${name.trim() || 'Paciente'}`,
      `*Telefone / WhatsApp:* ${phone.trim() || 'A informar'}`,
      `*Unidade:* ${unit}`,
      `*Motivo / Especialidade:* ${resolvedReason}`,
    ];

    if (doctor && doctor.trim()) {
      messageLines.push(`*Médico de preferência:* ${doctor.trim()}`);
    }

    const fullMessage = messageLines.join('\n');
    const whatsappUrl = `https://wa.me/${phoneTarget}?text=${encodeURIComponent(fullMessage)}`;

    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 font-['Jost',sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-100 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar janela de agendamento"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#be7b52]">
                AGENDAMENTO RÁPIDO
              </span>
              <h3 id="appointment-modal-title" className="text-2xl font-bold text-[#004d5a]">
                Agende sua consulta
              </h3>
              <p className="text-xs text-slate-500">
                Escolha a unidade mais próxima e continue o atendimento com nossa equipe pelo WhatsApp oficial.
              </p>
            </div>

            <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
              {/* Unit Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Selecione a Unidade Desejada
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Timbó', 'Pomerode'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        unit === u
                          ? 'bg-[#004d5a] text-white border-[#004d5a] shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{u}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialty Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Motivo ou Especialidade
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a] cursor-pointer"
                >
                  <option value="Consulta Oftalmológica de Rotina">Consulta de Rotina / Check-up</option>
                  <option value="Cirurgia de Catarata">Cirurgia de Catarata</option>
                  <option value="Atendimento Oftalmológico Infantil">Oftalmologia Infantil</option>
                  <option value="Tratamento Moderno de Ceratocone">Ceratocone / Crosslinking</option>
                  <option value="Cirurgia Refrativa a Laser">Cirurgia Refrativa a Laser</option>
                  <option value="Exames Complementares">Exames Diagnósticos</option>
                  <option value="Adaptação de Lentes de Contato">Lentes de Contato</option>
                  <option value="outro motivo">outro motivo</option>
                </select>

                {/* Subcampo opcional para especificar quando escolher outro motivo */}
                {specialty === 'outro motivo' && (
                  <div className="mt-2.5 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Descreva brevemente o motivo (opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Consulta com queixas específicas, segunda opinião, laudo para concurso, etc."
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                    />
                  </div>
                )}
              </div>

              {/* Doctor Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. Preferência de Médico (Opcional)
                </label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a] cursor-pointer"
                >
                  <option value="">Sem preferência (primeiro horário disponível)</option>
                  {DOCTORS.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(47) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 bg-[#be7b52] hover:bg-[#aa6840] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Prosseguir no WhatsApp Oficial</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-2">
                Atendimento humanizado de segunda a sexta, das 08h às 18h.
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Encaminhado para a Recepção!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Sua solicitação para a <strong>Unidade {unit}</strong> foi preparada com todos os seus dados. Se a janela do WhatsApp não abriu automaticamente, entre em contato pelo telefone:
            </p>
            <div className="p-3 bg-teal-50 rounded-xl text-xs font-bold text-[#004d5a]">
              {unit === 'Pomerode' ? '(47) 3306-6699' : '(47) 3382-0266'}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 bg-[#004d5a] text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#003842] transition-colors"
            >
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
