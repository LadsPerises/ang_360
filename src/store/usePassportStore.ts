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
  // { id: 'angle_perfect', label: 'O Ângulo Perfeito', desc: 'Capture uma foto no visualizador 360.', type: 'camera', reward: 'Moldura neon para screenshots' },
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
  favoriteProvince: string;
  avatar: string;
  
  // Actions
  setName: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setFavoriteProvince: (province: string) => void;
  toggleWishlist: (province: string) => void;
  unlockStamp: (province: string) => void;
  addPhoto: (url: string, province: string) => void;
  collectTreasure: (label: string) => void;
  checkMissions: () => void;
  resetProgress: () => void;
  syncWithServer: () => Promise<void>;
  loadFromServer: (userId: string) => Promise<void>;
  uploadAvatar: (userId: string, file: File) => Promise<{ success: boolean; error?: string }>;
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
      avatar: 'default',

      setName: (name) => set({ name }),
      setAvatar: (avatar) => {
        set({ avatar });
        get().syncWithServer();
      },
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
        const state = get();
        const { stamps, photos, treasures, completedMissions } = state;
        let newCompleted = [...completedMissions];

        MISSIONS_CATALOG.forEach(mission => {
          if (!newCompleted.includes(mission.id)) {
            let completed = false;
            if (mission.id === 'first_step' && stamps.length >= 1) completed = true;
            // if (mission.id === 'angle_perfect' && photos.length >= 1) completed = true;
            if (mission.id === 'treasure_hunter' && treasures.length >= 1) completed = true;
            if (mission.id === 'national_route' && stamps.length >= 21) completed = true;

            if (completed) newCompleted.push(mission.id);
          }
        });

        if (newCompleted.length !== completedMissions.length) {
          const newLevel = calculateLevel(stamps.length, newCompleted.length);
          set({ completedMissions: newCompleted, level: newLevel });
        }
        
        get().syncWithServer();
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
      }),

      syncWithServer: async () => {
        if (import.meta.env.DEV) return;
        try {
          const authData = localStorage.getItem('angola360_user_auth');
          if (!authData) return;
          const parsed = JSON.parse(authData);
          const userId = parsed?.state?.user?.id;
          if (!userId) return;

          const state = get();
          await fetch('/api/sync_passport.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              action: 'save',
              passport: {
                level: state.level,
                stamps: state.stamps,
                mileage: state.mileage,
                wishlist: state.wishlist,
                completedMissions: state.completedMissions,
                favoriteProvince: state.favoriteProvince,
                avatar: state.avatar,
                photos: state.photos,
                treasures: state.treasures
              }
            })
          });
        } catch (err) {
          console.error('Falha ao sincronizar passaporte:', err);
        }
      },

      loadFromServer: async (userId: string) => {
        if (import.meta.env.DEV) return;
        try {
          const res = await fetch('/api/sync_passport.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          });
          const data = await res.json();
          if (data.success && data.passport) {
            set({
              level: data.passport.level || 'Novato',
              stamps: data.passport.stamps || [],
              mileage: data.passport.mileage || 0,
              wishlist: data.passport.wishlist || [],
              completedMissions: data.passport.completedMissions || [],
              favoriteProvince: data.passport.favoriteProvince || '',
              avatar: data.passport.avatar || 'default',
              photos: data.passport.photos || [],
              treasures: data.passport.treasures || []
            });
          }
        } catch (err) {
          console.error('Falha ao carregar passaporte:', err);
        }
      },

      uploadAvatar: async (userId: string, file: File) => {
        try {
          const formData = new FormData();
          formData.append('user_id', userId);
          formData.append('avatar', file);

          const res = await fetch('/api/upload_avatar.php', {
            method: 'POST',
            body: formData,
          });

          const data = await res.json();
          if (data.success && data.avatarPath) {
            set({ avatar: data.avatarPath });
            return { success: true };
          }
          return { success: false, error: data.error || 'Erro no upload' };
        } catch (err) {
          console.error(err);
          return { success: false, error: 'Erro de ligação ao servidor' };
        }
      }
    }),
    {
      name: 'angola360-passport-storage',
    }
  )
);
