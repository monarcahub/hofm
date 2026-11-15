/**
 * Centralized Institutional Content for Hospital de Olhos Freitag Munareto
 * 
 * Separates data from presentation, allowing seamless future integration
 * with Supabase database tables or headless CMS.
 */

export interface HospitalInfo {
  name: string;
  shortName: string;
  tagline: string;
  yearsOfCare: number;
  phoneTimbo: string;
  phonePomerode: string;
  whatsappNumber: string;
  email: string;
  domain: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    google: string;
  };
}

/**
 * Dynamic calculation of hospital age based on foundation date: January 6, 1979 (06/01/1979).
 * Automatically updates every January 6th without requiring code changes.
 */
export function getHospitalAge(referenceDate: Date = new Date()): number {
  const foundingYear = 1979;
  const foundingMonth = 0; // 0 = Janeiro (January)
  const foundingDay = 6;   // 06 de Janeiro

  const currentYear = referenceDate.getFullYear();
  let age = currentYear - foundingYear;

  const hasPassedAnniversary =
    referenceDate.getMonth() > foundingMonth ||
    (referenceDate.getMonth() === foundingMonth && referenceDate.getDate() >= foundingDay);

  if (!hasPassedAnniversary) {
    age -= 1;
  }

  return age;
}

export const HOSPITAL_INFO: HospitalInfo = {
  name: 'Hospital de Olhos Freitag Munareto',
  shortName: 'Hospital de Olhos Freitag',
  tagline: `São ${getHospitalAge()} anos cuidando do seu olhar.`,
  yearsOfCare: getHospitalAge(),
  phoneTimbo: '(47) 3382-0266',
  phonePomerode: '(47) 3306-6699',
  whatsappNumber: '554733820266',
  email: 'adm@freitagmunareto.com.br',
  domain: 'https://freitagmunareto.com.br/',
  socials: {
    instagram: 'https://instagram.com/hospitalfreitagmunareto',
    facebook: 'https://facebook.com/hospitalfreitagmunareto',
    youtube: 'https://youtube.com/@hospitalfreitagmunareto',
    google: 'https://maps.google.com/?q=Hospital+de+Olhos+Freitag+Timbo',
  },
};

export interface Specialty {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  isFeatured: boolean;
  indications: string;
  imageUrl?: string;
}

export const SPECIALTIES: Specialty[] = [
  {
    id: 'ceratocone',
    title: 'Tratamento do ceratocone',
    imageUrl: '/assets/specialties/ceratocone.png',
    shortDescription:
      'Diagnóstico avançado e tratamentos modernos como crosslinking e lentes especiais para estabilizar e recuperar a visão.',
    fullDescription:
      'O ceratocone é uma ectasia corneana caracterizada pelo afinamento progressivo e deformação da córnea em formato cônico. No Hospital de Olhos Freitag Munareto, oferecemos avaliação tomográfica completa de córnea, Crosslinking de colágeno (CXL) para contenção do avanço da doença, implante de anéis intracorneanos e adaptação especializada de lentes esclerais de alta tecnologia.',
    highlights: [
      'Crosslinking corneano (CXL) para estabilização',
      'Adaptação de lentes esclerais personalizadas',
      'Topografia e tomografia corneana computadorizada',
      'Acompanhamento e preservação da acuidade visual',
    ],
    isFeatured: true,
    indications: 'Indicado para pacientes com astigmatismo irregular em progressão, histórico familiar, coceira ocular crônica ou perda de nitidez com óculos convencionais.',
  },
  {
    id: 'injecao-intravitrea',
    title: 'Injeção intravítrea',
    imageUrl: '/assets/specialties/injecao-intravitrea.png',
    shortDescription:
      'Aplicação intraocular de antiangiogênicos e corticoides para controle preciso e seguro de doenças da retina.',
    fullDescription:
      'A injeção intravítrea é um procedimento seguro e rápido que administra medicações específicas (como anti-VEGF e corticoides de depósito) diretamente no vítreo ocular. É o padrão-ouro no controle de patologias como Degeneração Macular Relacionada à Idade (DMRI exsudativa), Edema Macular Diabético, Oclusões Venosas Retinianas e neovascularizações.',
    highlights: [
      'Procedimento indolor realizado com anestesia em gotas',
      'Padrão-ouro para DMRI e edema macular diabético',
      'Preservação e recuperação da visão central',
      'Monitoramento com Tomografia de Coerência Óptica (OCT)',
    ],
    isFeatured: false,
    indications: 'Indicado para pacientes com manchas escuras centrais na visão, linhas retas onduladas/tortas, retinopatia diabética ou tromboses na retina.',
  },
  {
    id: 'plastica-ocular',
    title: 'Cirurgia plástica oftalmológica',
    imageUrl: '/assets/specialties/plastica-ocular.png',
    shortDescription:
      'Procedimentos funcionais e estéticos das pálpebras, como blefaroplastia, ptose e correção de entrópio/ectrópio.',
    fullDescription:
      'A plástica ocular (oculoplástica) une precisão microcirúrgica oftalmológica ao refinamento estético. A blefaroplastia retira o excesso de pele e bolsas de gordura, restaurando o campo de visão obstruído pelo peso palpebral e rejuvenescendo o olhar. Também realizamos correções de ptose (queda da pálpebra), entrópio e ectrópio.',
    highlights: [
      'Blefaroplastia superior e inferior com cicatrizes imperceptíveis',
      'Alívio do peso palpebral e ampliação do campo visual',
      'Correção de ptose palpebral e alterações anatômicas',
      'Recuperação rápida e cuidados pós-operatórios completos',
    ],
    isFeatured: false,
    indications: 'Indicado para excesso de pele que encobre a visão, bolsas de gordura sob os olhos, sensação de cansaço ou peso ocular ao longo do dia.',
  },
  {
    id: 'vias-lacrimais',
    title: 'Cirurgia de vias lacrimais',
    imageUrl: '/assets/specialties/vias-lacrimais.png',
    shortDescription:
      'Tratamento cirúrgico de obstruções do canal lacrimal e epífora para restabelecer o fluxo natural da lágrima.',
    fullDescription:
      'A cirurgia das vias lacrimais (como a dacriocistorrinostomia - DCR) reconstrói a drenagem lacrimal quando há obstrução do canal entre o olho e o nariz. O bloqueio provoca lacrimejamento constante (epífora), sensação de olho marejado e infecções frequentes do saco lacrimal (dacriocistite).',
    highlights: [
      'Dacriocistorrinostomia (DCR) para desobstrução definitiva',
      'Eliminação do lacrimejamento contínuo incômodo',
      'Prevenção de infecções graves do saco lacrimal',
      'Procedimento seguro com rápida recuperação ambulatorial',
    ],
    isFeatured: false,
    indications: 'Indicado para pacientes com lacrimejamento crônico ininterrupto, secreção persistente nos cantos dos olhos ou inchaço próximo ao canto nasal.',
  },
  {
    id: 'pterigio',
    title: 'Cirurgia de Pterígio',
    imageUrl: '/assets/specialties/pterigio.png',
    shortDescription:
      'Remoção microcirúrgica com transplante conjuntival autólogo, garantindo mínima recidiva e resultado estético.',
    fullDescription:
      'O pterígio é uma proliferação de tecido fibrovascular sobre a córnea, frequentemente induzida por exposição solar e vento. No Hospital de Olhos Freitag Munareto, empregamos a técnica com transplante de conjuntiva autóloga do próprio paciente, que reduz para níveis mínimos a taxa de recidiva e devolve o conforto e a estética ao olho.',
    highlights: [
      'Técnica moderna de enxerto conjuntival autólogo',
      'Mínima taxa de retorno da lesão',
      'Procedimento indolor sob anestesia local em gotas',
      'Restauração estética e alívio de ardor e irritação',
    ],
    isFeatured: false,
    indications: 'Indicado para quem apresenta olho vermelho crônico, ardor, sensação de areia ou crescimento de tecido fibroso invadindo a córnea.',
  },
  {
    id: 'catarata',
    title: 'Cirurgia de Catarata',
    imageUrl: '/assets/specialties/catarata.png',
    shortDescription:
      'Cirurgia rápida e segura, com tecnologia avançada e equipe experiente. Restaure sua visão com conforto e acompanhamento completo.',
    fullDescription:
      'A cirurgia de catarata com facoemulsificação e lentes intraoculares personalizadas substitui o cristalino opacificado por uma lente de alta precisão. O procedimento é realizado com anestesia tópica e alta no mesmo dia, permitindo corrigir miopia, hipermetropia e astigmatismo simultaneamente.',
    highlights: [
      'Procedimento indolor com anestesia em gotas',
      'Lentes intraoculares premium (monofocais, tóricas e multifocais)',
      'Recuperação visual rápida e acompanhamento pré e pós-operatório',
      'Microincisões auto-selantes que dispensam pontos',
    ],
    isFeatured: true,
    indications: 'Indicado para visão embaçada, cores desbotadas, perda de contraste, fotofobia ou dificuldade de leitura com óculos convencionais.',
  },
  {
    id: 'yag-laser',
    title: 'Capsulotomia YAG Laser',
    imageUrl: '/assets/specialties/yag-laser.png',
    shortDescription:
      'Procedimento a laser rápido e indolor em consultório para limpar a lente intraocular após a cirurgia de catarata.',
    fullDescription:
      'A capsulotomia com YAG Laser é indicada quando a membrana posterior onde se apoia a lente intraocular da catarata sofre opacificação natural meses ou anos após o procedimento. O laser realiza uma abertura microscópica no centro dessa cápsula, restaurando a transparência e a nitidez visual de forma imediata.',
    highlights: [
      'Procedimento realizado no próprio consultório em poucos minutos',
      'Totalmente indolor, sem cortes, sem agulhas e sem pontos',
      'Recuperação imediata da nitidez visual',
      'Sessão única definitiva para o olho operado',
    ],
    isFeatured: false,
    indications: 'Indicado para pacientes já operados de catarata que sentem a visão voltando a ficar embaçada ou com sensação de névoa.',
  },
  {
    id: 'oftalmopediatria',
    title: 'Atendimento Oftalmológico Infantil',
    imageUrl: '/src/assets/images/clinic_ophthalmology_modern_1793224637232.jpg',
    shortDescription:
      'Exames e tratamentos adaptados para crianças. Ambiente acolhedor, equipe atenta e atenção especial em cada etapa do desenvolvimento.',
    fullDescription:
      'O cuidado com a visão das crianças exige dedicação, paciência e métodos lúdicos de exame. Diagnosticamos e tratamos desde cedo estrabismo, erros refrativos e ambliopia (“olho preguiçoso”) para garantir o desenvolvimento saudável da visão.',
    highlights: [
      'Ambiente acolhedor e humanizado para crianças',
      'Detecção precoce de estrabismo e ambliopia',
      'Testes de motilidade ocular e acuidade visual infantis',
    ],
    isFeatured: true,
    indications: 'Recomendado desde o primeiro ano de vida e em avaliações escolares anuais.',
  },
];

export interface Doctor {
  id: string;
  name: string;
  role: string;
  specialtyDetails: string;
  units: string[];
  subtitle?: string;
  curriculum?: string[];
  unitAttendance?: string;
  photoUrl?: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-alexandre-freitag',
    name: 'Dr. Alexandre Rocha Freitag',
    role: 'Fundador e diretor técnico',
    specialtyDetails: 'Estrabismo e lentes de contato',
    units: ['Timbó'],
    subtitle: 'O Dr. Alexandre Rocha Freitag é fundador e diretor técnico do HOFM.',
    curriculum: [
      'Especialista em Estrabismo e lentes de contato.',
      'Graduado em Medicina pela Universidade Federal de Santa Maria com Residência Médica em Oftalmologia.',
      'Ganhou título de Especialista em Oftalmologia pela Associação Médica Brasileira (AMB) e pelo Conselho Brasileiro de Oftalmologia – CBO.',
      'É Membro Titular do Conselho Brasileiro de Oftalmologia (CBO).',
      'É Membro Titular da Sociedade Brasileira de Oftalmologia (SBO).',
    ],
    unitAttendance: 'O Dr. Alexandre atende na unidade HOFM – Timbó.',
    photoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/_3-freitag.png',
  },
  {
    id: 'dr-lucas-leitis',
    name: 'Dr. Lucas H. Leitis',
    role: 'Especialista em retina',
    specialtyDetails: 'Retina clínica e cirúrgica',
    units: ['Timbó'],
    subtitle: 'O Dr. Lucas H. Leitis é especialista em retina aqui no HOFM!',
    curriculum: [
      'O Dr. Lucas é Graduado pela Universidade Regional de Blumenau.',
      'Realizou a especialização em retina clínica pelo Hospital de Olhos do Paraná.',
      'Realizou a especialização em retina clínica pelo Hospital de olhos Sadalla Amin Ghanem.',
      'Realizou a especialização cirúrgica em retina e vítreo pelo Hospital de Olhos do Paraná.',
      'Residência médica em oftalmologia pelo Hospital de Olhos de Blumenau!',
    ],
    unitAttendance: 'O Dr. Lucas atende na unidade HOFM – Timbó.',
    photoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/_1-Lucas.png',
  },
  {
    id: 'dr-mauricio-munareto',
    name: 'Dr. Mauricio C. Munareto',
    role: 'Fundador',
    specialtyDetails: 'Segmento anterior, catarata, lentes de contato e cirurgia refrativa',
    units: ['Timbó'],
    subtitle: 'O Dr. Mauricio C. Munareto atua em segmento anterior (espertise em catarata , lentes l rígidas e gelatinosas).',
    curriculum: [
      'Especialista em oftalmologia (Clínica e cirurgica) pelo MEC desde 2018 (Hospital de olho de Blumenau).',
      'Membro da Soblec – Sociedade Brasileira de Lente de Contato.',
      'Membro da BRASCS – Associação Brasileira de Catarata e Cirurgia Refrativa – Brazilian Association of Cataract and Refractive Surgery.',
    ],
    unitAttendance: 'O Dr. Mauricio atende na unidade HOFM – Timbó.',
    photoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/_2-Munareto.png',
  },
];

export interface Unit {
  id: string;
  city: string;
  state: string;
  address: string;
  cep: string;
  phone: string;
  whatsapp: string;
  hours: string;
  mapsUrl: string;
  embedMapsSearch: string;
}

export const UNITS: Unit[] = [
  {
    id: 'timbo',
    city: 'Timbó',
    state: 'SC',
    address: 'R. Germano Brandes Sênior, 726 - Centro',
    cep: '89120-000',
    phone: '(47) 3382-0266',
    whatsapp: '554733820266',
    hours: 'Segunda a Sexta: 08h às 18h',
    mapsUrl: 'https://maps.google.com/?q=R.+Germano+Brandes+Senior+726+Timbo+SC',
    embedMapsSearch: 'Hospital de Olhos Freitag Munareto Timbó',
  },
  {
    id: 'pomerode',
    city: 'Pomerode',
    state: 'SC',
    address: 'R. dos Atiradores, 13 - Sl 2 - Centro',
    cep: '89107-000',
    phone: '(47) 3306-6699',
    whatsapp: '554733066699',
    hours: 'Segunda a Sexta: 08h às 18h',
    mapsUrl: 'https://maps.google.com/?q=R.+dos+Atiradores+13+Pomerode+SC',
    embedMapsSearch: 'Hospital de Olhos Freitag Munareto Pomerode',
  },
];

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
}

export const PARTNERS: Partner[] = [
  {
    id: 'renal-vida',
    name: 'Associação Renal Vida',
    category: 'Fundação',
    description: 'Atendimento integrado e humanizado',
    logoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/associacao-renal-vida.png',
  },
  {
    id: 'amo',
    name: 'AMO',
    category: 'Assistência Médica',
    description: 'Cobertura em consultas e procedimentos',
    logoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/amo.png',
  },
  {
    id: 'boa-vida',
    name: 'Boa Vida',
    category: 'Plano de Saúde',
    description: 'Facilidade e acesso aos exames oftalmológicos',
    logoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/boa-vida.png',
  },
  {
    id: 'cassi',
    name: 'Cassi',
    category: 'Autogestão',
    description: 'Atendimento aos associados e dependentes',
    logoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/cassi.png',
  },
  {
    id: 'unimed',
    name: 'Unimed',
    category: 'Cooperativa Médica',
    description: 'Ampla cobertura regional em Santa Catarina',
    logoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/unimed.png',
  },
  {
    id: 'sindicatos-rurais',
    name: 'Sindicatos Rurais',
    category: 'Entidade de Classe',
    description: 'Parceria de cuidado com os trabalhadores rurais',
    logoUrl: 'https://qqzvmwbweuaybkymkldi.supabase.co/storage/v1/object/public/clientes/HOFM/parceiros/sindicatos-rurais.png',
  },
];

export interface Review {
  id: string;
  author: string;
  timeAgo: string;
  rating: number;
  text: string;
  verified: boolean;
}

// Exactly matching verified Google testimonials shown on original website
export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Paola Rodrigues L...',
    timeAgo: '2 anos atrás',
    rating: 5,
    text: 'Ótimos oftalmologistas, atendimento pontual e equipe prestativa.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Marcelo ferreira d...',
    timeAgo: '6 anos atrás',
    rating: 5,
    text: 'Atendimento ao cliente rápido... Bem explicativo nos procedimentos... Ambiente organizado...',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Angela Pereira Mo...',
    timeAgo: '8 anos atrás',
    rating: 5,
    text: 'Eu recomendo.',
    verified: true,
  },
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'catarata-quando-operar',
    title: 'Catarata: qual o momento ideal para realizar a cirurgia?',
    excerpt: 'Descubra como os avanços tecnológicos tornaram a cirurgia de catarata rápida, segura e capaz de restabelecer a independência visual.',
    date: '14 de Outubro, 2026',
    readTime: '4 min de leitura',
    category: 'Catarata & Cirurgias',
  },
  {
    id: 'saude-ocular-infantil-telas',
    title: 'Uso de telas e a visão das crianças: sinais de alerta que pais devem observar',
    excerpt: 'Dicas práticas para prevenir a miopia precoce e entender quando uma avaliação oftalmológica é recomendada na infância.',
    date: '28 de Setembro, 2026',
    readTime: '5 min de leitura',
    category: 'Oftalmologia Infantil',
  },
  {
    id: 'avancos-tratamento-ceratocone',
    title: 'Ceratocone: como o diagnóstico precoce e o crosslinking transformam o tratamento',
    excerpt: 'Entenda como novas terapias impedem a evolução da doença corneana e devolvem conforto com lentes especiais.',
    date: '10 de Setembro, 2026',
    readTime: '6 min de leitura',
    category: 'Córnea & Ceratocone',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Corpo Clínico', href: '#corpo-clinico' },
  { label: 'Unidades', href: '#unidades' },
  { label: 'Convênios', href: '#convenios' },
  { label: 'Fale Conosco', href: '#unidades' },
];
