import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { hashPassword, writeAuditLog } from '../lib/security';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
export type AdminUser = {
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
};

type AuthState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: (reason?: string) => void;
};

// ────────────────────────────────────────────────────────────────────────────
// Mock credentials: passwords are stored as SHA-256 hashes — never plain text.
// Hash of 'Angola360@2026': 1aa61c659b18c7f3a024c670b3ad207f1000abdf73dc79c7866b441df6823c9f
// (To be replaced by supabase.auth.signInWithPassword when connected)
// ────────────────────────────────────────────────────────────────────────────
const MOCK_ADMINS: Record<string, { passwordHash: string; user: AdminUser }> = {
  'admin@angola360.ao': {
    passwordHash: '1aa61c659b18c7f3a024c670b3ad207f1000abdf73dc79c7866b441df6823c9f',
    user: { email: 'admin@angola360.ao', name: 'Administrador', role: 'SUPER_ADMIN' }
  },
};

const SESSION_KEY = 'angola360_admin_session';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;   // 15 minutes
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const INACTIVITY_WARN_MS = 25 * 60 * 1000;    // warn at 25 minutes

// ────────────────────────────────────────────────────────────────────────────
// Rate Limiting Helpers
// ────────────────────────────────────────────────────────────────────────────
function getAttemptData(): { count: number; lockedUntil: number } {
  try {
    const raw = sessionStorage.getItem('angola360_login_attempts');
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function recordAttempt() {
  const data = getAttemptData();
  const newCount = data.count + 1;
  const lockedUntil = newCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : data.lockedUntil;
  sessionStorage.setItem('angola360_login_attempts', JSON.stringify({ count: newCount, lockedUntil }));
  return newCount;
}

function resetAttempts() {
  sessionStorage.removeItem('angola360_login_attempts');
}

// ────────────────────────────────────────────────────────────────────────────
// Session Helpers
// ────────────────────────────────────────────────────────────────────────────
function saveSession(user: AdminUser) {
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8-hour hard expiry
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, expiresAt }));
}

function loadSession(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { user, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return user as AdminUser;
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// ────────────────────────────────────────────────────────────────────────────
// Context
// ────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inactivity timers
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doLogout = useCallback((reason = 'logout') => {
    if (user) {
      writeAuditLog({ adminEmail: user.email, action: 'LOGOUT', resource: 'session', details: reason });
    }
    clearSession();
    setUser(null);
  }, [user]);

  // Reset inactivity timer on user activity
  const resetInactivityTimer = useCallback(() => {
    if (!user) return;
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warnTimer.current) clearTimeout(warnTimer.current);

    warnTimer.current = setTimeout(() => {
      // Show a subtle browser confirm at 25 min
      const stay = window.confirm('A sua sessão irá expirar em 5 minutos por inatividade. Deseja continuar?');
      if (!stay) doLogout('user_confirmed_logout_on_inactivity_warning');
    }, INACTIVITY_WARN_MS);

    inactivityTimer.current = setTimeout(() => {
      doLogout('inactivity_timeout');
      window.alert('Sessão encerrada por inatividade. Por favor inicie sessão novamente.');
    }, INACTIVITY_TIMEOUT_MS);
  }, [user, doLogout]);

  // Attach activity listeners when user is authenticated
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

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. Check lockout
    const { lockedUntil } = getAttemptData();
    if (Date.now() < lockedUntil) {
      const minsLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
      return { success: false, error: `Conta bloqueada. Tente novamente em ${minsLeft} minuto(s).` };
    }

    // Simulate network delay
    await new Promise(res => setTimeout(res, 1200));

    // 2. Hash the provided password and compare
    const sanitizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const record = MOCK_ADMINS[sanitizedEmail];

    if (!record || record.passwordHash !== passwordHash) {
      const attempts = recordAttempt();
      const remaining = MAX_LOGIN_ATTEMPTS - attempts;

      writeAuditLog({
        adminEmail: sanitizedEmail,
        action: 'LOGIN_FAILED',
        resource: 'session',
        details: `Attempt ${attempts}/${MAX_LOGIN_ATTEMPTS}`
      });

      if (remaining <= 0) {
        return { success: false, error: 'Demasiadas tentativas. Conta bloqueada por 15 minutos.' };
      }
      return { success: false, error: `Credenciais inválidas. ${remaining} tentativa(s) restante(s).` };
    }

    // 3. Success
    resetAttempts();
    saveSession(record.user);
    setUser(record.user);

    writeAuditLog({
      adminEmail: record.user.email,
      action: 'LOGIN_SUCCESS',
      resource: 'session',
      details: `Role: ${record.user.role}`
    });

    return { success: true };
  };

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
