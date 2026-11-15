import React, { useState, useEffect } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SpecialtiesHighlights } from './components/SpecialtiesHighlights';
import { About } from './components/About';
import { Doctors } from './components/Doctors';
import { Partners } from './components/Partners';
import { Reviews } from './components/Reviews';
import { Units } from './components/Units';
import { Blog } from './components/Blog';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { SpecialtyModal } from './components/SpecialtyModal';
import { DoctorModal } from './components/DoctorModal';
import { Specialty, Doctor } from './data/content';
import { UserRole } from './lib/supabase';

// Portal Components
import { PortalLogin } from './components/portal/PortalLogin';
import { SecretaryDashboard } from './components/portal/SecretaryDashboard';
import { PatientDashboard } from './components/portal/PatientDashboard';
import { DoctorDashboard } from './components/portal/DoctorDashboard';
import { PasswordResetModal } from './components/portal/PasswordResetModal';
import { AboutPage } from './components/pages/AboutPage';
import { SpecialtiesPage } from './components/pages/SpecialtiesPage';
import { DoctorsPage } from './components/pages/DoctorsPage';
import { ContactPage } from './components/pages/ContactPage';

export function AppContent() {
  const { profile, role, logout } = useAuth();

  // Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (
        p.startsWith('/portal') ||
        p === '/sobre' ||
        p === '/especialidades' ||
        p === '/corpo-clinico' ||
        p === '/medicos' ||
        p === '/fale-conosco' ||
        p === '/contato'
      ) {
        if (p === '/medicos') return '/corpo-clinico';
        if (p === '/contato') return '/fale-conosco';
        return p;
      }
    }
    return '/';
  });

  // Modals
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>('Timbó');
  const [selectedSpecialtyName, setSelectedSpecialtyName] = useState<string>('Consulta Geral');
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('');

  const [activeSpecialtyModal, setActiveSpecialtyModal] = useState<Specialty | null>(null);
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Sync with browser history popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenAppointment = (unitName = 'Timbó', specialtyName = 'Consulta Geral', doctorName = '') => {
    setSelectedUnit(unitName);
    setSelectedSpecialtyName(specialtyName);
    setSelectedDoctorName(doctorName);
    setAppointmentModalOpen(true);
  };

  const handleSelectSpecialty = (specialty: Specialty) => {
    setActiveSpecialtyModal(specialty);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setActiveDoctorModal(doctor);
  };

  const handleBookFromSpecialty = (specialtyTitle: string) => {
    handleOpenAppointment('Timbó', specialtyTitle, '');
  };

  const handleBookFromDoctor = (doctorName: string) => {
    handleOpenAppointment('Timbó', 'Consulta Geral', doctorName);
  };

  // Navigate to Portal from Header "Acessar" button
  const handleNavigatePortal = () => {
    if (role === 'admin' || role === 'secretary') {
      navigateTo('/portal/secretaria');
    } else if (role === 'doctor') {
      navigateTo('/portal/medico');
    } else if (role === 'patient') {
      navigateTo('/portal/paciente');
    } else {
      navigateTo('/portal/login');
    }
  };

  // If user is on a portal route and authenticated, ensure they go to their assigned dashboard
  const handleLoginSuccess = (userRole: UserRole) => {
    if (userRole === 'admin' || userRole === 'secretary') {
      navigateTo('/portal/secretaria');
    } else if (userRole === 'doctor') {
      navigateTo('/portal/medico');
    } else {
      navigateTo('/portal/paciente');
    }
  };

  // RENDER PORTAL VIEWS IF PATH STARTS WITH /portal
  if (currentPath.startsWith('/portal')) {
    // 1. If user is logged in, show their authorized dashboard
    if (role === 'admin' || role === 'secretary') {
      return (
        <>
          <SecretaryDashboard
            onLogout={() => {
              logout();
              navigateTo('/portal/login');
            }}
            onNavigateHome={() => navigateTo('/')}
          />
          <PasswordResetModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />
        </>
      );
    }

    if (role === 'doctor') {
      return (
        <>
          <DoctorDashboard
            onLogout={() => {
              logout();
              navigateTo('/portal/login');
            }}
            onNavigateHome={() => navigateTo('/')}
          />
          <PasswordResetModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />
        </>
      );
    }

    if (role === 'patient') {
      return (
        <>
          <PatientDashboard
            onLogout={() => {
              logout();
              navigateTo('/portal/login');
            }}
            onNavigateHome={() => navigateTo('/')}
          />
          <PasswordResetModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />
        </>
      );
    }

    // 2. Otherwise render the Portal Login screen
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFB] overflow-x-hidden w-full max-w-[100vw]">
        <Header
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigatePortal={handleNavigatePortal}
          currentPath={currentPath}
          onNavigateSection={(href) => {
            navigateTo('/');
            setTimeout(() => {
              const el = document.getElementById(href.replace('#', ''));
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        <main className="flex-1 flex items-center justify-center overflow-x-hidden w-full">
          <PortalLogin
            onSuccess={handleLoginSuccess}
            onNavigateHome={() => navigateTo('/')}
            onRequestPasswordReset={() => setResetModalOpen(true)}
          />
        </main>

        <Footer onOpenAppointment={() => handleOpenAppointment()} />

        <PasswordResetModal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
        />
      </div>
    );
  }

  // INSTITUTIONAL PAGE: SOBRE A HOFM (/sobre)
  if (currentPath === '/sobre') {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors overflow-x-hidden w-full max-w-[100vw]">
        <Header
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigatePortal={handleNavigatePortal}
          onNavigatePath={(path) => navigateTo(path)}
          currentPath={currentPath}
          onNavigateSection={(href) => {
            navigateTo('/');
            setTimeout(() => {
              const el = document.getElementById(href.replace('#', ''));
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        <main id="main-content" className="flex-1 overflow-x-hidden w-full">
          <AboutPage
            onOpenAppointment={() => handleOpenAppointment()}
            onSelectDoctor={handleSelectDoctor}
            onNavigateHome={() => navigateTo('/')}
          />
        </main>

        <Footer
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateAbout={() => navigateTo('/sobre')}
          onNavigateSpecialties={() => navigateTo('/especialidades')}
          onNavigateDoctors={() => navigateTo('/corpo-clinico')}
          onNavigateContact={() => navigateTo('/fale-conosco')}
        />

        <AppointmentModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          defaultUnit={selectedUnit}
          defaultSpecialty={selectedSpecialtyName}
          defaultDoctor={selectedDoctorName}
        />

        <SpecialtyModal
          specialty={activeSpecialtyModal}
          onClose={() => setActiveSpecialtyModal(null)}
          onBookAppointment={handleBookFromSpecialty}
        />

        <DoctorModal
          doctor={activeDoctorModal}
          onClose={() => setActiveDoctorModal(null)}
          onBookAppointment={handleBookFromDoctor}
        />

        <PasswordResetModal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
        />
      </div>
    );
  }

  // INSTITUTIONAL PAGE: ESPECIALIDADES (/especialidades)
  if (currentPath === '/especialidades') {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors overflow-x-hidden w-full max-w-[100vw]">
        <Header
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigatePortal={handleNavigatePortal}
          onNavigatePath={(path) => navigateTo(path)}
          currentPath={currentPath}
          onNavigateSection={(href) => {
            navigateTo('/');
            setTimeout(() => {
              const el = document.getElementById(href.replace('#', ''));
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        <main id="main-content" className="flex-1 overflow-x-hidden w-full">
          <SpecialtiesPage
            onSelectSpecialty={handleSelectSpecialty}
            onOpenAppointment={handleOpenAppointment}
            onNavigateHome={() => navigateTo('/')}
          />
        </main>

        <Footer
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateAbout={() => navigateTo('/sobre')}
          onNavigateSpecialties={() => navigateTo('/especialidades')}
          onNavigateDoctors={() => navigateTo('/corpo-clinico')}
          onNavigateContact={() => navigateTo('/fale-conosco')}
        />

        <AppointmentModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          defaultUnit={selectedUnit}
          defaultSpecialty={selectedSpecialtyName}
          defaultDoctor={selectedDoctorName}
        />

        <SpecialtyModal
          specialty={activeSpecialtyModal}
          onClose={() => setActiveSpecialtyModal(null)}
          onBookAppointment={handleBookFromSpecialty}
        />

        <DoctorModal
          doctor={activeDoctorModal}
          onClose={() => setActiveDoctorModal(null)}
          onBookAppointment={handleBookFromDoctor}
        />

        <PasswordResetModal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
        />
      </div>
    );
  }

  // INSTITUTIONAL PAGE: CORPO CLÍNICO (/corpo-clinico)
  if (currentPath === '/corpo-clinico') {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors overflow-x-hidden w-full max-w-[100vw]">
        <Header
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigatePortal={handleNavigatePortal}
          onNavigatePath={(path) => navigateTo(path)}
          currentPath={currentPath}
          onNavigateSection={(href) => {
            navigateTo('/');
            setTimeout(() => {
              const el = document.getElementById(href.replace('#', ''));
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        <main id="main-content" className="flex-1 overflow-x-hidden w-full">
          <DoctorsPage
            onSelectDoctor={handleSelectDoctor}
            onOpenAppointment={handleOpenAppointment}
            onNavigateHome={() => navigateTo('/')}
          />
        </main>

        <Footer
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateAbout={() => navigateTo('/sobre')}
          onNavigateSpecialties={() => navigateTo('/especialidades')}
          onNavigateDoctors={() => navigateTo('/corpo-clinico')}
          onNavigateContact={() => navigateTo('/fale-conosco')}
        />

        <AppointmentModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          defaultUnit={selectedUnit}
          defaultSpecialty={selectedSpecialtyName}
          defaultDoctor={selectedDoctorName}
        />

        <SpecialtyModal
          specialty={activeSpecialtyModal}
          onClose={() => setActiveSpecialtyModal(null)}
          onBookAppointment={handleBookFromSpecialty}
        />

        <DoctorModal
          doctor={activeDoctorModal}
          onClose={() => setActiveDoctorModal(null)}
          onBookAppointment={handleBookFromDoctor}
        />

        <PasswordResetModal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
        />
      </div>
    );
  }

  // INSTITUTIONAL PAGE: FALE CONOSCO (/fale-conosco)
  if (currentPath === '/fale-conosco') {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors overflow-x-hidden w-full max-w-[100vw]">
        <Header
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigatePortal={handleNavigatePortal}
          onNavigatePath={(path) => navigateTo(path)}
          currentPath={currentPath}
          onNavigateSection={(href) => {
            navigateTo('/');
            setTimeout(() => {
              const el = document.getElementById(href.replace('#', ''));
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />

        <main id="main-content" className="flex-1 overflow-x-hidden w-full">
          <ContactPage
            onNavigateHome={() => navigateTo('/')}
            onOpenAppointment={handleOpenAppointment}
          />
        </main>

        <Footer
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateAbout={() => navigateTo('/sobre')}
          onNavigateSpecialties={() => navigateTo('/especialidades')}
          onNavigateDoctors={() => navigateTo('/corpo-clinico')}
          onNavigateContact={() => navigateTo('/fale-conosco')}
        />

        <AppointmentModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          defaultUnit={selectedUnit}
          defaultSpecialty={selectedSpecialtyName}
          defaultDoctor={selectedDoctorName}
        />

        <SpecialtyModal
          specialty={activeSpecialtyModal}
          onClose={() => setActiveSpecialtyModal(null)}
          onBookAppointment={handleBookFromSpecialty}
        />

        <DoctorModal
          doctor={activeDoctorModal}
          onClose={() => setActiveDoctorModal(null)}
          onBookAppointment={handleBookFromDoctor}
        />

        <PasswordResetModal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
        />
      </div>
    );
  }

  // INSTITUTIONAL SITE (HOME)
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 transition-colors overflow-x-hidden w-full max-w-[100vw]">
      {/* Header with font-weight 400, active route indicator, WhatsApp SVG and Acessar button */}
      <Header
        onOpenAppointment={() => handleOpenAppointment()}
        onNavigatePortal={handleNavigatePortal}
        onNavigatePath={(path) => navigateTo(path)}
        currentPath={currentPath}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 overflow-x-hidden w-full">
        {/* Hero Section */}
        <Hero
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateAbout={() => navigateTo('/sobre')}
        />

        {/* 3 Featured Specialties Cards (Floating on Hero) */}
        <SpecialtiesHighlights
          onSelectSpecialty={handleSelectSpecialty}
          onNavigateSpecialties={() => navigateTo('/especialidades')}
        />

        {/* About Section */}
        <About
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateAbout={() => navigateTo('/sobre')}
        />

        {/* Doctors / Corpo Clínico Section */}
        <Doctors
          onSelectDoctor={handleSelectDoctor}
          onOpenAppointment={() => handleOpenAppointment()}
          onNavigateDoctors={() => navigateTo('/corpo-clinico')}
        />

        {/* Convênios / Partners */}
        <Partners onOpenAppointment={() => handleOpenAppointment()} />

        {/* Avaliações / Public Google Reviews */}
        <Reviews />

        {/* Unidades (Timbó e Pomerode) */}
        <Units onOpenAppointment={(unit) => handleOpenAppointment(unit)} />

        {/* Blog / Conteúdo Educativo */}
        <Blog />

        {/* Newsletter Section */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer
        onOpenAppointment={() => handleOpenAppointment()}
        onNavigateAbout={() => navigateTo('/sobre')}
        onNavigateSpecialties={() => navigateTo('/especialidades')}
        onNavigateDoctors={() => navigateTo('/corpo-clinico')}
        onNavigateContact={() => navigateTo('/fale-conosco')}
      />

      {/* Interactive Modals */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        defaultUnit={selectedUnit}
        defaultSpecialty={selectedSpecialtyName}
        defaultDoctor={selectedDoctorName}
      />

      <SpecialtyModal
        specialty={activeSpecialtyModal}
        onClose={() => setActiveSpecialtyModal(null)}
        onBookAppointment={handleBookFromSpecialty}
      />

      <DoctorModal
        doctor={activeDoctorModal}
        onClose={() => setActiveDoctorModal(null)}
        onBookAppointment={handleBookFromDoctor}
      />

      <PasswordResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
