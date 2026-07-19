import { useState } from 'react';
import { MapPin, Calendar, Flag, Search, Trash2, Edit2, Check } from 'lucide-react';
import { usePassportStore, MISSIONS_CATALOG } from '../store/usePassportStore';
import { PROVINCES_DATA } from '../data/provincesData';
import AvatarSelector from '../components/passport/AvatarSelector';
import PassportBook from '../components/passport/PassportBook';
import ShareCard from '../components/passport/ShareCard';

const PROVINCES = PROVINCES_DATA.map(p => p.name);

export default function Passport() {
  const {
    name, level, stamps, mileage, memberSince,
    treasures, completedMissions, favoriteProvince,
    setName, setFavoriteProvince, resetProgress
  } = usePassportStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const progressPercentage = Math.round((stamps.length / 21) * 100);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-12 relative">
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
            
            <p className="text-secondary font-bold tracking-[0.2em] uppercase text-xs mt-1 bg-white/5 inline-block px-3 py-1 rounded-full border border-white/10 shadow-inner">{level}</p>
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
    </div>
  );
}
