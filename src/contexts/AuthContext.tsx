import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// AuthContext — Autenticação via backend PHP (sessão httpOnly)
// ═══════════════════════════════════════════════════════════════════════════
// Segurança:
//   - Credenciais NUNCA em código. Validadas pelo PHP com bcrypt.
//   - Sessão guardada em cookie httpOnly + SameSite=Strict → JS não lê token.
//   - `credentials: 'include'` em todos os fetch para enviar o cookie de sessão.
//   - Nada de hash hardcoded, nada de sessionStorage com role editável.
//   - Timeout por inatividade client-side (UX) + expiração real no servidor.
// ═══════════════════════════════════════════════════════════════════════════

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'User';
  avatarUrl?: string;
};

type AuthState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de fetch autenticados (enviam cookie de sessão)
// ─────────────────────────────────────────────────────────────────────────────
const API = {
  login: (email: string, password: string) =>
    fetch('/api/admin/login.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    fetch('/api/logout.php', { method: 'POST', credentials: 'include' }),
  me: () =>
    fetch('/api/me.php', { credentials: 'include' }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Constantes de inatividade (UX apenas — o servidor faz a validação real)
// ─────────────────────────────────────────────────────────────────────────────
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
const INACTIVITY_WARN_MS    = 25 * 60 * 1000; // warn at 25 min

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Timers de inatividade
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doLogout = useCallback(async () => {
    try { await API.logout(); } catch { /* servidor pode estar inacessível */ }
    setUser(null);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (!user) return;
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);

    warnTimer.current = setTimeout(() => {
      const stay = window.confirm('A sua sessão irá expirar em 5 minutos por inatividade. Deseja continuar?');
      if (!stay) doLogout();
    }, INACTIVITY_WARN_MS);

    inactivityTimer.current = setTimeout(() => {
      doLogout();
      window.alert('Sessão encerrada por inatividade. Por favor inicie sessão novamente.');
    }, INACTIVITY_TIMEOUT_MS);
  }, [user, doLogout]);

  // ─── Restaurar sessão no mount ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await API.me();
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.success && data.user) {
            setUser(data.user as AdminUser);
          }
        }
      } catch {
        // Sem rede/servidor: fica não autenticado
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Listeners de inatividade ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handler = () => resetInactivityTimer();
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetInactivityTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);
    };
  }, [user, resetInactivityTimer]);

  // ─── Login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    // Validações client-side básicas (UX); PHP é a fonte de verdade.
    if (!email.trim() || !password) {
      return { success: false, error: 'Preencha email e senha.' };
    }
    try {
      const res = await API.login(email.trim(), password);
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Credenciais inválidas.' };
      }
      setUser(data.user as AdminUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Servidor indisponível. Tente novamente.' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
