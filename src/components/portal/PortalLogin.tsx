import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/supabase';
import { Lock, Mail, Phone, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff, UserCheck, Stethoscope, X, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../../config/images';

interface PortalLoginProps {
  onSuccess: (role: UserRole) => void;
  onNavigateHome: () => void;
  onRequestPasswordReset: () => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  onSuccess,
  onNavigateHome,
  onRequestPasswordReset,
}) => {
  const { login, loginPatient } = useAuth();
  const [loginMode, setLoginMode] = useState<'patient' | 'staff'>('patient');

  // Patient state (Email or Phone with DDD + 8-char Internal Identifier)
  const [patientIdentifier, setPatientIdentifier] = useState('');
  const [patientAccessCode, setPatientAccessCode] = useState('');
  const [showPatientCode, setShowPatientCode] = useState(false);

  // Staff state (Email + Password)
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Patient Code Recovery Modal State
  const [showCodeRecoveryModal, setShowCodeRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryFeedback, setRecoveryFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleRequestPatientCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) return;

    setRecoveryLoading(true);
    setRecoveryFeedback(null);

    try {
      const res = await fetch('/api/auth/request-patient-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });
      const data = await res.json();
      setRecoveryFeedback({
        success: res.ok && (data.success ?? true),
        message:
          data.message ||
          data.error ||
          'Se este e-mail estiver cadastrado em nosso sistema, seu Código Identificador será enviado em instantes.',
      });
    } catch {
      setRecoveryFeedback({
        success: false,
        message: 'Não foi possível enviar a solicitação agora. Tente novamente em instantes ou contate pelo WhatsApp.',
      });
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleModeSwitch = (mode: 'patient' | 'staff') => {
    setLoginMode(mode);
    setErrorMessage('');
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanIdentifier = patientIdentifier.trim();
    const cleanCode = patientAccessCode.trim();

    if (!cleanIdentifier || !cleanCode) {
      setErrorMessage('Por favor, informe seu e-mail ou telefone com DDD e o código identificador.');
      return;
    }

    if (!cleanIdentifier.includes('@') && cleanIdentifier.replace(/\D/g, '').length < 10) {
      setErrorMessage('Informe um e-mail válido ou o telefone completo com DDD (ex: (47) 99999-9999).');
      return;
    }

    setLoading(true);
    const res = await loginPatient(cleanIdentifier, cleanCode);
    setLoading(false);

    if (res.success && res.role) {
      onSuccess(res.role);
    } else {
      setErrorMessage(
        res.error || 'E-mail/telefone ou código identificador inválidos. Verifique os dados informados.'
      );
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!staffEmail || !staffPassword) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    const res = await login(staffEmail, staffPassword);
    setLoading(false);

    if (res.success && res.role) {
      onSuccess(res.role);
    } else {
      setErrorMessage(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f0f2f5]/40 font-['Jost',sans-serif]">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-slate-200/80">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="flex justify-center mb-2">
            <img
              src={IMAGES.logo.header}
              alt="Hospital de Olhos Freitag Munareto"
              className="h-14 sm:h-16 w-auto object-contain"
            />
          </div>
          <span className="block text-[11px] font-semibold tracking-widest text-[#be7b52] uppercase">
            PORTAL INSTITUCIONAL
          </span>
          <h2 className="text-2xl font-bold text-[#004d5a] tracking-tight">
            {loginMode === 'patient' ? 'Portal do Paciente' : 'Área da Equipe'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {loginMode === 'patient'
              ? 'Consulte seus exames e laudos oftalmológicos usando seu e-mail ou telefone com DDD e o código identificador.'
              : 'Identifique-se com suas credenciais administrativas ou médicas para acessar o painel.'}
          </p>
        </div>

        {/* Access Mode Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200/70">
          <button
            type="button"
            onClick={() => handleModeSwitch('patient')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              loginMode === 'patient'
                ? 'bg-white text-[#004d5a] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sou Paciente</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('staff')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              loginMode === 'staff'
                ? 'bg-white text-[#004d5a] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Equipe / Médicos</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {loginMode === 'patient' ? (
          /* PATIENT LOGIN FORM (Email OR Phone with DDD + 8-char Internal Identifier) */
          <form onSubmit={handlePatientSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail ou Telefone com DDD
              </label>
              <div className="relative">
                {patientIdentifier.includes('@') || !patientIdentifier ? (
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                ) : (
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                )}
                <input
                  type="text"
                  required
                  value={patientIdentifier}
                  onChange={(e) => setPatientIdentifier(e.target.value)}
                  placeholder="seu.email@exemplo.com ou (47) 99999-9999"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Código Identificador
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPatientCode ? 'text' : 'password'}
                  required
                  value={patientAccessCode}
                  onChange={(e) => setPatientAccessCode(e.target.value.toUpperCase())}
                  placeholder="Código de 8 dígitos (ex: A7K9M2P4)"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm font-mono tracking-wider rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPatientCode(!showPatientCode)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPatientCode ? 'Ocultar código' : 'Ver código'}
                >
                  {showPatientCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Código de 8 caracteres (letras e números) entregue pela recepção no seu cadastro.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004d5a] hover:bg-[#003842] text-white py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm tracking-tight transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Acessar Meus Exames</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500 pt-1 leading-relaxed">
              Não possui seu código?{' '}
              <button
                type="button"
                onClick={() => {
                  setRecoveryEmail(patientIdentifier.includes('@') ? patientIdentifier.trim() : '');
                  setRecoveryFeedback(null);
                  setShowCodeRecoveryModal(true);
                }}
                className="font-semibold text-[#be7b52] hover:text-[#a66640] underline cursor-pointer"
              >
                Clique aqui para solicitar por e-mail
              </button>{' '}
              ou peça na recepção pelo{' '}
              <a
                href={`https://wa.me/554733820266?text=${encodeURIComponent(
                  'Olá! Esqueci meu Código Identificador para ver os exames no Portal do Paciente'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:text-emerald-800 underline"
              >
                WhatsApp
              </a>
            </p>
          </form>
        ) : (
          /* STAFF / DOCTORS LOGIN FORM */
          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="seu.email@freitagmunareto.com.br"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={onRequestPasswordReset}
                  className="text-[11px] font-semibold text-[#be7b52] hover:underline cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showStaffPassword ? 'text' : 'password'}
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowStaffPassword(!showStaffPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showStaffPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004d5a] hover:bg-[#003842] text-white py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm tracking-tight transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Return to Institutional Site */}
        <div className="text-center pt-4 border-t border-slate-100">
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-slate-500 hover:text-[#004d5a] transition-colors cursor-pointer"
          >
            ← Voltar ao site institucional
          </button>
        </div>
      </div>

      {/* Patient Access Code Recovery Modal */}
      {showCodeRecoveryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-4">
            <button
              type="button"
              onClick={() => {
                setShowCodeRecoveryModal(false);
                setRecoveryFeedback(null);
              }}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#be7b52]">
                RECUPERAÇÃO DE ACESSO
              </span>
              <h3 className="text-xl font-bold text-[#004d5a]">
                Solicitar Código Identificador
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Informe o e-mail cadastrado em seu atendimento. Enviaremos seu Código Identificador de 8 dígitos para acesso ao Portal do Paciente.
              </p>
            </div>

            {recoveryFeedback ? (
              <div className="space-y-4 pt-2">
                <div
                  className={`p-4 rounded-2xl flex items-start gap-3 text-xs border ${
                    recoveryFeedback.success
                      ? 'bg-teal-50 border-teal-200 text-[#004d5a]'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {recoveryFeedback.success ? (
                    <CheckCircle2 className="w-5 h-5 text-[#004d5a] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium leading-relaxed">{recoveryFeedback.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryFeedback(null);
                    setShowCodeRecoveryModal(false);
                  }}
                  className="w-full bg-[#004d5a] hover:bg-[#003842] text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestPatientCode} className="space-y-4 pt-2">
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
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004d5a]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCodeRecoveryModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="bg-[#004d5a] hover:bg-[#003842] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {recoveryLoading ? 'Enviando...' : 'Enviar Código por E-mail'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
