import React, { useState } from 'react';
import { Logo } from './Logo';
import { HOSPITAL_INFO } from '../data/content';
import { Mail, ChevronUp, X } from 'lucide-react';

interface FooterProps {
  onOpenAppointment: () => void;
  onNavigateAbout?: () => void;
  onNavigateSpecialties?: () => void;
  onNavigateDoctors?: () => void;
  onNavigateContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAppointment,
  onNavigateAbout,
  onNavigateSpecialties,
  onNavigateDoctors,
  onNavigateContact,
}) => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#004d5a] text-white pt-16 transition-colors relative overflow-hidden font-['Jost',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Main 3 Columns - Faithful to freitagmunareto.com.br official reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 pb-16">
            {/* Column 1: Fale Conosco */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white tracking-wide">
                Fale Conosco
              </h4>
              <div className="w-6 h-[2px] bg-[#be7b52]" />

              <div className="space-y-3.5 text-sm text-teal-50 font-normal pt-2">
                <a
                  href="https://wa.me/554733820266"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  {/* Official WhatsApp SVG */}
                  <svg
                    className="w-4 h-4 text-teal-200 group-hover:text-emerald-300 transition-colors shrink-0 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>(47) 3382-0266</span>
                </a>

                <a
                  href="https://wa.me/554733066699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-4 h-4 text-teal-200 group-hover:text-emerald-300 transition-colors shrink-0 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>(47) 3306-6699</span>
                </a>

                <a
                  href={`mailto:${HOSPITAL_INFO.email}`}
                  className="flex items-center gap-2.5 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-teal-200 group-hover:text-amber-300 transition-colors shrink-0" />
                  <span className="truncate">{HOSPITAL_INFO.email}</span>
                </a>
              </div>
            </div>

            {/* Column 2: Institucional */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white tracking-wide">
                Institucional
              </h4>
              <div className="w-6 h-[2px] bg-[#be7b52]" />

              <ul className="space-y-3 text-sm text-teal-50 pt-2 font-normal">
                <li>
                  <a
                    href="/sobre"
                    onClick={(e) => {
                      if (onNavigateAbout) {
                        e.preventDefault();
                        onNavigateAbout();
                      }
                    }}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Sobre a HOFM</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/corpo-clinico"
                    onClick={(e) => {
                      if (onNavigateDoctors) {
                        e.preventDefault();
                        onNavigateDoctors();
                      }
                    }}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Corpo Clínico</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/especialidades"
                    onClick={(e) => {
                      if (onNavigateSpecialties) {
                        e.preventDefault();
                        onNavigateSpecialties();
                      }
                    }}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Especialidades</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/fale-conosco"
                    onClick={(e) => {
                      if (onNavigateContact) {
                        e.preventDefault();
                        onNavigateContact();
                      }
                    }}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Fale Conosco</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Links Úteis */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white tracking-wide">
                Links úteis
              </h4>
              <div className="w-6 h-[2px] bg-[#be7b52]" />

              <ul className="space-y-3 text-sm text-teal-50 pt-2 font-normal">
                <li>
                  <button
                    onClick={() => setPrivacyModalOpen(true)}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Politica de privacidade</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenAppointment}
                    className="inline-flex items-center gap-2 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Agendamentos</span>
                  </button>
                </li>
                <li>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Hospital+de+Olhos+Freitag+Munareto+Timb%C3%B3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                    title="Ver avaliações no Google Maps (Abre em nova guia)"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-300/70 inline-block rounded-none shrink-0" />
                    <span>Avaliações</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Matches image_1a5b167a.png */}
        <div className="border-t border-teal-600/30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between">
            {/* White Logo Box (bottom-left corner exactly like official site) */}
            <div className="bg-white px-8 py-7 sm:px-10 sm:py-8 flex items-center justify-center md:justify-start shrink-0 shadow-sm">
              <Logo variant="light" />
            </div>

            {/* Center: Copyright Notice */}
            <div className="px-6 py-4 md:py-0 text-center text-xs text-teal-100/90 font-normal">
              <p>© Hospital de Olhos Freitag {currentYear} all rights reserved</p>
            </div>

            {/* Right: Agency Credit & Official Social Media Icons */}
            <div className="px-6 py-4 md:py-0 flex items-center justify-center md:justify-end gap-6 text-xs text-teal-100/90">
              <span className="font-normal text-teal-100/80">
                <a
                  href="https://agencia.monarcahub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors"
                >
                  Desenvolvido por MonarcaHub
                </a>
              </span>

              {/* Official Social Media Buttons */}
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href={HOSPITAL_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Oficial"
                  className="w-8 h-8 rounded-full bg-[#003d47] hover:bg-[#be7b52] text-teal-100 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={HOSPITAL_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Oficial"
                  className="w-8 h-8 rounded-full bg-[#003d47] hover:bg-[#be7b52] text-teal-100 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={HOSPITAL_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Oficial"
                  className="w-8 h-8 rounded-full bg-[#003d47] hover:bg-[#be7b52] text-teal-100 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>

              {/* Scroll to top button */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full border border-teal-500/60 bg-[#003842] hover:bg-[#be7b52] text-white flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0 ml-1"
                title="Voltar ao topo da página"
                aria-label="Voltar ao topo da página"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-100 shadow-2xl relative my-8 text-slate-800">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Fechar política de privacidade"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-[#be7b52]">LGPD & PRIVACIDADE</span>
                <h3 className="text-2xl font-bold text-[#004d5a]">
                  Política de Privacidade
                </h3>
              </div>

              <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  O Hospital de Olhos Freitag Munareto preza pela privacidade e proteção de dados pessoais de seus pacientes e visitantes, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
                </p>
                <p>
                  <strong>1. Coleta de Informações:</strong> Coletamos dados estritamente necessários para contato, agendamento de consultas e prontuário médico em ambiente seguro e protegido por sigilo profissional.
                </p>
                <p>
                  <strong>2. Finalidade:</strong> Seus dados de contato (nome, telefone e e-mail) são utilizados unicamente para retorno de solicitações de consultas e comunicados institucionais com seu consentimento.
                </p>
                <p>
                  <strong>3. Direitos do Titular:</strong> Você tem o direito de solicitar a confirmação, retificação ou exclusão de seus dados a qualquer momento entrando em contato pelo e-mail <em>adm@freitagmunareto.com.br</em>.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setPrivacyModalOpen(false)}
                  className="bg-[#004d5a] hover:bg-[#003842] text-white px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Entendi e Aceito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
