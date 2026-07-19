// ═══════════════════════════════════════════════════════════════════════════
// CONTEÚDO DA LANDING PAGE — Angola360
// ═══════════════════════════════════════════════════════════════════════════
// Edita este ficheiro para atualizar copy, números e testemunhos da landing page
// sem precisar mexer no JSX dos componentes.
//
// Nota sobre imagens: usamos placeholders SVG temáticos (ver lib/provinceImage.ts)
// que carregam sempre, sem rede. Quando tiveres fotos reais, coloca-as em
// public/assets/images/provinces/{slug}.jpg e ajusta o getProvinceImage().
//
// Legenda:
//   // TODO:  → valor placeholder que precisa ser atualizado com dados reais
// ═══════════════════════════════════════════════════════════════════════════

import { generateProvincePlaceholder } from '../lib/provinceImage';

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO
// ─────────────────────────────────────────────────────────────────────────────
export const heroContent = {
  badge: 'A Nova Forma de Descobrir Angola',
  title: 'Angola',
  titleHighlight: '360',
  subtitle:
    'Mergulhe na alma de Angola. De Cabinda ao Cunene, explore as paisagens mais deslumbrantes, a cultura vibrante e os segredos escondidos de cada província — tudo num só lugar.',
  primaryCta: 'Iniciar Jornada',
  primaryCtaTo: '/explore',
  credibility: [
    { icon: 'MapPin', label: '21 Províncias' },
    { icon: 'Camera', label: 'Experiência 360º' },
    { icon: 'Globe', label: 'Feito em Angola' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. STATS BAR
// ─────────────────────────────────────────────────────────────────────────────
export const statsContent = [
  { value: '21', label: 'Províncias Mapeadas' },
  { value: '8+', label: 'Tours 360º' }, // TODO: atualizar conforme produção
  { value: '1.650', label: 'Km de Costa Atlântica' },
  { value: '∞', label: 'Histórias por Descobrir' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. DESTAQUES (Featured Tours)
// ─────────────────────────────────────────────────────────────────────────────
export const featuredToursContent = {
  title: 'Destaques',
  subtitle: 'Os destinos mais explorados pela nossa comunidade de viajantes.',
  tours: [
    {
      title: 'Fortaleza de São Miguel',
      province: 'Luanda',
      image: '/assets/images/tours/tour_1_fortaleza.png',
      to: '/tour/luanda',
    },
    {
      title: 'Praia da Caotinha',
      province: 'Benguela',
      image: '/assets/images/tours/tour_2_caotinha.png',
      to: '/tour/benguela',
    },
    {
      title: 'Fenda da Tundavala',
      province: 'Huíla',
      image: '/assets/images/tours/tour_3_leba.png',
      to: '/tour/huila',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMO FUNCIONA
// ─────────────────────────────────────────────────────────────────────────────
export const howItWorksContent = {
  title: 'Como Funciona',
  subtitle: 'Três passos para uma jornada imersiva pelo coração de Angola.',
  steps: [
    {
      number: '01',
      icon: 'Map',
      title: 'Escolhe o seu destino',
      description:
        'Navegue pelo mapa interativo e selecione qualquer uma das 21 províncias angolanas para começar a sua viagem.',
    },
    {
      number: '02',
      icon: 'Eye',
      title: 'Mergulhe na experiência 360º',
      description:
        'Explore cada destino em panoramas imersivos de alta resolução, com pontos de interesse e áudio-guia.',
    },
    {
      number: '03',
      icon: 'Award',
      title: 'Colete carimbos no passaporte',
      description:
        'Desbloqueie carimbos, complete missões e construa o seu diário de viagem virtual único.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SHOWCASE 360º (demo inline)
// ─────────────────────────────────────────────────────────────────────────────
export const showcaseContent = {
  badge: 'Demonstração ao Vivo',
  title: 'Sinta a Experiência 360º',
  subtitle:
    'Não observe apenas. Arraste, explore e descubra cada detalhe. Esta é a tecnologia que coloca Angola no ecrã do mundo.',
  // Imagem equiretangular de demonstração (pública da Pannellum).
  // TODO: substituir por panorama real angolano quando disponível
  // (idealmente capturado com telemóvel em modo 360º — gera equiretangular 2:1).
  panoramaImage: 'https://pannellum.org/images/alma.jpg',
  panoramaTitle: 'Baía de Luanda',
  panoramaAuthor: 'Angola360',
  cta: 'Ver mais destinos',
  ctaTo: '/explore',
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. PARCEIROS (secção institucional — não venda a investidores)
// ─────────────────────────────────────────────────────────────────────────────
export const forPartnersContent = {
  badge: 'Para o Setor Turístico',
  title: 'Faça Parte da Maior Plataforma de Turismo de Angola',
  subtitle:
    'Trabalhamos com hotéis, operadores turísticos e entidades públicas para promover Angola como destino de classe mundial.',
  partners: [
    {
      icon: 'Hotel',
      title: 'Hotéis e Resorts',
      benefit: 'Visibilidade Premium',
      description:
        'Apresente o seu alojamento em 360º antes mesmo do hóspede chegar. Aumente a taxa de conversão direta.',
    },
    {
      icon: 'Compass',
      title: 'Operadores Turísticos',
      benefit: 'Novos Canais',
      description:
        'Promova os seus tours e experiências para uma audiência qualificada e engajada, sem intermediários.',
    },
    {
      icon: 'Landmark',
      title: 'Entidades Públicas',
      benefit: 'Promoção Territorial',
      description:
        'Posicione a sua província ou município como destino turístico, atraindo visitantes e promovendo o património local.',
    },
  ],
  cta: 'Falar Connosco',
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAPA INTERATIVO
// ─────────────────────────────────────────────────────────────────────────────
export const mapContent = {
  icon: 'Map',
  title: 'O Mosaico de Províncias',
  subtitle:
    'Selecione um destino no mapa interativo e deixe-se levar pela magia de cada província angolana.',
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. TESTEMUNHOS
// ─────────────────────────────────────────────────────────────────────────────
// TODO: substituir por testemunhos REAIS quando tiver utilizadores/parceiros
export const testimonialsContent = {
  badge: 'Vozes da Comunidade',
  title: 'O Que Dizem os Nossos Viajantes',
  testimonials: [
    {
      // EDITAR: quote real
      quote:
        'Finalmente uma plataforma que faz jus à beleza de Angola. Sinto que estou a redescobrir o meu próprio país.',
      author: '[Nome]',
      role: 'Viajante, Luanda',
      avatar: generateProvincePlaceholder('V1', 100, 100),
    },
    {
      quote:
        'A qualidade da experiência imersiva é incrível. É como estar presente sem sair de casa.',
      author: '[Nome]',
      role: 'Membro da Diáspora, Portugal',
      avatar: generateProvincePlaceholder('V2', 100, 100),
    },
    {
      quote:
        'Uma ferramenta essencial para qualquer província que queira atrair visitantes. Recomendo vivamente.',
      author: '[Nome]',
      role: 'Operador Turístico',
      avatar: generateProvincePlaceholder('V3', 100, 100),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. CAPTURA DE LEADS (newsletter / lista de espera)
// ─────────────────────────────────────────────────────────────────────────────
export const leadCaptureContent = {
  badge: 'Fique a Par',
  title: 'Não Perca Nenhum Destino Novo',
  subtitle:
    'Receba em primeira mão os novos tours 360º, experiências exclusivas e histórias de Angola. Sem spam, apenas descoberta.',
  placeholder: 'O seu melhor email',
  button: 'Subscrever',
  successMessage: 'Obrigado! Avisá-lo-emos assim que adicionarmos novos destinos.',
  privacy: 'Ao subscrever, concorda com a nossa Política de Privacidade.',
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. CTA FINAL
// ─────────────────────────────────────────────────────────────────────────────
export const finalCtaContent = {
  title: 'Angola Espera por Si',
  subtitle:
    'Não apenas observe. Sinta, Explore e Pertença. A sua jornada começa agora.',
  cta: 'Iniciar Jornada',
  ctaTo: '/explore',
};

// Reexporta o utilitário de imagem para conveniência dos componentes
export { generateProvincePlaceholder };
