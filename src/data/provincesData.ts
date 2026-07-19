import { generateProvincePlaceholder } from '../lib/provinceImage';

export interface ProvinceData {
  name: string;
  image: string;
  description?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DADOS DAS 21 PROVÍNCIAS DE ANGOLA
// ═══════════════════════════════════════════════════════════════════════════
// As imagens são placeholders SVG temáticos gerados localmente (sem rede).
// Para usar fotos reais: coloque os ficheiros em
//   public/assets/images/provinces/{slug}.jpg
// e troque `image: generateProvincePlaceholder(name)` por
//   image: `/assets/images/provinces/${slug}.jpg`
// ═══════════════════════════════════════════════════════════════════════════
export const PROVINCES_DATA: ProvinceData[] = [
  { name: 'Bengo', image: '/assets/images/brevemente.svg', description: 'O paraíso natural e vida selvagem.' },
  { name: 'Benguela', image: '/assets/images/brevemente.svg', description: 'Praias deslumbrantes e águas cristalinas.' },
  { name: 'Bié', image: '/assets/images/brevemente.svg', description: 'O coração de Angola e suas belezas.' },
  { name: 'Cabinda', image: '/assets/images/brevemente.svg', description: 'A densa e verdejante floresta do Maiombe.' },
  { name: 'Cuando Cubango', image: '/assets/images/brevemente.svg', description: 'Terras do fim do mundo.' },
  { name: 'Cuanza Norte', image: '/assets/images/brevemente.svg', description: 'A riqueza botânica de Ndalatando.' },
  { name: 'Cuanza Sul', image: '/assets/images/brevemente.svg', description: 'Paisagens montanhosas inesquecíveis.' },
  { name: 'Cunene', image: '/assets/images/brevemente.svg', description: 'As memórias das águas do sul.' },
  { name: 'Huambo', image: '/assets/images/brevemente.svg', description: 'Uma cidade cheia de história e parques.' },
  { name: 'Huíla', image: '/assets/images/brevemente.svg', description: 'As famosas fendas e montanhas da Serra da Leba.' },
  { name: 'Icolo e Bengo', image: '/assets/images/brevemente.svg', description: 'As maravilhas naturais próximas à capital.' },
  { name: 'Luanda', image: '/assets/images/brevemente.svg', description: 'A vibrante e cultural cidade capital.' },
  { name: 'Lunda Norte', image: '/assets/images/brevemente.svg', description: 'O esplendor dos rios e das terras de diamantes.' },
  { name: 'Lunda Sul', image: '/assets/images/brevemente.svg', description: 'Encantos rurais e cultura forte.' },
  { name: 'Malanje', image: '/assets/images/brevemente.svg', description: 'A força da natureza nas Quedas de Kalandula.' },
  { name: 'Moxico', image: '/assets/images/brevemente.svg', description: 'Vastos planaltos e rios históricos.' },
  { name: 'Moxico Leste', image: '/assets/images/brevemente.svg', description: 'As paisagens intocadas e selvagens.' },
  { name: 'Namibe', image: '/assets/images/brevemente.svg', description: 'O fascinante encontro entre o deserto e o mar.' },
  { name: 'Uíge', image: '/assets/images/brevemente.svg', description: 'Montanhas, grutas e cafezais a perder de vista.' },
  { name: 'Zaire', image: '/assets/images/brevemente.svg', description: 'As memórias ancestrais da foz do rio.' }
];

export const getProvinceImage = (name: string): string => {
  const province = PROVINCES_DATA.find(p => p.name.toLowerCase() === name.toLowerCase());
  return province?.image || '/assets/images/header.svg';
};
