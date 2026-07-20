import { useState } from 'react';
import { Landmark, Compass, Leaf, Check, X } from 'lucide-react';
import { usePassportStore } from '../../store/usePassportStore';

interface ArchetypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  canCloseWithoutSelecting?: boolean;
}

const ARCHETYPES = [
  {
    id: 'Historiador',
    label: 'O Historiador',
    description: 'Fascinado pelas lendas, fortificações e monumentos que moldaram a nossa nação. Focado em património e tesouros culturais.',
    icon: Landmark,
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    border: 'hover:border-amber-500/50 border-white/10',
    selectedBorder: 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    iconColor: 'text-amber-400 bg-amber-500/10',
    badge: 'Património & Cultura'
  },
  {
    id: 'Aventureiro',
    label: 'O Aventureiro',
    description: 'Destemido e sempre pronto a trilhar novos caminhos. Focado na quilometragem virtual e em desbravar todas as províncias.',
    icon: Compass,
    gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
    border: 'hover:border-red-500/50 border-white/10',
    selectedBorder: 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    iconColor: 'text-red-400 bg-red-500/10',
    badge: 'Rotas & Exploração'
  },
  {
    id: 'Amante da Natureza',
    label: 'O Amante da Natureza',
    description: 'Procura a serenidade das quedas de água, das praias selvagens e da fauna exótica angolana. Focado em ecoturismo.',
    icon: Leaf,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'hover:border-emerald-500/50 border-white/10',
    selectedBorder: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
    iconColor: 'text-emerald-400 bg-emerald-500/10',
    badge: 'Ecoturismo & Praias'
  }
];

export default function ArchetypeModal({ isOpen, onClose, canCloseWithoutSelecting = false }: ArchetypeModalProps) {
  const { archetype, setArchetype } = usePassportStore();
  const [selected, setSelected] = useState<string>(archetype || 'Historiador');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected) {
      setArchetype(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b0b0b] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Defina o Seu Perfil de Explorador</h2>
            <p className="text-white/50 text-sm mt-1">Como deseja vivenciar a sua viagem virtual por Angola?</p>
          </div>
          {canCloseWithoutSelecting && (
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 custom-scrollbar">
          {ARCHETYPES.map((arch) => {
            const isSelected = selected === arch.id;
            const IconComponent = arch.icon;
            
            return (
              <div
                key={arch.id}
                onClick={() => setSelected(arch.id)}
                className={`cursor-pointer p-5 rounded-2xl border bg-gradient-to-r ${arch.gradient} flex items-start gap-4 transition-all duration-300 transform hover:scale-[1.01] ${
                  isSelected ? arch.selectedBorder : arch.border
                }`}
              >
                <div className={`p-3.5 rounded-xl ${arch.iconColor} shrink-0`}>
                  <IconComponent size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-lg text-white">{arch.label}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                      {arch.badge}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed font-light">{arch.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                  isSelected ? 'bg-white border-white text-black' : 'border-white/20'
                }`}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center justify-end bg-black/20 shrink-0">
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-white hover:bg-white/90 text-black px-8 py-3.5 rounded-xl font-bold transition-all transform active:scale-95 text-center shadow-lg hover:shadow-white/5"
          >
            Confirmar Perfil e Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
