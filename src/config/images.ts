/**
 * Centralized Image Configuration for Hospital de Olhos Freitag Munareto
 * 
 * Prepares the application for remote hosting on Supabase Storage.
 * When official images are uploaded to your Supabase bucket, update
 * SUPABASE_STORAGE_URL in your .env or configure bucket paths below.
 * 
 * In accordance with institutional guidelines:
 * - Placeholders are clearly identified.
 * - Medical staff & installation photos are never invented.
 */

// Environment variable for future Supabase Storage integration
export const SUPABASE_STORAGE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_STORAGE_URL) || '';

/**
 * Helper to build Supabase Storage URLs or fallback to local generated/placeholder paths
 */
export function getStorageImageUrl(bucketPath: string, localFallback: string): string {
  if (SUPABASE_STORAGE_URL && bucketPath) {
    // Normalizes bucket path URL
    const cleanBase = SUPABASE_STORAGE_URL.replace(/\/+$/, '');
    const cleanPath = bucketPath.replace(/^\/+/, '');
    return `${cleanBase}/${cleanPath}`;
  }
  return localFallback;
}

export const IMAGES = {
  // Institutional Logo
  logo: {
    header: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/logo-header-Hospital-de-Olhos-Freitag-Munareto.png',
    headerDark: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/logo-header-Hospital-de-Olhos-Freitag-Munareto-fundo-escuro.png',
    favicon: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/favicon-HOFM.png',
    symbol: '/assets/logo-symbol.svg',
    alt: 'Hospital de Olhos Freitag Munareto - Logotipo Oficial',
  },

  // Hero Banner Section Background
  hero: {
    bannerBackground: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/banner-freitag-hospital-dos-olhos.jpg',
    alt: 'Hospital de Olhos Freitag Munareto - 47 anos cuidando do seu olhar',
  },

  // About Page dedicated assets
  aboutPage: {
    bannerBackground: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/banner-sobre-hofm.jpg',
    drAlexandreConsultation: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/Dr.%20Alexandre-Freitag-Foto-HOFM.jpg',
    altBanner: 'Hospital de Olhos Freitag Munareto - Sobre a HOFM',
    altAlexandre: 'Dr. Alexandre Rocha Freitag no consultório do Hospital de Olhos Freitag Munareto',
  },

  // Contact Page (Fale Conosco)
  contactPage: {
    bannerBackground: '/assets/banners/caring-hands-banner.jpg',
    altBanner: 'Hospital de Olhos Freitag Munareto - Fale Conosco',
  },

  // Hospital Facilities & Technology
  hospital: {
    examinationRoom: getStorageImageUrl(
      'facilities/consultation-room.jpg',
      '/src/assets/images/clinic_ophthalmology_modern_1793224637232.jpg'
    ),
    macroEye: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/macro_human_eye_iris_FreitagMunareto.jpg',
    altFacilities: 'Consultório oftalmológico moderno equipado com tecnologia de ponta',
    altMacroEye: 'Close-up macro da íris e estrutura ocular saudável',
  },

  // Doctors - Official photos from Supabase Storage
  doctors: {
    alexandreFreitag: {
      id: 'dr-alexandre-freitag',
      name: 'Dr. Alexandre Rocha Freitag',
      crm: 'CRM/SC 1826 - RQE 472',
      supabasePath: '_3-freitag.png',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/_3-freitag.png',
      placeholderLabel: '',
    },
    lucasLeitis: {
      id: 'dr-lucas-leitis',
      name: 'Dr. Lucas H. Leitis',
      crm: 'CRM/SC 19540 - RQE 11234',
      supabasePath: '_1-Lucas.png',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/_1-Lucas.png',
      placeholderLabel: '',
    },
    mauricioMunareto: {
      id: 'dr-mauricio-munareto',
      name: 'Dr. Mauricio C. Munareto',
      crm: 'CRM/SC 12845 - RQE 8921',
      supabasePath: '_2-Munareto.png',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/_2-Munareto.png',
      placeholderLabel: '',
    },
  },

  // Specialties
  specialties: {
    catarata: {
      supabasePath: 'specialties/catarata.jpg',
      url: getStorageImageUrl('specialties/catarata.jpg', ''),
      alt: 'Cirurgia de Catarata a laser de precisão',
    },
    oftalmopediatria: {
      supabasePath: 'specialties/infantil.jpg',
      url: getStorageImageUrl('specialties/infantil.jpg', ''),
      alt: 'Atendimento Oftalmológico Infantil acolhedor',
    },
    ceratocone: {
      supabasePath: 'specialties/ceratocone.jpg',
      url: getStorageImageUrl('specialties/ceratocone.jpg', ''),
      alt: 'Tratamento Moderno de Ceratocone e Crosslinking',
    },
    refrativa: {
      supabasePath: 'specialties/cirurgia-refrativa.jpg',
      url: getStorageImageUrl('specialties/cirurgia-refrativa.jpg', ''),
      alt: 'Cirurgia Refrativa para correção de miopia e astigmatismo',
    },
    exames: {
      supabasePath: 'specialties/exames.jpg',
      url: getStorageImageUrl('specialties/exames.jpg', ''),
      alt: 'Exames diagnósticos computadorizados de alta precisão',
    },
  },

  // Partners / Convênios - Official brand logos from Supabase Storage
  convenios: {
    renalVida: {
      name: 'Associação Renal Vida',
      short: 'Renal Vida',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/associacao-renal-vida.png',
    },
    amo: {
      name: 'AMO Assistência Médica',
      short: 'AMO',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/amo.png',
    },
    boaVida: {
      name: 'Boa Vida Planos',
      short: 'Boa Vida',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/boa-vida.png',
    },
    cassi: {
      name: 'CASSI Saúde',
      short: 'CASSI',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/cassi.png',
    },
    unimed: {
      name: 'Unimed Santa Catarina',
      short: 'Unimed',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/unimed.png',
    },
    sindicatosRurais: {
      name: 'Sindicatos Rurais',
      short: 'Sindicatos Rurais',
      url: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/sindicatos-rurais.png',
    },
  },

  // Blog articles
  blog: {
    article1: getStorageImageUrl('blog/catarata-prevencao.jpg', ''),
    article2: getStorageImageUrl('blog/telas-criancas.jpg', ''),
    article3: getStorageImageUrl('blog/ceratocone-cuidados.jpg', ''),
  },
};
