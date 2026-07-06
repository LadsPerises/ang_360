import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Settings, LogOut, Bell, Search, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Gestão de Tours', icon: Map, path: '/admin/tours' },
    { name: 'Utilizadores', icon: Users, path: '/admin/users' },
    { name: 'Auditoria', icon: Activity, path: '/admin/audit' },
    { name: 'Configurações', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col transition-all duration-300">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/admin/dashboard" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            ANGOLA<span className="text-primary">360</span>
            <span className="text-[10px] uppercase tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded ml-2">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive ? 'bg-primary text-white shadow-[0_4px_20px_rgba(214,38,38,0.3)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={18} className={isActive ? 'text-white' : 'text-white/50'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-medium text-sm">
            <LogOut size={18} />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-[#111111] border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div className="relative w-96 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar tours, utilizadores..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <button className="relative text-white/60 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#111] animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user?.name ?? 'Admin'}</p>
                <p className="text-xs text-white/50">{user?.role === 'SUPER_ADMIN' ? 'Super Administrador' : 'Administrador'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg text-sm">
                {user?.name?.split(' ').map(n => n[0]).slice(0,2).join('') ?? 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none z-0"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
