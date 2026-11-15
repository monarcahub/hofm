import React, { useState } from 'react';
import { IMAGES } from '../../config/images';
import { HOSPITAL_INFO } from '../../data/content';
import { Newsletter } from '../Newsletter';
import {
  MapPin,
  Mail,
  CheckCircle,
  Copy,
  ExternalLink,
  Star,
  Send,
  MessageSquare,
  AlertCircle,
  Clock,
  Phone,
} from 'lucide-react';

interface ContactPageProps {
  onNavigateHome: () => void;
  onOpenAppointment?: (unit?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
}) => {
  // Tabs: 'whatsapp' or 'email'
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email'>('whatsapp');

  // WhatsApp Tab State
  const [waName, setWaName] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waSubject, setWaSubject] = useState('Consulta de rotina');
  const [waUnit, setWaUnit] = useState('Timbó');
  const [waMessage, setWaMessage] = useState('');
  const [waError, setWaError] = useState('');

  // E-mail Tab State
  const [emailName, setEmailName] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);

  // Character limit for WhatsApp URL safety (standard safe URL length)
  const MAX_WA_CHARS = 1000;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(HOSPITAL_INFO.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 3000);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waName.trim()) {
      setWaError('Por favor, informe seu nome completo.');
      return;
    }
    if (!waMessage.trim()) {
      setWaError('Por favor, digite sua mensagem.');
      return;
    }

    setWaError('');

    const formattedText = `*Contato via Site HOFM*\n\n*Nome:* ${waName.trim()}\n*Telefone:* ${waPhone.trim() || 'Não informado'}\n*Unidade:* ${waUnit}\n*Assunto:* ${waSubject}\n\n*Mensagem:*\n${waMessage.trim()}`;
    const targetNumber = '5547992626100'; // Official WhatsApp central HOFM
    const encoded = encodeURIComponent(formattedText);
    const waUrl = `https://wa.me/${targetNumber}?text=${encoded}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectLine = emailSubject.trim()
      ? `[Contato HOFM] ${emailSubject.trim()} - ${emailName.trim() || 'Paciente'}`
      : `[Contato HOFM] Mensagem de ${emailName.trim() || 'Paciente'}`;

    const bodyText = `Nome: ${emailName.trim() || 'Não informado'}\n\nMensagem:\n${emailMessage.trim() || 'Gostaria de informações sobre atendimento no Hospital de Olhos Freitag Munareto.'}`;

    const mailtoUrl = `mailto:${HOSPITAL_INFO.email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  };

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
      {/* 1. HERO BREADCRUMB BANNER (Matches image_a49e4bd1.png) */}
      <section className="relative h-72 sm:h-80 md:h-96 lg:h-[400px] w-full overflow-hidden flex items-center bg-[#004d5a]">
        {/* Banner Background Image with caring hands */}
        <img
          src={IMAGES.contactPage?.bannerBackground || '/assets/banners/caring-hands-banner.jpg'}
          alt="Hospital de Olhos Freitag Munareto - Fale Conosco"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Ambient Dark/Teal Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#004d5a]/90 via-[#004d5a]/65 to-[#004d5a]/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full text-left space-y-2 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Fale conosco
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
            <span className="text-teal-200 font-normal">Contato</span>
          </nav>
        </div>
      </section>

      {/* 2. THREE CONTACT PILLARS SECTION (Faithful to image_a49e4bd1.png) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              DÚVIDAS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              Entre em contato conosco.
            </h2>
          </div>

          {/* 3 Columns Grid with vertical separators on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Column 1: Nossas Unidades */}
            <div className="flex flex-col items-center text-center p-6 sm:p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#be7b52] text-white flex items-center justify-center shadow-md">
                <MapPin className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="text-xl font-bold text-[#004d5a]">Nossas Unidades</h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 max-w-xs text-left">
                <a
                  href="https://maps.google.com/?q=R.+Germano+Brandes+Senior+726+Timbo+SC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-[#004d5a] transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#be7b52] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>
                    <strong className="font-semibold text-slate-800">Timbó:</strong> R. Germano Brandes Sênior, 726 - Centro, Timbó - SC, 89120-000
                  </span>
                </a>

                <a
                  href="https://maps.google.com/?q=R.+dos+Atiradores+13+Pomerode+SC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-[#004d5a] transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-[#be7b52] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>
                    <strong className="font-semibold text-slate-800">Pomerode:</strong> R. dos Atiradores, 13 - Sl 2 - Centro, Pomerode - SC, 89107-000
                  </span>
                </a>
              </div>
            </div>

            {/* Column 2: Telefones */}
            <div className="flex flex-col items-center text-center p-6 sm:p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#be7b52] text-white flex items-center justify-center shadow-md">
                <Phone className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="text-xl font-bold text-[#004d5a]">Telefones</h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <a
                  href="https://wa.me/554733820266"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:text-[#004d5a] transition-colors group"
                >
                  <svg
                    className="w-4 h-4 text-[#be7b52] group-hover:text-emerald-600 transition-colors shrink-0 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Timbó: <strong className="font-semibold text-slate-800">(47) 3382-0266</strong></span>
                </a>

                <a
                  href="https://wa.me/5547992626100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:text-[#004d5a] transition-colors group"
                >
                  <svg
                    className="w-4 h-4 text-[#be7b52] group-hover:text-emerald-600 transition-colors shrink-0 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp: <strong className="font-semibold text-slate-800">(47) 99262-6100</strong></span>
                </a>

                <a
                  href="https://wa.me/554733066699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:text-[#004d5a] transition-colors group"
                >
                  <svg
                    className="w-4 h-4 text-[#be7b52] group-hover:text-emerald-600 transition-colors shrink-0 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Pomerode: <strong className="font-semibold text-slate-800">(47) 3306-6699</strong></span>
                </a>
              </div>
            </div>

            {/* Column 3: E-mail */}
            <div className="flex flex-col items-center text-center p-6 sm:p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#be7b52] text-white flex items-center justify-center shadow-md">
                <Mail className="w-8 h-8 stroke-[1.8]" />
              </div>

              <h3 className="text-xl font-bold text-[#004d5a]">E-mail</h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <a
                  href={`mailto:${HOSPITAL_INFO.email}`}
                  className="font-medium text-slate-800 hover:text-[#004d5a] transition-colors underline decoration-slate-300 hover:decoration-[#004d5a]"
                >
                  {HOSPITAL_INFO.email}
                </a>

                <div>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar e-mail</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GOOGLE MAPS SECTION (Faithful to image_f2721399.png) */}
      <section className="py-14 sm:py-16 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Map Card 1: Timbó */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Card Header info (Matches screenshot badge) */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#004d5a]">
                      Hospital de Olhos Freitag Munareto - Unidade Timbó
                    </h3>
                    <p className="text-xs text-slate-500">
                      R. Germano Brandes Sênior, 726 - Centro, Timbó - SC, 89120-000, Brasil
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-600 pt-1">
                      <span className="font-bold text-slate-900">4,9</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <span className="text-slate-400">(114 avaliações no Google)</span>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=R.+Germano+Brandes+Senior+726+Timbo+SC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir no Maps</span>
                  </a>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative w-full h-72 sm:h-80 bg-slate-100">
                <iframe
                  title="Mapa Hospital de Olhos Freitag Munareto Timbó"
                  src="https://maps.google.com/maps?q=R.+Germano+Brandes+Senior+726+Timbo+SC&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  aria-label="Localização da unidade de Timbó no Google Maps"
                />
              </div>
            </div>

            {/* Map Card 2: Pomerode */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Card Header info (Matches screenshot badge) */}
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#004d5a]">
                      Hospital de Olhos Freitag Munareto - Unidade Pomerode
                    </h3>
                    <p className="text-xs text-slate-500">
                      R. dos Atiradores, 13 - Sl 2 - Centro, Pomerode - SC, 89107-000, Brasil
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-600 pt-1">
                      <span className="font-bold text-slate-900">5,0</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        ))}
                      </div>
                      <span className="text-slate-400">(247 avaliações no Google)</span>
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=R.+dos+Atiradores+13+Pomerode+SC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir no Maps</span>
                  </a>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative w-full h-72 sm:h-80 bg-slate-100">
                <iframe
                  title="Mapa Hospital de Olhos Freitag Munareto Pomerode"
                  src="https://maps.google.com/maps?q=R.+dos+Atiradores+13+Pomerode+SC&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  aria-label="Localização da unidade de Pomerode no Google Maps"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE MESSAGING FORM WITH TABS (Guia: WhatsApp vs E-mail) */}
      <section className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Section Heading (Faithful to image_f2721399.png) */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              Preencha o formulário
            </h2>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#be7b52] uppercase">
              E NOSSA EQUIPE ENTRARÁ EM CONTATO
            </p>
          </div>

          {/* Tab Selector / Guia */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`inline-flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'whatsapp'
                    ? 'bg-[#004d5a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#004d5a] hover:bg-white/60'
                }`}
              >
                {/* Official WhatsApp SVG Icon */}
                <svg
                  className={`w-4 h-4 fill-current shrink-0 ${activeTab === 'whatsapp' ? 'text-emerald-400' : 'text-slate-500'}`}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Enviar mensagem no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`inline-flex items-center gap-2.5 px-5 sm:px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'email'
                    ? 'bg-[#004d5a] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#004d5a] hover:bg-white/60'
                }`}
              >
                <Mail className={`w-4 h-4 ${activeTab === 'email' ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>Enviar e-mail</span>
              </button>
            </div>
          </div>

          {/* TAB 1: WHATSAPP FORM */}
          {activeTab === 'whatsapp' && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs transition-all">
              <form onSubmit={handleSendWhatsApp} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Nome Completo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva"
                      value={waName}
                      onChange={(e) => setWaName(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent placeholder:text-slate-400 bg-slate-50/50"
                    />
                  </div>

                  {/* WhatsApp / Telefone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      WhatsApp com DDD
                    </label>
                    <input
                      type="tel"
                      placeholder="Ex: (47) 99262-6100"
                      value={waPhone}
                      onChange={(e) => setWaPhone(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent placeholder:text-slate-400 bg-slate-50/50"
                    />
                  </div>

                  {/* Unidade */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Unidade de Atendimento
                    </label>
                    <select
                      value={waUnit}
                      onChange={(e) => setWaUnit(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent bg-slate-50/50 text-slate-800"
                    >
                      <option value="Timbó">Unidade Timbó (R. Germano Brandes Sênior, 726)</option>
                      <option value="Pomerode">Unidade Pomerode (R. dos Atiradores, 13)</option>
                    </select>
                  </div>

                  {/* Assunto */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Assunto / Procedimento
                    </label>
                    <select
                      value={waSubject}
                      onChange={(e) => setWaSubject(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent bg-slate-50/50 text-slate-800"
                    >
                      <option value="Consulta de rotina">Consulta oftalmológica de rotina</option>
                      <option value="Cirurgia de Catarata">Cirurgia de Catarata</option>
                      <option value="Ceratocone / Crosslinking">Ceratocone e Crosslinking</option>
                      <option value="Atendimento Infantil">Atendimento Oftalmológico Infantil</option>
                      <option value="Exames Complementares">Exames complementares e laudos</option>
                      <option value="Convênios">Dúvidas sobre Convênios</option>
                      <option value="Outro assunto">Outro assunto</option>
                    </select>
                  </div>
                </div>

                {/* Sua mensagem com contador e limite de segurança para WhatsApp */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Sua mensagem <span className="text-rose-500">*</span>
                    </label>
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        waMessage.length > MAX_WA_CHARS * 0.9 ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    >
                      {waMessage.length}/{MAX_WA_CHARS} caracteres
                    </span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    maxLength={MAX_WA_CHARS}
                    placeholder="Escreva sua dúvida, sintomas ou o melhor horário para entrarmos em contato..."
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent placeholder:text-slate-400 bg-slate-50/50 resize-y"
                  />
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Limite máximo seguro de 1.000 caracteres para compatibilidade imediata com a URL do WhatsApp.</span>
                  </p>
                </div>

                {waError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{waError}</span>
                  </div>
                )}

                {/* Submit button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-4 h-4 text-[#004d5a] shrink-0" />
                    <span>Atendimento de Segunda a Sexta: 08:00 às 18:00</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 fill-current shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Enviar pelo WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: E-MAIL DIRECT / FORM */}
          {activeTab === 'email' && (
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs transition-all space-y-6">
              {/* Informative Header */}
              <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-[#004d5a] uppercase tracking-wide">
                    E-mail oficial da administração HOFM
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {HOSPITAL_INFO.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    {emailCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">E-mail copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Copiar endereço</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${HOSPITAL_INFO.email}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#004d5a] text-white hover:bg-[#003943] transition-colors shadow-2xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Abrir e-mail direto</span>
                  </a>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSendEmail} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: João Souza"
                      value={emailName}
                      onChange={(e) => setEmailName(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent placeholder:text-slate-400 bg-slate-50/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Assunto da Mensagem
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dúvida sobre exames e agendamento"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent placeholder:text-slate-400 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sua mensagem
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Escreva sua solicitação para a administração..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004d5a] focus:border-transparent placeholder:text-slate-400 bg-slate-50/50 resize-y"
                  />
                  <p className="text-[11px] text-slate-400">
                    Ao clicar no botão abaixo, o formulário abrirá seu aplicativo de e-mail padrão já preenchido.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#004d5a] hover:bg-[#003943] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar E-mail (Abrir aplicativo)</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* 5. AVALIAÇÕES GOOGLE SECTION (Matches institutional standard) */}
      <section className="py-20 lg:py-24 bg-white border-t border-slate-100 relative overflow-hidden">
        {/* Subtle Map dots background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 1000 500" fill="currentColor">
            <pattern id="contact-map-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" />
            </pattern>
            <rect width="1000" height="500" fill="url(#contact-map-dots)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#be7b52]">
              AVALIAÇÕES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004d5a] tracking-tight">
              O que os clientes falam sobre a HOFM
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Nossos pacientes são a maior prova do nosso compromisso com a excelência. Veja o que dizem aqueles que confiaram sua saúde ocular ao Hospital de Olhos Freitag Munareto.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Google Score Summary Column */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="p-6 text-center w-full max-w-xs">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  BOM
                </h3>
                <div className="flex items-center justify-center gap-1 text-amber-400 my-2" aria-label="Avaliação 5 estrelas">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Com base em <strong className="text-slate-800">461 avaliações</strong>
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Avaliações do</span>
                  <span className="font-bold text-[#4285F4]">G</span>
                  <span className="font-bold text-[#EA4335]">o</span>
                  <span className="font-bold text-[#FBBC05]">o</span>
                  <span className="font-bold text-[#4285F4]">g</span>
                  <span className="font-bold text-[#34A853]">l</span>
                  <span className="font-bold text-[#EA4335]">e</span>
                </div>
              </div>
            </div>

            {/* Individual Review Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {reviewsData.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#be7b52]/15 text-[#be7b52] font-bold text-xs flex items-center justify-center">
                        {rev.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{rev.name}</p>
                        <p className="text-[10px] text-slate-400">{rev.timeAgo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SECTION */}
      <Newsletter />
    </div>
  );
};
