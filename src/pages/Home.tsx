import { Link } from 'react-router-dom';
import { Compass, Map as MapIcon, ChevronDown } from 'lucide-react';
import AngolaMap from '../components/ui/AngolaMap';

export default function Home() {
  const demoTours = [
    { title: 'Fortaleza de São Miguel', province: 'Luanda', image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&h=400&fit=crop&fm=webp' },
    { title: 'Praia da Caotinha', province: 'Benguela', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&fm=webp' },
    { title: 'Serra da Leba', province: 'Huíla', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&fm=webp' },
  ];



  return (
    <div className="flex-1 w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Background Video/Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dark-bg z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          >
            <source src="/assets/images/herov.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto pt-20">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
            Angola <span className="text-secondary font-black uppercase drop-shadow-xl">360</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
            Mergulhe na alma de Angola. De Cabinda ao Cunene, explore as paisagens mais deslumbrantes, a cultura vibrante e os segredos escondidos de cada província, tudo sem sair de casa.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/explore" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(214,38,38,0.4)]">
              <Compass size={24} />
              Iniciar Jornada
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 z-20 animate-bounce text-white/50">
          <span className="text-sm uppercase tracking-widest block mb-2">Deslize para descobrir</span>
          <ChevronDown size={24} className="mx-auto" />
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Destaques Recentes</h2>
            <p className="text-text-muted text-lg">Os destinos mais populares explorados pela comunidade.</p>
          </div>
          <Link to="/explore" className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors font-bold uppercase tracking-widest text-sm">
            Ver todos <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demoTours.map((tour, idx) => (
            <Link key={idx} to={`/tour/${tour.province.toLowerCase()}`} className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-dark-card transition-transform hover:-translate-y-2 border border-white/5 shadow-xl">
              <div className="absolute inset-0">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
                360°
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">{tour.province}</span>
                <h3 className="text-2xl text-white font-bold leading-tight group-hover:text-secondary transition-colors">{tour.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Link to="/explore" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 w-full justify-center">
            Ver todos os destinos <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Map Section CTA */}
      <section className="py-24 px-6 bg-black/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <MapIcon size={48} className="mx-auto text-secondary mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">O Mosaico de Províncias</h2>
          <p className="text-xl text-text-muted">
            Selecione um destino no mapa interativo e deixe-se levar pela magia de cada província angolana.
          </p>
        </div>
        <AngolaMap />
      </section>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}
