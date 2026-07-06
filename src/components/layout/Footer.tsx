import { Link } from 'react-router-dom';
import { Camera, MapPin, Mail, ArrowRight, MessageCircle, Globe, Video } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/5 relative overflow-hidden mt-auto">
      {/* Decoração de fundo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Coluna 1: Branding */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white">
              ANGOLA<span className="text-primary">360</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              A maior plataforma de experiências imersivas de Angola. Descubra as riquezas naturais e culturais do país sem sair do lugar.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white hover:border-primary transition-all">
                <Video size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navegação</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/" className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2"><ArrowRight size={14} className="text-primary opacity-0 -ml-4 transition-all" /> Início</Link></li>
              <li><Link to="/explore" className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2"><ArrowRight size={14} className="text-primary opacity-0 -ml-4 transition-all" /> Explorar Províncias</Link></li>
              <li><Link to="/passport" className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2"><ArrowRight size={14} className="text-primary opacity-0 -ml-4 transition-all" /> Passaporte 360</Link></li>
              <li><Link to="/sobre-nos" className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-2"><ArrowRight size={14} className="text-primary opacity-0 -ml-4 transition-all" /> Sobre o Projeto</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Links Úteis */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Suporte</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Central de Ajuda</a></li>
              <li><a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Termos e Condições</a></li>
              <li><a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Política de Privacidade</a></li>
              <li><a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Direitos de Autor</a></li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Fique Atualizado</h4>
            <p className="text-white/50 text-sm mb-4">
              Receba notificações quando adicionarmos novos cenários e províncias ao nosso catálogo 360º.
            </p>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <Mail className="absolute left-4 text-white/30" size={16} />
              <input 
                type="email" 
                placeholder="O seu email" 
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl py-3 pl-11 pr-24 outline-none focus:border-primary transition-colors"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Subscrever
              </button>
            </form>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-white/30 text-xs text-center md:text-left">
            &copy; {currentYear} Angola360. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 text-white/30 text-xs font-medium">
            <span className="flex items-center gap-1.5"><Camera size={14} /> Desenvolvido por Flopes</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Feito em Angola</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
