import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Photo {
  url: string;
  province: string;
  date: string;
}

export interface Treasure {
  label: string;
  date: string;
}

export interface Mission {
  id: string;
  label: string;
  desc: string;
  type: 'visita' | 'camera' | 'tesouro' | 'quiz';
  reward: string;
}

export const MISSIONS_CATALOG: Mission[] = [
  { id: 'first_step', label: 'Primeiro Passo', desc: 'Desbloqueie o primeiro carimbo provincial.', type: 'visita', reward: 'Filtro visual Recruta 360' },
  { id: 'angle_perfect', label: 'O Ângulo Perfeito', desc: 'Capture uma foto no visualizador 360.', type: 'camera', reward: 'Moldura neon para screenshots' },
  { id: 'treasure_hunter', label: 'Caça ao Tesouro Histórico', desc: 'Encontre um tesouro cultural escondido.', type: 'tesouro', reward: 'Acesso a galeria histórica' },
  { id: 'national_route', label: 'Rota Nacional', desc: 'Desbloqueie as 21 províncias do passaporte.', type: 'visita', reward: 'Vídeos em drone e selo nacional' },
];

interface PassportState {
  name: string;
  level: string;
  stamps: string[];
  mileage: number;
  memberSince: string;
  wishlist: string[];
  photos: Photo[];
  treasures: Treasure[];
  completedMissions: string[];
  favoriteProvince: string;
  
  // Actions
  setName: (name: string) => void;
  setFavoriteProvince: (province: string) => void;
  toggleWishlist: (province: string) => void;
  unlockStamp: (province: string) => void;
  addPhoto: (url: string, province: string) => void;
  collectTreasure: (label: string) => void;
  checkMissions: () => void;
  resetProgress: () => void;
}

const calculateLevel = (stampsCount: number, missionsCount: number) => {
  if (missionsCount >= 4) return 'Embaixador 360';
  if (stampsCount >= 21) return 'Explorador Nacional';
  if (missionsCount >= 2) return 'Viajante';
  if (stampsCount >= 1) return 'Recruta';
  return 'Novato';
};

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      name: 'Explorador',
      level: 'Novato',
      stamps: [],
      mileage: 0,
      memberSince: new Date().toLocaleDateString('pt-PT'),
      wishlist: [],
      photos: [],
      treasures: [],
      completedMissions: [],
      favoriteProvince: '',

      setName: (name) => set({ name }),
      setFavoriteProvince: (province) => set({ favoriteProvince: province }),

      toggleWishlist: (province) => {
        const { wishlist } = get();
        if (wishlist.includes(province)) {
          set({ wishlist: wishlist.filter(p => p !== province) });
        } else {
          set({ wishlist: [...wishlist, province] });
        }
      },

      unlockStamp: (province) => {
        const { stamps, mileage } = get();
        if (!stamps.includes(province)) {
          const newStamps = [...stamps, province];
          set({ stamps: newStamps, mileage: mileage + 50 });
          get().checkMissions();
        }
      },

      addPhoto: (url, province) => {
        const newPhoto: Photo = { url, province, date: new Date().toLocaleDateString('pt-PT') };
        set(state => ({ photos: [newPhoto, ...state.photos] }));
        get().checkMissions();
      },

      collectTreasure: (label) => {
        const newTreasure: Treasure = { label, date: new Date().toLocaleDateString('pt-PT') };
        set(state => ({ treasures: [newTreasure, ...state.treasures] }));
        get().checkMissions();
      },

      checkMissions: () => {
        const { stamps, photos, treasures, completedMissions } = get();
        const newCompleted = new Set(completedMissions);

        if (stamps.length >= 1) newCompleted.add('first_step');
        if (stamps.length >= 21) newCompleted.add('national_route');
        if (photos.length >= 1) newCompleted.add('angle_perfect');
        if (treasures.length >= 1) newCompleted.add('treasure_hunter');

        const newCompletedArray = Array.from(newCompleted);
        
        if (newCompletedArray.length !== completedMissions.length || get().level !== calculateLevel(stamps.length, newCompletedArray.length)) {
          set({ 
            completedMissions: newCompletedArray,
            level: calculateLevel(stamps.length, newCompletedArray.length)
          });
        }
      },

      resetProgress: () => set({
        stamps: [],
        mileage: 0,
        wishlist: [],
        photos: [],
        treasures: [],
        completedMissions: [],
        level: 'Novato',
        favoriteProvince: ''
      })
    }),
    {
      name: 'angola360-passport-storage', // saves to localStorage automatically
    }
  )
);
