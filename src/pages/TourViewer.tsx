import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Volume2, MapPin, Compass, User, Settings, ArrowLeft, Map, HelpCircle, Play, Pause } from 'lucide-react';
import { usePassportStore } from '../store/usePassportStore';
import PannellumViewer from '../components/tour/PannellumViewer';

// Base de dados simulada para as Tours 360 (Movido para fora para manter referência estável)
const toursData: Record<string, any> = {
  '1': {
    title: 'BAÍA DE LUANDA',
    province: 'LUANDA',
    author: 'Google Street View',
    elevation: '4m',
    image: '/assets/360_padro/street_view_360.jpg',
    history: 'A vibrante capital de Angola oferece uma mistura incrível de arquitetura moderna e edifícios coloniais históricos à beira-mar. A Baía de Luanda foi palco de importantes rotas comerciais ao longo dos séculos e hoje representa o coração financeiro e cultural do país.',
    quiz: { question: 'Qual é o nome da fortaleza icónica de Luanda?', answers: ['São Miguel', 'São Pedro', 'Kikombo', 'Muxima'] },
    hotspots: [{ pitch: -5, yaw: 110, type: 'info', text: 'Marginal de Luanda' }]
  },
  '2': {
    title: 'PRAIA MORENA',
    province: 'BENGUELA',
    author: 'Google Street View',
    elevation: '2m',
    image: '/assets/360_padro/street_view_360.jpg',
    history: 'Conhecida pelas suas praias maravilhosas, Benguela é um dos destinos turísticos mais procurados. A Praia Morena inspirou poetas e músicos angolanos e continua a ser um símbolo da beleza natural do sul de Angola.',
    quiz: { question: 'Que comboio famoso tem a sua estação central em Benguela?', answers: ['Caminho de Ferro de Benguela', 'Linha de Luanda'] },
    hotspots: [{ pitch: 0, yaw: -45, type: 'info', text: 'Areias Brancas' }]
  },
  '3': {
    title: 'FENDA DA TUNDAVALA',
    province: 'HUÍLA',
    author: 'Google Street View',
    elevation: '2200m',
    image: '/assets/360_padro/street_view_360.jpg',
    history: 'Uma das maiores maravilhas naturais de Angola, oferecendo uma vista vertiginosa e inesquecível sobre o horizonte. A fenda marca o fim do planalto da Huíla, com uma queda abrupta de mais de 1000 metros.',
    quiz: { question: 'A Fenda da Tundavala fica próxima de que cidade?', answers: ['Lubango', 'Matala', 'Namibe'] }
  }
};

const DEFAULT_TOUR = {
  title: 'DESTINO DESCONHECIDO',
  province: 'ANGOLA',
  elevation: '120m',
  image: '/assets/360_padro/street_view_360.jpg',
  history: 'A história deste local ainda está a ser documentada pela nossa equipa de exploradores.',
  quiz: { question: 'Qual é a capital desta província?', answers: ['Luanda', 'Benguela'] },
  hotspots: []
};

const EMPTY_HOTSPOTS: any[] = [];

export default function TourViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const unlockStamp = usePassportStore(state => state.unlockStamp);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setAudioProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

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

  const currentTourId = id?.toLowerCase() || '1';
  const tour = toursData[currentTourId] || DEFAULT_TOUR;

  useEffect(() => {
    if (tour.province) {
      unlockStamp(tour.province);
    }
  }, [tour.province, unlockStamp]);

  return (
    <div ref={viewerContainerRef} className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src="/assets/narrações/1_de_maio_padrao.wav" 
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={() => {
          setIsPlayingAudio(false);
          setAudioProgress(0);
        }} 
      />

      {/* 360 Viewer Layer (Bottom most) */}
      <div className="absolute inset-0 w-full h-full">
        <PannellumViewer 
          image={tour.image} 
          title={tour.title}
          author={tour.author}
          hotSpots={tour.hotspots || EMPTY_HOTSPOTS}
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
          <Link to="/explore" className="flex flex-col items-center gap-2 group relative">
            <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full w-8 h-8 -top-1 left-1/2 -translate-x-1/2 z-0"></div>
            <Compass size={24} className="text-red-400 group-hover:scale-110 transition-transform relative z-10" />
            <span className="text-[10px] text-white font-bold relative z-10">Explorar</span>
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



      {/* Bottom Center Console (Pill) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-8 py-5 flex items-center gap-8 shadow-2xl">
          
          {/* Audio Guia Player */}
          <div className="flex flex-col justify-center border-r border-white/10 pr-8 min-w-[250px]">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2">Áudio Guia</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleAudio}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isPlayingAudio ? 'bg-primary text-white shadow-[0_0_15px_rgba(214,38,38,0.6)]' : 'bg-white/20 text-white hover:bg-white/30'}`}
                title="Áudio Guia"
              >
                {isPlayingAudio ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
              </button>
              
              <input 
                type="range" min="0" max="100" step="0.1"
                value={audioProgress || 0} onChange={handleSeek}
                className="w-24 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary outline-none"
                title="Avançar / Recuar"
              />

              <div className="flex items-center gap-1.5 ml-2 opacity-60 hover:opacity-100 transition-opacity">
                <Volume2 size={14} className="text-white" />
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={volume} onChange={handleVolumeChange} 
                  className="w-12 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white outline-none"
                  title="Volume"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col border-r border-white/10 pr-8">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Altitude</span>
            <span className="text-white font-bold text-lg">{tour.elevation}</span>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setShowHistory(!showHistory); setShowMission(false); }} 
              className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all group ${showHistory ? 'bg-primary border-primary text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} 
              title="História do Local"
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => { setShowMission(!showMission); setShowHistory(false); }} 
              className={`w-12 h-12 border rounded-full flex items-center justify-center transition-all group ${showMission ? 'bg-secondary border-secondary text-black' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`} 
              title="Missão Local"
            >
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
        <div className={`transition-all duration-500 origin-bottom-right ${showMission ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none hidden'}`}>
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

        {/* History Panel (Only shows when toggled from bottom bar) */}
        <div className={`transition-all duration-500 origin-bottom-right ${showHistory ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none hidden'}`}>
          <div className="w-80 bg-black/80 backdrop-blur-3xl border border-red-500/50 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-red-500/10">
              <BookOpen size={100} />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase block mb-2 drop-shadow-md">História & Cultura</span>
              <p className="text-sm text-white font-medium leading-relaxed drop-shadow-md">
                {tour.history}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
