import { useState, useEffect } from 'react';
import { MapPin, Calendar, Flag, Search, Trash2, Edit2, Check, Book, User, Camera, Trophy, Globe, ArrowRight } from 'lucide-react';
import { usePassportStore, MISSIONS_CATALOG } from '../store/usePassportStore';
import { useUserAuthStore } from '../store/useUserAuthStore';
import { PROVINCES_DATA } from '../data/provincesData';
import AvatarSelector from '../components/passport/AvatarSelector';
import PassportBook from '../components/passport/PassportBook';
import ShareCard from '../components/passport/ShareCard';
import ArchetypeModal from '../components/passport/ArchetypeModal';
import LoginModal from '../components/auth/LoginModal';

const PROVINCES = PROVINCES_DATA.map(p => p.name);

export default function Passport() {
  const {
    name, level, stamps, mileage, memberSince,
    treasures, completedMissions, favoriteProvince, archetype,
    setName, setFavoriteProvince, resetProgress
  } = usePassportStore();

  const { isAuthenticated } = useUserAuthStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [isArchetypeModalOpen, setIsArchetypeModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !archetype) {
      setIsArchetypeModalOpen(true);
    }
  }, [archetype, isAuthenticated]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const getArchetypeDetails = () => {
    switch (archetype) {
      case 'Historiador':
        return { label: 'Historiador', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40' };
      case 'Aventureiro':
        return { label: 'Aventureiro', color: 'text-red-400 bg-red-500/10 border-red-500/20 hover:border-red-500/40' };
      case 'Amante da Natureza':
        return { label: 'Amante da Natureza', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40' };
      default:
        return { label: 'Definir Perfil', color: 'text-white/40 bg-white/5 border-white/10 hover:border-white/30' };
    }
  };

  const archDetails = getArchetypeDetails();

  const progressPercentage = Math.round((stamps.length / 21) * 100);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 w-full relative pb-24">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 via-dark-bg to-dark-bg pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-32 lg:pt-40 relative z-10">
          
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Book size={32} className="text-primary" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-xl">
              O Teu Passaporte Para Uma <span className="text-primary">Angola Inexplorada</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10">
              Muito mais do que um simples registo. O Passaporte Angola360 é a tua identidade de explorador virtual. Coleciona carimbos, desbloqueia missões interativas e guarda as tuas melhores memórias.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(214,38,38,0.3)] hover:scale-105 flex items-center justify-center gap-2"
              >
                <User size={20} />
                Criar Conta de Explorador
              </button>
              <a href="#features" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
                Saber Mais
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
            <div className="glass rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
              <div className="w-full h-48 bg-black/50 relative overflow-hidden">
                <img src="/images/features/explore.png" alt="Exploração" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-6 -mt-14 relative z-10 backdrop-blur-md">
                  <Globe className="text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Exploração com Propósito</h3>
                <p className="text-white/60 leading-relaxed">
                  Cada província que visitas nas nossas tours imersivas 360º dá-te um carimbo único. O teu objetivo? Colecionar os 21 carimbos nacionais.
                </p>
              </div>
            </div>
            
            <div className="glass rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
              <div className="w-full h-48 bg-black/50 relative overflow-hidden">
                <img src="/images/features/gamification.png" alt="Missões e Gamificação" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-center mb-6 -mt-14 relative z-10 backdrop-blur-md">
                  <Trophy className="text-secondary" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Missões e Gamificação</h3>
                <p className="text-white/60 leading-relaxed">
                  Ganha pontos de experiência (XP) e desbloqueia níveis como "Viajante" e "Embaixador 360" ao encontrares tesouros escondidos nas tours.
                </p>
              </div>
            </div>

            <div className="glass rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/20 transition-all hover:-translate-y-1 overflow-hidden">
              <div className="w-full h-48 bg-black/50 relative overflow-hidden">
                <img src="/images/features/logbook.png" alt="Diário Pessoal" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-6 -mt-14 relative z-10 backdrop-blur-md">
                  <Camera className="text-purple-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">O Teu Diário Pessoal</h3>
                <p className="text-white/60 leading-relaxed">
                  Usa a câmara virtual para capturar o ângulo perfeito durante a tua viagem. Guarda as fotos no teu diário e partilha o teu Bilhete de Explorador.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="glass p-10 md:p-16 rounded-3xl border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">Estás pronto para a viagem?</h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto relative z-10">
              Junta-te a nós e começa a catalogar as tuas visitas virtuais pelo património deslumbrante de Angola. O registo é 100% gratuito.
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-secondary hover:bg-[#ffe033] text-black px-10 py-5 rounded-full font-black text-lg transition-transform active:scale-95 shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:scale-105 inline-flex items-center gap-3 relative z-10"
            >
              Começar a Explorar Agora <ArrowRight size={22} />
            </button>
          </div>

        </div>

        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 pt-32 lg:pt-40 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 relative z-10">
        
        {/* Sidebar / User Profile */}
        <aside className="glass p-8 rounded-3xl h-fit sticky top-28 flex flex-col gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <div className="text-center relative">
            <div className="mx-auto flex justify-center mb-6">
              <AvatarSelector />
            </div>
            
            {isEditingName ? (
              <div className="flex items-center justify-center gap-2 mb-2">
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="bg-black/40 text-white text-center font-bold text-xl rounded-lg px-3 py-1 border border-primary outline-none w-3/4"
                  autoFocus
                />
                <button onClick={handleSaveName} className="text-primary hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                  <Check size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mb-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                <h2 className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{name}</h2>
                <Edit2 size={16} className="text-white/30 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            )}
            
            <div className="flex flex-col items-center gap-2 mt-3">
              <p className="text-secondary font-bold tracking-[0.2em] uppercase text-xs bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10 shadow-inner">{level}</p>
              <button 
                onClick={() => setIsArchetypeModalOpen(true)}
                className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border transition-all transform active:scale-95 cursor-pointer ${archDetails.color}`}
              >
                Perfil: {archDetails.label}
              </button>
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-5 border border-white/5 shadow-inner">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">Progresso Nacional</span>
              <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2.5 mb-4 border border-white/5 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPercentage}%` }}>
                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <span className="block text-2xl font-black text-white mb-1">{stamps.length}<span className="text-xs text-text-muted font-normal">/21</span></span>
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Carimbos</span>
              </div>
              <div className="text-center border-l border-white/10">
                <span className="block text-2xl font-black text-white mb-1">{mileage}</span>
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold">Km Virtuais</span>
              </div>
            </div>
          </div>

          <div className="space-y-5 bg-black/20 p-5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4 text-text-muted">
              <div className="bg-white/5 p-2 rounded-lg"><Calendar size={18} className="text-primary" /></div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider">Membro desde</span>
                <span className="text-white font-medium text-sm">{memberSince}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-text-muted">
              <div className="bg-white/5 p-2 rounded-lg"><MapPin size={18} className="text-secondary" /></div>
              <div className="flex-1">
                <span className="block text-[10px] uppercase tracking-wider">Província Favorita</span>
                <select 
                  value={favoriteProvince}
                  onChange={(e) => setFavoriteProvince(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 text-white text-sm pb-1 outline-none focus:border-primary mt-1 appearance-none cursor-pointer hover:border-white/30 transition-colors"
                >
                  <option value="" className="bg-dark-card">Selecione uma província...</option>
                  {PROVINCES.map(p => (
                    <option key={p} value={p} className="bg-dark-card">{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <button onClick={resetProgress} className="text-[11px] text-text-muted hover:text-red-500 hover:bg-red-500/10 py-3 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all font-medium uppercase tracking-wider border border-transparent hover:border-red-500/20">
            <Trash2 size={14} /> Fazer Reset ao Progresso
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex flex-col gap-8">
          
          {/* Card Sharing Area */}
          <section className="flex flex-col md:flex-row gap-8 items-center justify-between glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="flex-1 relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">O Teu Bilhete de Explorador</h3>
              <p className="text-white/70 mb-6">Aqui tens o teu cartão de identidade de membro do Angola360. Podes partilhá-lo no Instagram, WhatsApp ou onde quiseres para mostrares o teu progresso aos teus amigos!</p>
            </div>
            <div className="relative z-10 scale-90 md:scale-100 origin-center">
              <ShareCard />
            </div>
          </section>

          {/* Stamps Gallery */}
          <section className="glass p-8 rounded-3xl border border-white/10">
            <PassportBook />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Missions */}
            <section className="glass p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Flag className="text-secondary" /> Missões
              </h3>
              <div className="space-y-4">
                {MISSIONS_CATALOG.map(mission => {
                  const isCompleted = completedMissions.includes(mission.id);
                  return (
                  <div key={mission.id} className={`p-4 rounded-2xl border ${isCompleted ? 'bg-primary/10 border-primary/30' : 'bg-black/40 border-white/5'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded-full font-bold">{mission.type}</span>
                      {isCompleted && <span className="text-xs font-bold text-primary">Concluída</span>}
                    </div>
                    <h4 className={`font-bold mb-1 ${isCompleted ? 'text-white' : 'text-white/70'}`}>{mission.label}</h4>
                    <p className="text-sm text-text-muted mb-3">{mission.desc}</p>
                    <div className="text-xs font-medium flex gap-2 items-center text-white/50 bg-black/40 p-2 rounded-lg">
                      <span>🎁</span> {mission.reward}
                    </div>
                  </div>
                )})}
              </div>
            </section>

            {/* Logbook & Treasures */}
            <div className="flex flex-col gap-8">
              {/* Secção de fotos em standby
              <section className="glass p-8 rounded-3xl border border-white/10 flex-1">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <ImageIcon className="text-primary" /> Diário de Bordo
                </h3>
                {photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                          <span className="text-xs font-bold text-white">{photo.province}</span>
                          <span className="text-[10px] text-white/70">{photo.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-black/40 rounded-2xl border border-dashed border-white/10">
                    <Camera className="mx-auto mb-3 opacity-30" size={32} />
                    <p className="text-sm text-text-muted">Nenhuma foto capturada.</p>
                  </div>
                )}
              </section>
              */}

              <section className="glass p-8 rounded-3xl border border-white/10 flex-1">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Search className="text-secondary" /> Tesouros
                </h3>
                {treasures.length > 0 ? (
                  <div className="space-y-3">
                    {treasures.map((t, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                        <strong className="text-sm text-white">{t.label}</strong>
                        <span className="text-xs text-text-muted">{t.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">Nenhum tesouro encontrado.</p>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
      
      <ArchetypeModal 
        isOpen={isArchetypeModalOpen} 
        onClose={() => setIsArchetypeModalOpen(false)} 
        canCloseWithoutSelecting={!!archetype} 
      />
    </div>
  );
}
