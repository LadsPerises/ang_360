import { useState, useRef } from 'react';
import { usePassportStore } from '../../store/usePassportStore';
import { useUserAuthStore } from '../../store/useUserAuthStore';
import { Camera, UploadCloud } from 'lucide-react';

const AVATARS = [
  { id: 'default', label: 'Explorador', emoji: '🧑‍🚀' },
  { id: 'palanca', label: 'Palanca Negra', emoji: '🦌' },
  { id: 'pensador', label: 'O Pensador', emoji: '🗿' },
  { id: 'welwitschia', label: 'Welwitschia', emoji: '🌿' },
  { id: 'batuque', label: 'Batuque', emoji: '🥁' },
  { id: 'sol', label: 'Sol de Angola', emoji: '☀️' },
];

export default function AvatarSelector() {
  const { avatar, setAvatar, uploadAvatar } = usePassportStore();
  const { user } = useUserAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAvatar = AVATARS.find(a => a.id === avatar);
  const isCustomImage = avatar.startsWith('/uploads/');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    const res = await uploadAvatar(user.id, file);
    setIsUploading(false);
    setIsOpen(false);
    
    if (!res.success) {
      alert(res.error || 'Erro ao carregar fotografia');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-black/40 border border-white/20 rounded-full flex items-center justify-center text-4xl hover:bg-white/10 transition-colors shadow-xl overflow-hidden relative"
        title="Mudar Avatar"
      >
        {isCustomImage ? (
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          currentAvatar?.emoji || AVATARS[0].emoji
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-1.5 text-white shadow-lg">
          <Camera size={14} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-24 left-0 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-64 shadow-2xl z-50">
          <h4 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
            Escolhe o teu Avatar
          </h4>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-4 flex flex-col items-center justify-center py-4 rounded-xl border border-dashed border-white/20 hover:border-white/50 hover:bg-white/5 transition-all text-white/70 hover:text-white"
          >
            <UploadCloud size={24} className="mb-2" />
            <span className="text-xs font-medium">Carregar Fotografia</span>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
            />
          </button>
          
          <div className="grid grid-cols-3 gap-2">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => {
                  setAvatar(a.id);
                  setIsOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-xl transition-all ${avatar === a.id ? 'bg-primary/20 border border-primary/50' : 'hover:bg-white/10 border border-transparent'}`}
              >
                <span className="text-2xl mb-1">{a.emoji}</span>
                <span className="text-[10px] text-white/70 text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
