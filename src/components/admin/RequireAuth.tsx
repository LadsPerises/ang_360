import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// ═══════════════════════════════════════════════════════════════════════════
// RequireAuth — Guarda de rota para a área admin
// ═══════════════════════════════════════════════════════════════════════════
// Defense in depth (2 camadas):
//   1. Backend:  /api/admin/me.php devolve 401 se não for admin
//   2. Frontend: RequireAuth valida role ∈ {Admin, SUPER_ADMIN}
//
// Um utilizador comum autenticado pelo /api/login.php:
//   - Recebe 401 do me.php admin → isAuthenticated=false → redirecionado
//   - Mesmo que a sessão vazasse, isAuthenticated=true mas role='User'
//     → validação local abaixo redireciona para acesso-negado.
// ═══════════════════════════════════════════════════════════════════════════

const ADMIN_ROLES = ['Admin', 'SUPER_ADMIN'] as const;
const isAdminRole = (role: string | undefined): boolean =>
  !!role && (ADMIN_ROLES as readonly string[]).includes(role);

export default function RequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Enquanto restaura sessão: ecrã de loading (não faiscar login)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm tracking-widest uppercase">A verificar sessão...</p>
        </div>
      </div>
    );
  }

  // Não autenticado → login
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // Autenticado mas NÃO é admin → acesso negado (não pode ver o painel)
  if (!isAdminRole(user?.role)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111] border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Acesso Negado</h1>
          <p className="text-white/60 mb-6">
            A sua conta não tem permissões de administrador.
          </p>
          <a
            href="/"
            className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors border border-white/10"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
