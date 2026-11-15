import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setFeedback('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setStatus('success');
    setFeedback('Obrigado! Seu e-mail foi cadastrado com sucesso para receber novidades sobre saúde ocular.');
    setEmail('');
  };

  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 -mb-12">
      <div className="bg-[#be7b52] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Headline */}
          <div className="lg:col-span-6">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Cadastre seu email <br className="hidden sm:inline" />
              e receber novidades.
            </h3>
            <p className="text-sm text-white/90 mt-2">
              Dicas preventivas sobre saúde da visão, novidades em tratamentos e comunicados institucionais.
            </p>
          </div>

          {/* Form */}
          <div className="lg:col-span-6">
            {status === 'success' ? (
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-6 h-6 text-emerald-200 shrink-0" />
                <p className="text-sm font-medium">{feedback}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-lg">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Seu melhor email"
                    aria-label="Seu melhor email"
                    required
                    className="flex-1 px-4 py-3 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none rounded-xl"
                  />
                  <button
                    type="submit"
                    className="bg-[#004d5a] hover:bg-[#003842] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
                  >
                    <span>CADASTRAR</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-200 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{feedback}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
