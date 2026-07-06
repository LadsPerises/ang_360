import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // While checking session, show a minimal loading screen instead of flashing the login page
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

  if (!isAuthenticated) {
    // Redirect to login, remembering which page the user tried to visit
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
