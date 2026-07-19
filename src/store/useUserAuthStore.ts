import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePassportStore } from './usePassportStore';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserAuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string) => void;
  logout: () => void;
}

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        if (import.meta.env.DEV) {
          // Fallback mock para desenvolvimento local sem PHP
          const name = email.split('@')[0];
          const user = { id: Date.now().toString(), name, email };
          set({ user, isAuthenticated: true });
          usePassportStore.getState().setName(name);
          return;
        }

        try {
          const res = await fetch('/api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, isAuthenticated: true });
            usePassportStore.getState().setName(data.user.name);
            await usePassportStore.getState().loadFromServer(data.user.id);
          } else {
            alert('Erro no login: ' + data.error);
          }
        } catch (error) {
          console.error('API Error:', error);
          alert('Não foi possível conectar ao servidor.');
        }
      },
      register: async (name, email, password) => {
        if (import.meta.env.DEV) {
          // Fallback mock
          const user = { id: Date.now().toString(), name, email };
          set({ user, isAuthenticated: true });
          usePassportStore.getState().setName(name);
          return;
        }

        try {
          const res = await fetch('/api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, isAuthenticated: true });
            usePassportStore.getState().setName(data.user.name);
          } else {
            alert('Erro no registo: ' + data.error);
          }
        } catch (error) {
          console.error('API Error:', error);
          alert('Não foi possível conectar ao servidor.');
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'angola360_user_auth',
    }
  )
);
