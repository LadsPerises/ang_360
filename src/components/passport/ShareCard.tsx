import { useRef, useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { usePassportStore } from '../../store/usePassportStore';

const AVATARS = {
  'default': '🧑‍🚀',
  'palanca': '🦌',
  'pensador': '🗿',
  'welwitschia': '🌿',
  'batuque': '🥁',
  'sol': '☀️',
};

export default function ShareCard() {
  const { name, level, stamps, mileage, memberSince, avatar } = usePassportStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const emoji = AVATARS[avatar as keyof typeof AVATARS] || AVATARS['default'];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // High resolution
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Passaporte_Angola360_${name.replace(/\s+/g, '_')}.png`;
      link.click();
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Não foi possível gerar a imagem. Tenta novamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* The Card to capture */}
      <div 
        ref={cardRef}
        className="relative w-[340px] h-[520px] rounded-[2rem] overflow-hidden shadow-2xl p-8 flex flex-col justify-between"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Decorative Background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        
        {/* Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-white font-bold text-xl leading-none tracking-tighter">Angola360</h2>
            <p className="text-primary text-[10px] uppercase font-bold tracking-widest mt-1">Passaporte Digital</p>
          </div>
          <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-xl bg-white/5">
            {emoji}
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-8">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Explorador</p>
          <h3 className="text-3xl font-bold text-white mb-2">{name}</h3>
          
          <div className="inline-block bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <p className="text-secondary text-sm font-bold">{level}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Carimbos</p>
            <p className="text-2xl font-bold text-white">{stamps.length}<span className="text-sm text-white/50 font-normal">/21</span></p>
          </div>
          <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Kms Virtuais</p>
            <p className="text-2xl font-bold text-white">{mileage}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Membro Desde</p>
            <p className="text-white text-xs font-semibold">{memberSince}</p>
          </div>
          <div className="text-right">
            <p className="text-white/20 text-[10px] uppercase tracking-widest">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons (Not captured in image) */}
      <button 
        onClick={handleDownload}
        disabled={isDownloading}
        className={`flex items-center justify-center gap-2 w-[340px] py-4 rounded-2xl font-bold transition-all ${downloaded ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'} shadow-lg shadow-primary/20`}
      >
        {isDownloading ? (
          <span className="animate-pulse">A gerar cartão...</span>
        ) : downloaded ? (
          <>
            <Check size={20} /> Guardado!
          </>
        ) : (
          <>
            <Download size={20} /> Partilhar Cartão
          </>
        )}
      </button>
    </div>
  );
}
