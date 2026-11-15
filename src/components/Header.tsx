import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { HOSPITAL_INFO, NAV_LINKS } from '../data/content';
import { MapPin, Mail, Phone, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  onOpenAppointment: () => void;
  onNavigatePortal: () => void;
  currentPath?: string;
  onNavigateSection?: (href: string) => void;
  onNavigatePath?: (path: string) => void;
}

const ADDRESSES = [
  {
    city: 'Timbó',
    label: 'Timbó: R. Germano Brandes Sênior, 726',
    url: 'https://maps.google.com/?q=R.+Germano+Brandes+Senior+726+Timbo+SC',
  },
  {
    city: 'Pomerode',
    label: 'Pomerode: R. dos Atiradores, 13 - Sl 2',
    url: 'https://maps.google.com/?q=R.+dos+Atiradores+13+Pomerode+SC',
  },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenAppointment,
  onNavigatePortal,
  currentPath = '/',
  onNavigateSection,
  onNavigatePath,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('#home');

  // Random initial address on mobile, alternating every 3 seconds
  const [mobileAddressIndex, setMobileAddressIndex] = useState(() =>
    Math.random() > 0.5 ? 1 : 0
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setMobileAddressIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Track scroll position for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatic section tracking on home page using IntersectionObserver
  useEffect(() => {
    if (currentPath !== '/') return;

    const sectionIds = ['home', 'sobre', 'especialidades', 'corpo-clinico', 'unidades', 'convenios'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(`#${id}`);
            }
          });
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0.1,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [currentPath]);

  // Dynamic links: On Home, keep anchor menu with Unidades and Convênios.
  // On other pages, remove Unidades and Convênios and link directly to respective pages.
  const navLinksToDisplay =
    currentPath === '/'
      ? [
          { label: 'Home', href: '#home' },
          { label: 'Sobre', href: '#sobre' },
          { label: 'Especialidades', href: '#especialidades' },
          { label: 'Corpo Clínico', href: '#corpo-clinico' },
          { label: 'Unidades', href: '#unidades' },
          { label: 'Convênios', href: '#convenios' },
          { label: 'Fale Conosco', href: '/fale-conosco' },
        ]
      : [
          { label: 'Home', href: '/' },
          { label: 'Sobre', href: '/sobre' },
          { label: 'Especialidades', href: '/especialidades' },
          { label: 'Corpo Clínico', href: '/corpo-clinico' },
          { label: 'Fale Conosco', href: '/fale-conosco' },
        ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    // If clicking Fale Conosco
    if (href === '/fale-conosco' || href === '#fale-conosco' || href === '#contato') {
      if (onNavigatePath) {
        onNavigatePath('/fale-conosco');
      } else {
        window.location.href = '/fale-conosco';
      }
      return;
    }

    // If on a subpage like /sobre, /especialidades, /corpo-clinico, /fale-conosco
    if (currentPath !== '/') {
      // If clicking Especialidades from a subpage
      if (href === '#especialidades' || href === '/especialidades') {
        if (onNavigatePath) {
          onNavigatePath('/especialidades');
        }
        return;
      }

      // If clicking Corpo Clínico from a subpage
      if (href === '#corpo-clinico' || href === '#medicos' || href === '/corpo-clinico' || href === '/medicos') {
        if (onNavigatePath) {
          onNavigatePath('/corpo-clinico');
        }
        return;
      }

      // If clicking Sobre from a subpage
      if (href === '#sobre' || href === '/sobre') {
        if (onNavigatePath) {
          onNavigatePath('/sobre');
        }
        return;
      }

      // If clicking Home / Início
      if (href === '#home' || href === '/') {
        if (onNavigatePath) {
          onNavigatePath('/');
        }
        return;
      }

      // For anchors to home sections (Unidades, Convênios)
      if (onNavigateSection) {
        onNavigateSection(href);
      } else if (onNavigatePath) {
        onNavigatePath('/');
        setTimeout(() => {
          const targetId = href.replace('#', '');
          const element = document.getElementById(targetId);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        window.location.href = `/${href}`;
      }
      return;
    }

    // On home page: smooth scroll to anchor
    setActiveSection(href);
    const targetId = href.replace('#', '');
    let element = document.getElementById(targetId);
    if (!element && (targetId === 'corpo-clinico' || targetId === 'medicos')) {
      element = document.getElementById('corpo-clinico') || document.getElementById('medicos');
    }
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Skip to Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#004d5a] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      {/* Top Institutional Info Strip (Soft clean light gray) */}
      <div className="bg-[#f0f2f5] border-b border-slate-200 text-[11px] sm:text-xs text-slate-700 py-1.5 px-3 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Mobile rotating address: switches every 3s, both clickable opening in new tab */}
          <div className="flex sm:hidden items-center min-w-0">
            <a
              key={mobileAddressIndex}
              href={ADDRESSES[mobileAddressIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#004d5a] transition-all duration-300 animate-in fade-in truncate"
              title="Abrir no Google Maps em nova guia"
            >
              <MapPin className="w-3.5 h-3.5 text-[#be7b52] shrink-0" />
              <span className="truncate">{ADDRESSES[mobileAddressIndex].label}</span>
            </a>
          </div>

          {/* Desktop & Tablet addresses: shows both clickable addresses opening in new tab */}
          <div className="hidden sm:flex items-center gap-x-4 font-medium min-w-0">
            <a
              href="https://maps.google.com/?q=R.+Germano+Brandes+Senior+726+Timbo+SC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#004d5a] transition-colors truncate"
              title="Abrir no Google Maps em nova guia"
            >
              <MapPin className="w-3.5 h-3.5 text-[#be7b52] shrink-0" />
              <span className="truncate">Timbó: R. Germano Brandes Sênior, 726</span>
            </a>
            <span className="text-slate-300 hidden lg:inline">|</span>
            <a
              href="https://maps.google.com/?q=R.+dos+Atiradores+13+Pomerode+SC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#004d5a] transition-colors truncate"
              title="Abrir no Google Maps em nova guia"
            >
              <MapPin className="w-3.5 h-3.5 text-[#be7b52] shrink-0" />
              <span className="truncate">Pomerode: R. dos Atiradores, 13 - Sl 2</span>
            </a>
          </div>

          {/* Contact, Email & Accessibility */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${HOSPITAL_INFO.email}`}
              className="items-center gap-1.5 hover:text-[#004d5a] transition-colors hidden md:flex font-semibold text-slate-700"
            >
              <Mail className="w-3.5 h-3.5 text-[#004d5a] shrink-0" />
              <span>{HOSPITAL_INFO.email}</span>
            </a>

            <AccessibilityToolbar variant="inline" />
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation Header (Solid pure white background) */}
      <header
        className={`sticky top-0 z-40 relative transition-all duration-300 font-['Jost',sans-serif] ${
          isScrolled
            ? 'bg-white shadow-md py-3 border-b border-slate-200'
            : 'bg-white py-3.5 border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo Zone */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigatePath) {
                onNavigatePath('/');
              } else {
                handleLinkClick(e, '#home');
              }
            }}
            className="focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1 transition-opacity hover:opacity-95 shrink-0 cursor-pointer"
            aria-label="Hospital de Olhos Freitag Munareto - Ir para início"
          >
            <Logo />
          </a>

          {/* Desktop Navigation Links (Zone 2) - Font-weight 400 (normal) as requested */}
          <nav
            className="hidden lg:flex items-center gap-7 text-[15px] font-normal text-slate-700"
            aria-label="Navegação Principal"
          >
            {navLinksToDisplay.map((link) => {
              const isHomeLink = link.label === 'Home' || link.href === '#home' || link.href === '/';
              const isSobreLink = link.label === 'Sobre' || link.href.includes('sobre');
              const isEspecialidadesLink = link.label === 'Especialidades' || link.href.includes('especialidades');
              const isCorpoClinicoLink = link.label === 'Corpo Clínico' || link.href.includes('corpo-clinico') || link.href.includes('medicos');
              const isFaleConoscoLink = link.label === 'Fale Conosco' || link.href.includes('fale-conosco');

              const isActive =
                currentPath === '/sobre'
                  ? isSobreLink
                  : currentPath === '/especialidades'
                  ? isEspecialidadesLink
                  : currentPath === '/corpo-clinico'
                  ? isCorpoClinicoLink
                  : currentPath === '/fale-conosco'
                  ? isFaleConoscoLink
                  : currentPath === '/'
                  ? (activeSection === link.href || (isHomeLink && (activeSection === '#home' || activeSection === '')))
                  : false;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1.5 transition-colors group whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#004d5a] font-medium'
                      : 'text-slate-700 hover:text-[#004d5a]'
                  }`}
                >
                  {link.label}

                  {/* Discreet horizontal line underline with smooth transition */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#004d5a] transition-all duration-200 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Action Buttons (Zone 3) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop "Acessar" Button: Hidden on mobile (< lg), visible on desktop */}
            <button
              onClick={onNavigatePortal}
              className="hidden lg:inline-flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-lg text-xs sm:text-sm font-medium text-[#004d5a] bg-teal-50/70 hover:bg-teal-100/80 border border-teal-200/90 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap"
              aria-label="Acessar Portal do Paciente e Equipe Médica"
            >
              <User className="w-4 h-4 text-[#004d5a] shrink-0" />
              <span>Acessar</span>
            </button>

            {/* Desktop "Agendamento" Button: Hidden on mobile (< lg), visible on desktop */}
            <button
              onClick={onOpenAppointment}
              className="hidden lg:inline-flex items-center gap-2 border-2 border-[#be7b52] text-[#be7b52] hover:bg-[#be7b52] hover:text-white px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap"
              aria-label="Agendar consulta via WhatsApp ou formulário"
            >
              {/* Official WhatsApp SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Agendamento</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-600 cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer & Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 top-[72px] bg-black/40 z-40 backdrop-blur-2xs"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-2xl p-6 z-50 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="flex flex-col space-y-3 text-base font-normal text-slate-700">
              {navLinksToDisplay.map((link) => {
                const isHomeLink = link.label === 'Home' || link.href === '#home' || link.href === '/';
                const isSobreLink = link.label === 'Sobre' || link.href.includes('sobre');
                const isEspecialidadesLink = link.label === 'Especialidades' || link.href.includes('especialidades');
                const isCorpoClinicoLink = link.label === 'Corpo Clínico' || link.href.includes('corpo-clinico') || link.href.includes('medicos');
                const isFaleConoscoLink = link.label === 'Fale Conosco' || link.href.includes('fale-conosco');

                const isActive =
                  currentPath === '/sobre'
                    ? isSobreLink
                    : currentPath === '/especialidades'
                    ? isEspecialidadesLink
                    : currentPath === '/corpo-clinico'
                    ? isCorpoClinicoLink
                    : currentPath === '/fale-conosco'
                    ? isFaleConoscoLink
                    : currentPath === '/'
                    ? (activeSection === link.href || (isHomeLink && (activeSection === '#home' || activeSection === '')))
                    : false;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`py-2 px-3 rounded-md transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-teal-50 text-[#004d5a] font-medium border-l-4 border-[#004d5a]'
                        : 'hover:bg-slate-50 hover:text-[#004d5a]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#004d5a]" />}
                  </a>
                );
              })}

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigatePortal();
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold text-[#004d5a] bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shadow-2xs cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#004d5a]" />
                  <span>Acessar Portal</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAppointment();
                  }}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#be7b52] hover:bg-[#aa6840] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>Agendamento</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
      </header>
    </>
  );
};
