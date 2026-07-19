import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePassportStore } from './usePassportStore';

// ═══════════════════════════════════════════════════════════════════════════
// useUserAuthStore — Auth do utilizador público (frontend)
// ═══════════════════════════════════════════════════════════════════════════
// Segurança:
//   - `credentials: 'include'` em todos os fetch → envia cookie de sessão PHP.
//   - ID do utilizador nunca é passado do cliente para o servidor (anti-IDOR).
//     O servidor identifica o user pela sessão.
//   - loadFromServer() não recebe userId (lê da sessão no backend).
//   - Em DEV sem backend, fallback mock local.
// ═══════════════════════════════════════════════════════════════════════════

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserAuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
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
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, isAuthenticated: true });
            usePassportStore.getState().setName(data.user.name);
            // Carregar passaporte do servidor (sessão identifica o user)
            await usePassportStore.getState().loadFromServer();
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
          const user = { id: Date.now().toString(), name, email };
          set({ user, isAuthenticated: true });
          usePassportStore.getState().setName(name);
          return;
        }

        try {
          const res = await fetch('/api/register.php', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
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

      logout: async () => {
        if (!import.meta.env.DEV) {
          try {
            await fetch('/api/logout.php', { method: 'POST', credentials: 'include' });
          } catch {
            /* ignora — cliente desloga localmente mesmo assim */
          }
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'angola360_user_auth',
    }
  )
);
