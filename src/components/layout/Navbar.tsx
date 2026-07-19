import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Book, User, Menu, X, LogOut } from 'lucide-react';
import LoginModal from '../auth/LoginModal';
import { useUserAuthStore } from '../../store/useUserAuthStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUserAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: '/explore', icon: Compass, label: 'Explorar' },
    { to: '/passport', icon: Book, label: 'Passaporte' },
    { to: '/sobre-nos', icon: null, label: 'Sobre Nós' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 px-6 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'py-3 bg-black/80 backdrop-blur-md shadow-lg border-b border-white/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-heading font-bold text-white flex items-center gap-2 relative z-50">
          <span className="text-primary">Angola</span>360
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, idx) => (
            <Link key={idx} to={link.to} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              {link.icon && <link.icon size={20} />}
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
          
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4 ml-4">
              <Link to="/passport" className="flex items-center gap-2 text-white font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name}
              </Link>
              <button 
                onClick={logout}
                className="text-white/60 hover:text-red-400 p-2 rounded-full transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="ml-4 bg-white/10 hover:bg-primary text-white border border-white/20 hover:border-primary px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-sm"
            >
              <User size={18} />
              Entrar
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden relative z-50 p-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-dark-bg/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-full'}`}>
        <div className="flex flex-col items-center gap-8 w-full px-6">
          {navLinks.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.to} 
              className="flex items-center gap-3 text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              {link.icon && <link.icon size={28} className="text-primary" />}
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user ? (
            <>
              <Link to="/passport" className="mt-4 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 w-full border border-white/20">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                O Meu Passaporte
              </Link>
              <button 
                onClick={logout}
                className="mt-4 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 w-full"
              >
                <LogOut size={24} />
                Terminar Sessão
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="mt-8 bg-primary text-white px-8 py-4 rounded-full font-bold text-xl transition-all duration-300 flex items-center gap-3 shadow-[0_0_20px_rgba(214,38,38,0.4)] w-full justify-center"
            >
              <User size={24} />
              Entrar na Conta
            </button>
          )}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
}

