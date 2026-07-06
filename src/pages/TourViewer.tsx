import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, Volume2, Info, MapPin, Calendar, User, Eye, Leaf, Landmark, Utensils, HelpCircle, ArrowLeft, CheckCircle, Maximize, Minimize, Thermometer } from 'lucide-react';
import { usePassportStore } from '../store/usePassportStore';
import PannellumViewer from '../components/tour/PannellumViewer';

export default function TourViewer() {
  const { id } = useParams();
  const unlockStamp = usePassportStore(state => state.unlockStamp);
  const addPhoto = usePassportStore(state => state.addPhoto);
  
  const [showPhotoAlert, setShowPhotoAlert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const [weatherData, setWeatherData] = useState<{ temp: number, isDay: number } | null>(null);

  const coordinates: Record<string, { lat: number, lon: number }> = {
    'Luanda': { lat: -8.8390, lon: 13.2894 },
    'Benguela': { lat: -12.5763, lon: 13.4055 },
    'Huíla': { lat: -14.9172, lon: 13.4925 },
    'Huambo': { lat: -12.7761, lon: 15.7392 },
    'default': { lat: -11.2027, lon: 17.8739 }
  };

  // Base de dados simulada para as Tours 360
  const toursData: Record<string, any> = {
    'luanda': {
      title: 'Baía de Luanda',
      province: 'Luanda',
      author: 'Google Street View',
      date: 'Maio 2026',
      bestTime: 'Todo o ano',
      highlights: ['Marginal de Luanda', 'Vista para a Ilha', 'Pôr do sol no mar'],
      description: 'A vibrante capital de Angola oferece uma mistura incrível de arquitetura moderna e edifícios coloniais históricos à beira-mar.',
      image: 'https://pannellum.org/images/alma.jpg',
      quiz: { question: 'Qual é o nome da fortaleza icónica de Luanda?', answers: ['São Miguel', 'São Pedro', 'Kikombo', 'Muxima'] },
      hotspots: [{ pitch: -5, yaw: 110, type: 'info', text: 'Marginal de Luanda' }]
    },
    'benguela': {
      title: 'Praia Morena',
      province: 'Benguela',
      author: 'Google Street View',
      date: 'Dezembro 2025',
      bestTime: 'Novembro a Março',
      highlights: ['Areias Brancas', 'Restaurantes Locais', 'Mar Calmo'],
      description: 'Conhecida pelas suas praias maravilhosas, Benguela é um dos destinos turísticos mais procurados para quem gosta de mar e sol.',
      image: 'https://pannellum.org/images/cerro-toco-0.jpg',
      quiz: { question: 'Que comboio famoso tem a sua estação central em Benguela?', answers: ['Caminho de Ferro de Benguela', 'Linha de Luanda', 'Comboio do Namibe', 'Expresso do Sul'] },
      hotspots: [{ pitch: 0, yaw: -45, type: 'info', text: 'Areias Brancas' }]
    },
    'huila': {
      title: 'Fenda da Tundavala',
      province: 'Huíla',
      author: 'Google Street View',
      date: 'Janeiro 2026',
      bestTime: 'Maio a Setembro',
      highlights: ['Abismo de 1200m', 'Vista Panorâmica', 'Formações Rochosas'],
      description: 'Uma das maiores maravilhas naturais de Angola, oferecendo uma vista vertiginosa e inesquecível sobre o horizonte.',
      image: 'https://pannellum.org/images/jfk.jpg',
      quiz: { question: 'A Fenda da Tundavala fica próxima de que cidade?', answers: ['Lubango', 'Matala', 'Namibe', 'Chibia'] }
    }
  };

  // Obter dados específicos da província ou usar um "fallback" (padrão)
  const currentTourId = id?.toLowerCase() || 'luanda';
  const displayId = id || 'luanda';
  const tour = toursData[currentTourId] || {
    title: displayId.charAt(0).toUpperCase() + displayId.slice(1),
    province: displayId.charAt(0).toUpperCase() + displayId.slice(1),
    author: 'Equipa Angola360',
    date: 'Brevemente',
    bestTime: 'Maio a Setembro',
    highlights: ['Cultura Local', 'Paisagem Única', 'Gastronomia'],
    description: 'Estamos a preparar a experiência 360º para esta província. Volte em breve para explorar este destino!',
    image: 'https://pannellum.org/images/alma.jpg', // Placeholder de teste
    quiz: {
      question: 'Qual é a capital desta província?',
      answers: ['Luanda', 'Benguela', 'Huambo', 'Lubango']
    },
    hotSpots: []
  };

  // Gamification: Unlock stamp on visit
  useEffect(() => {
    if (tour.province) {
      unlockStamp(tour.province);
      
      // Fetch Weather
      const fetchWeather = async () => {
        const coords = coordinates[tour.province] || coordinates['default'];
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`);
          const data = await res.json();
          if (data && data.current_weather) {
            setWeatherData({
              temp: data.current_weather.temperature,
              isDay: data.current_weather.is_day
            });
          }
        } catch (error) {
          console.error("Failed to fetch weather", error);
        }
      };
      fetchWeather();
    }
  }, [tour.province, unlockStamp]);

  const handleTakePhoto = () => {
    addPhoto(tour.image, tour.province);
    setShowPhotoAlert(true);
    setTimeout(() => setShowPhotoAlert(false), 3000);
  };

  return (
    <div className="flex-1 w-full bg-dark-bg">
      
      {/* 1. Header do Tour */}
      <header className="px-6 pt-32 pb-8 max-w-7xl mx-auto relative z-10">
        <Link to="/explore" className="text-text-muted hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium border border-white/5">
          <ArrowLeft size={16} /> Voltar aos destinos
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase mb-3">
              <span className="text-white/50">Angola</span>
              <span className="text-white/20">•</span>
              <span className="text-primary">{tour.province}</span>
              <span className="text-white/20">•</span>
              <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-md border border-secondary/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]">Património</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg tracking-tight">{tour.title}</h1>
          </div>
          <div className="flex gap-4">
            {weatherData && (
              <div className="bg-dark-card border border-white/10 px-6 py-3 rounded-2xl text-center shadow-lg">
                <span className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-1">Tempo Atual</span>
                <span className="text-white font-medium flex items-center justify-center gap-2">
                  <Thermometer size={14} className="text-secondary"/> {weatherData.temp}°C
                </span>
              </div>
            )}
            <div className="bg-dark-card border border-white/10 px-6 py-3 rounded-2xl text-center shadow-lg">
              <span className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-1">Clima Ideal</span>
              <span className="text-white font-medium flex items-center gap-2"><Calendar size={14} className="text-primary"/> {tour.bestTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Área de Mídia (Viewer Box) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-16">
        <div ref={viewerContainerRef} className={`relative w-full bg-black overflow-hidden group ${isFullscreen ? 'h-screen rounded-none' : 'h-[65vh] md:h-[80vh] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10'}`}>
          
          {/* Pannellum 360 Viewer */}
          <PannellumViewer 
            image={tour.image} 
            title={tour.title}
            author={tour.author}
            hotSpots={tour.hotspots || []}
          />
          
          {/* Overlays Superiores */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-10 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-3 text-xs font-bold text-white border border-white/10 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              EXPERIÊNCIA IMERSIVA 360°
            </div>
            {showPhotoAlert && (
              <div className="bg-secondary text-black px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold animate-bounce shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                <CheckCircle size={16} /> Foto guardada no diário!
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
            <button onClick={handleTakePhoto} className="bg-black/50 backdrop-blur-md border border-white/10 p-3.5 rounded-full hover:bg-primary transition-all group/btn shadow-lg" title="Tirar Foto para o Diário">
              <Camera size={22} className="text-white group-hover/btn:scale-110 transition-transform" />
            </button>
            <button className="bg-black/50 backdrop-blur-md border border-white/10 p-3.5 rounded-full hover:bg-secondary hover:text-black transition-all group/btn shadow-lg text-white" title="Áudio Guia">
              <Volume2 size={22} className="group-hover/btn:scale-110 transition-transform" />
            </button>
            <button onClick={toggleFullscreen} className="bg-black/50 backdrop-blur-md border border-white/10 p-3.5 rounded-full hover:bg-white/20 transition-all group/btn shadow-lg text-white mt-4" title={isFullscreen ? "Sair do Modo Ecrã Inteiro" : "Ecrã Inteiro"}>
              {isFullscreen ? <Minimize size={22} className="group-hover/btn:scale-110 transition-transform" /> : <Maximize size={22} className="group-hover/btn:scale-110 transition-transform" />}
            </button>
          </div>

          {/* Hotspot Filters */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
            {[
              { icon: Eye, title: 'Mostrar Tudo', active: true },
              { icon: Landmark, title: 'História / Património', active: false },
              { icon: Leaf, title: 'Natureza / Ecoturismo', active: false },
              { icon: Utensils, title: 'Sabores / Gastronomia', active: false },
            ].map((filter, i) => (
              <button key={i} className={`p-3.5 rounded-2xl transition-all duration-300 border ${filter.active ? 'bg-primary border-primary shadow-[0_0_20px_rgba(214,38,38,0.4)] text-white scale-110' : 'bg-black/40 backdrop-blur-md border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/30 hover:scale-105'}`} title={filter.title}>
                <filter.icon size={22} />
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-8 py-3 rounded-full text-sm font-medium text-white/90 pointer-events-none z-10 flex items-center gap-3 border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></span>
            Arraste para explorar o ambiente
          </div>
        </div>
      </div>

      {/* 3. Grid de Conteúdo */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Coluna Principal (Texto e Destaques) */}
        <div className="lg:col-span-8 space-y-12">
          
          <section className="glass p-8 md:p-10 rounded-3xl border border-white/5">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
              <Info className="text-primary" size={28} /> Sobre este destino
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {tour.description}
            </p>
          </section>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-8 rounded-3xl hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 border border-primary/30">
                <Leaf className="text-primary" size={24} />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">O que faz este lugar especial</h4>
              <ul className="space-y-3">
                {tour.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 font-medium">
                    <CheckCircle className="text-secondary shrink-0 mt-0.5" size={18} /> {h}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quiz Card */}
            <div className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 p-8 rounded-3xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 text-secondary/5 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <HelpCircle size={160} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest mb-4 bg-secondary/10 w-fit px-3 py-1.5 rounded-lg border border-secondary/20">
                  <HelpCircle size={14} /> Missão de Conhecimento
                </div>
                <h3 className="text-xl font-bold text-white mb-6 leading-tight">{tour.quiz.question}</h3>
                <div className="flex flex-col gap-2.5">
                  {tour.quiz.answers.map((answer: string, i: number) => (
                    <label key={i} className="flex items-center gap-3 bg-black/40 hover:bg-secondary/20 border border-white/5 hover:border-secondary/50 p-3.5 rounded-xl cursor-pointer transition-all">
                      <input type="radio" name="quiz" className="text-secondary focus:ring-secondary accent-secondary w-4 h-4" />
                      <span className="text-white/90 font-medium text-sm">{answer}</span>
                    </label>
                  ))}
                </div>
                <button className="mt-6 w-full bg-secondary hover:bg-[#ffe033] text-black py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                  Validar Resposta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral (Ficha Técnica) */}
        <aside className="lg:col-span-4">
          <div className="glass p-8 rounded-3xl sticky top-32 border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <MapPin className="text-primary" /> Dados da Viagem
            </h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="bg-white/10 p-3 rounded-xl"><User size={20} className="text-white" /></div>
                <div>
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Fotografia / Autor</span>
                  <span className="text-white font-bold">{tour.author}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <div className="bg-white/10 p-3 rounded-xl"><Calendar size={20} className="text-white" /></div>
                <div>
                  <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Data de Captura</span>
                  <span className="text-white font-bold">{tour.date}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 border-l-2 border-l-primary">
                <div className="bg-primary/20 p-3 rounded-xl"><Landmark size={20} className="text-primary" /></div>
                <div>
                  <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Localização</span>
                  <span className="text-white font-bold">{tour.province}</span>
                </div>
              </div>
            </div>

            <Link to="/explore" className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02]">
              Explorar Mais Destinos <ArrowLeft size={18} className="rotate-180" />
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
