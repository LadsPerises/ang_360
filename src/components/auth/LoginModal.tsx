import { X, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useUserAuthStore } from '../../store/useUserAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useUserAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!name || !email) return;
      register(name, email, password);
    } else {
      if (!email) return;
      login(email, password);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-dark-card border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-2xl font-bold text-white">
            {isRegister ? 'Criar Conta' : 'Entrar'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <button className="flex items-center justify-center gap-3 w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors">
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continuar com Google
            </button>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-white/40 text-sm">ou continue com email</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome" 
                  className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu e-mail" 
                className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Sua senha" 
                className="w-full bg-dark-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>

            {!isRegister && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">Esqueci-me da senha</a>
              </div>
            )}

            <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-2">
              {isRegister ? 'Criar Nova Conta' : 'Entrar no Angola360'}
            </button>
          </form>

          <p className="text-center mt-6 text-white/50 text-sm">
            {isRegister ? 'Já tens uma conta? ' : 'Ainda não tens conta? '}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary font-bold hover:underline"
            >
              {isRegister ? 'Inicia sessão' : 'Regista-te agora'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
