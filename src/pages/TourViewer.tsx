import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Camera, Volume2, MapPin, Compass, User, Settings, ArrowLeft, Map, HelpCircle, CheckCircle } from 'lucide-react';
import { usePassportStore } from '../store/usePassportStore';
import PannellumViewer from '../components/tour/PannellumViewer';

export default function TourViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const unlockStamp = usePassportStore(state => state.unlockStamp);
  const addPhoto = usePassportStore(state => state.addPhoto);
  
  const [showPhotoAlert, setShowPhotoAlert] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMission, setShowMission] = useState(false);
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

  // Base de dados simulada para as Tours 360
  const toursData: Record<string, any> = {
    '1': {
      title: 'BAÍA DE LUANDA',
      province: 'LUANDA',
      author: 'Google Street View',
      elevation: '4m',
      image: 'https://pannellum.org/images/alma.jpg',
      quiz: { question: 'Qual é o nome da fortaleza icónica de Luanda?', answers: ['São Miguel', 'São Pedro', 'Kikombo', 'Muxima'] },
      hotspots: [{ pitch: -5, yaw: 110, type: 'info', text: 'Marginal de Luanda' }]
    },
    '2': {
      title: 'PRAIA MORENA',
      province: 'BENGUELA',
      author: 'Google Street View',
      elevation: '2m',
      image: 'https://pannellum.org/images/cerro-toco-0.jpg',
      quiz: { question: 'Que comboio famoso tem a sua estação central em Benguela?', answers: ['Caminho de Ferro de Benguela', 'Linha de Luanda'] },
      hotspots: [{ pitch: 0, yaw: -45, type: 'info', text: 'Areias Brancas' }]
    },
    '3': {
      title: 'FENDA DA TUNDAVALA',
      province: 'HUÍLA',
      author: 'Google Street View',
      elevation: '2200m',
      image: 'https://pannellum.org/images/jfk.jpg',
      quiz: { question: 'A Fenda da Tundavala fica próxima de que cidade?', answers: ['Lubango', 'Matala', 'Namibe'] }
    }
  };

  const currentTourId = id?.toLowerCase() || '1';
  const tour = toursData[currentTourId] || {
    title: 'DESTINO DESCONHECIDO',
    province: 'ANGOLA',
    elevation: '120m',
    image: 'https://pannellum.org/images/alma.jpg',
    quiz: { question: 'Qual é a capital desta província?', answers: ['Luanda', 'Benguela'] },
    hotspots: []
  };

  useEffect(() => {
    if (tour.province) {
      unlockStamp(tour.province);
    }
  }, [tour.province, unlockStamp]);

  const handleTakePhoto = () => {
    addPhoto(tour.image, tour.province);
    setShowPhotoAlert(true);
    setTimeout(() => setShowPhotoAlert(false), 3000);
  };

  return (
    <div ref={viewerContainerRef} className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* 360 Viewer Layer (Bottom most) */}
      <div className="absolute inset-0 w-full h-full">
        <PannellumViewer 
          image={tour.image} 
          title={tour.title}
          author={tour.author}
          hotSpots={tour.hotspots || []}
        />
      </div>

      {/* Left Navigation Sidebar */}
      <div className="absolute top-0 left-0 h-full w-20 md:w-24 bg-black/60 backdrop-blur-xl border-r border-white/10 flex flex-col items-center justify-between py-8 z-20">
        
        {/* Brand/Logo Area */}
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
          <div className="text-primary font-black text-2xl tracking-tighter">A<span className="text-white">360</span></div>
          <span className="text-[9px] font-bold text-white/50 tracking-widest">VR</span>
        </div>

        {/* Center Icons */}
        <div className="flex flex-col gap-10">
          <Link to="/explore" className="flex flex-col items-center gap-2 group">
            <Compass size={24} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-primary font-bold">Explorar</span>
          </Link>
          <button className="flex flex-col items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity">
            <Map size={24} className="text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-white font-medium">Mapa</span>
          </button>
          <Link to="/explore" className="flex flex-col items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity">
            <MapPin size={24} className="text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-white font-medium">Destinos</span>
          </Link>
          <Link to="/passport" className="flex flex-col items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity">
            <User size={24} className="text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-white font-medium">Perfil</span>
          </Link>
          <button className="flex flex-col items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity">
            <Settings size={24} className="text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-white font-medium">Definições</span>
          </button>
        </div>

        {/* Bottom Back Button */}
        <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/20 rounded-full transition-colors" title="Voltar">
          <ArrowLeft size={20} className="text-white" />
        </button>
      </div>

      {/* Top Left Information Overlay */}
      <div className="absolute top-10 left-28 md:left-36 z-20 pointer-events-none">
        <div className="text-white/70 text-sm font-medium tracking-[0.2em] uppercase mb-2">Angola360 VR</div>
        <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl uppercase max-w-2xl leading-tight">
          {tour.province}:<br />{tour.title}
        </h1>
        <div className="text-white/50 text-sm font-medium tracking-widest mt-3">IMERSÃO 360°</div>
      </div>

      {/* Photo Alert Toast */}
      {showPhotoAlert && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 bg-primary/20 backdrop-blur-md border border-primary/50 text-white px-6 py-3 rounded-full flex items-center gap-3 text-sm font-bold shadow-[0_0_30px_rgba(214,38,38,0.4)] animate-fade-in-down">
          <CheckCircle size={18} className="text-primary" /> Captura Guardada no Passaporte!
        </div>
      )}

      {/* Bottom Center Console (Pill) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-8 py-5 flex items-center gap-8 shadow-2xl">
          
          {/* Location Info */}
          <div className="flex flex-col border-r border-white/10 pr-8 min-w-[200px]">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Localização Atual</span>
            <span className="text-white font-bold text-lg leading-none mb-1">{tour.title}</span>
            <span className="text-white/40 text-[10px]">Lat: -12.3847° / Lng: 17.5830°</span>
          </div>

          <div className="flex flex-col border-r border-white/10 pr-8">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Altitude</span>
            <span className="text-white font-bold text-lg">{tour.elevation}</span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-4">
            <button onClick={handleTakePhoto} className="w-12 h-12 bg-white/10 hover:bg-primary border border-white/20 hover:border-primary rounded-full flex items-center justify-center transition-all group" title="Tirar Foto">
              <Camera size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <button className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all group" title="Áudio Guia">
              <Volume2 size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <button onClick={() => setShowMission(!showMission)} className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all group ${showMission ? 'bg-secondary border-secondary text-black' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} title="Missão Local">
              <HelpCircle size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side Panels */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-4">
        
        {/* VR/Fullscreen Mode Toggle */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4">
          <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">Ecrã Inteiro</span>
          <button 
            onClick={toggleFullscreen}
            className={`w-14 h-7 rounded-full p-1 transition-colors relative flex items-center ${isFullscreen ? 'bg-blue-500' : 'bg-white/20'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${isFullscreen ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Interactive Mission Panel (Only shows when toggled from bottom bar) */}
        <div className={`transition-all duration-500 origin-bottom-right ${showMission ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
          <div className="w-80 bg-black/60 backdrop-blur-2xl border border-secondary/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-secondary/10">
              <HelpCircle size={100} />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-secondary tracking-widest uppercase block mb-2">Missão de Conhecimento</span>
              <h3 className="text-lg font-bold text-white mb-4 leading-snug">{tour.quiz.question}</h3>
              <div className="flex flex-col gap-2">
                {tour.quiz.answers.map((answer: string, i: number) => (
                  <button key={i} className="text-left bg-white/5 hover:bg-secondary/20 border border-white/10 hover:border-secondary/50 px-4 py-2.5 rounded-xl text-sm text-white/90 font-medium transition-colors">
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
