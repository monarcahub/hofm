import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    const res = await requestPasswordReset(email);
    setIsSubmitting(false);
    setFeedback({
      success: res.success,
      message: res.message,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#be7b52]">
            RECUPERAÇÃO DE ACESSO
          </span>
          <h3 className="text-xl font-bold text-[#004d5a]">
            Redefinir Senha
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Informe o e-mail cadastrado em seu prontuário ou conta profissional. Enviaremos um link seguro para cadastrar uma nova senha.
          </p>
        </div>

        {feedback ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-[#004d5a]">
              <CheckCircle2 className="w-5 h-5 text-[#004d5a] shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{feedback.message}</p>
            </div>
            <button
              onClick={() => {
                setFeedback(null);
                onClose();
              }}
              className="w-full bg-[#004d5a] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Seu e-mail cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@paciente.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#004d5a] hover:bg-[#003842] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
