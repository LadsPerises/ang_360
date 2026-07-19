import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to intended destination or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Erro desconhecido.');
      if (result.error?.includes('bloqueada')) {
        setIsLocked(true);
      }
      return;
    }

    // Sucesso — redirecionar imediatamente para o dashboard.
    // Preferimos a rota guardada (se vier de /admin/*) ou dashboard por defeito.
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center justify-center gap-2 mb-2">
            ANGOLA<span className="text-primary">360</span>
          </h1>
          <p className="text-white/50 text-sm font-medium uppercase tracking-widest">Acesso Administrativo</p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

          {/* Error Banner */}
          {error && (
            <div className={`flex items-start gap-3 rounded-xl p-4 mb-5 text-sm font-medium border ${isLocked ? 'bg-red-900/30 border-red-500/40 text-red-300' : 'bg-orange-900/20 border-orange-500/30 text-orange-300'}`}>
              {isLocked ? <ShieldAlert size={18} className="shrink-0 mt-0.5 text-red-400" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5 text-orange-400" />}
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5" noValidate>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Email corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@angola360.ao"
                  disabled={isLocked}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  required
                  maxLength={255}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLocked}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  required
                  maxLength={128}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="mt-4 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(214,38,38,0.3)] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Entrar no Painel <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-white/30 text-xs">
            <p>Acesso restrito a administradores autorizados.</p>
            <p>As suas ações são auditadas e monitorizadas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
