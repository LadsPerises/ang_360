import { PROVINCES_DATA } from '../../data/provincesData';
import { usePassportStore } from '../../store/usePassportStore';

export default function PassportBook() {
  const { stamps } = usePassportStore();

  return (
    <div className="bg-[#f4f1ea] rounded-xl p-6 shadow-inner border-[12px] border-[#2c3e50] relative overflow-hidden min-h-[400px]">
      {/* Textura de fundo do passaporte */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif text-[#1a252f] uppercase tracking-widest border-b-2 border-[#1a252f]/20 pb-2 inline-block">
          Vistos e Carimbos
        </h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 relative z-10">
        {PROVINCES_DATA.map((province, index) => {
          const isStamped = stamps.includes(province.name);
          // Rotação pseudo-aleatória para dar aspeto real ao carimbo
          const rotate = isStamped ? (index * 17) % 40 - 20 : 0; 
          
          return (
            <div key={province.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center relative ${isStamped ? 'bg-transparent' : 'border-2 border-dashed border-[#1a252f]/20 bg-[#1a252f]/5'}`}
              >
                {isStamped ? (
                  <div 
                    className="absolute inset-0 border-4 border-red-600/80 rounded-full flex items-center justify-center opacity-90 shadow-sm"
                    style={{ transform: `rotate(${rotate}deg)` }}
                  >
                    <div className="text-[10px] font-bold text-red-600/80 text-center uppercase leading-none tracking-tighter">
                      <span className="block border-b border-red-600/30 pb-0.5 mb-0.5">Angola 360</span>
                      {province.name.substring(0, 8)}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[#1a252f]/30 font-bold">{index + 1}</span>
                )}
              </div>
              <span className="text-[10px] text-[#1a252f]/60 uppercase tracking-wider font-semibold text-center w-full truncate">
                {province.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
