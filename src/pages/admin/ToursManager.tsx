import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Map, X, Save, Camera, Gamepad2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import PannellumViewer from '../../components/tour/PannellumViewer';

type QuizData = {
  question: string;
  answers: string[];
};

type HotSpotData = {
  pitch: number;
  yaw: number;
  text: string;
};

type Tour = { 
  id: string; 
  name: string; 
  status: string; 
  views: string; 
  date: string;
  image: string;
  description: string;
  bestTime: string;
  highlights: string;
  quiz: QuizData;
  hotspots: HotSpotData[];
};

export default function ToursManager() {
  const [tours, setTours] = useState<Tour[]>([
    { 
      id: 'luanda', name: 'Baía de Luanda', status: 'Publicado', views: '12.4k', date: '10 Mai 2026',
      image: 'https://pannellum.org/images/alma.jpg',
      description: 'A vibrante capital de Angola oferece uma mistura incrível de arquitetura moderna e edifícios coloniais históricos à beira-mar.',
      bestTime: 'Todo o ano',
      highlights: 'Marginal de Luanda, Vista para a Ilha, Pôr do sol no mar',
      quiz: { question: 'Qual é o nome da fortaleza icónica de Luanda?', answers: ['São Miguel', 'São Pedro', 'Kikombo', 'Muxima'] },
      hotspots: []
    },
    { 
      id: 'benguela', name: 'Praia Morena', status: 'Publicado', views: '5.2k', date: '08 Mai 2026',
      image: 'https://pannellum.org/images/cerro-toco-0.jpg',
      description: 'Conhecida pelas suas praias maravilhosas, Benguela é um dos destinos turísticos mais procurados para quem gosta de mar e sol.',
      bestTime: 'Novembro a Março',
      highlights: 'Areias Brancas, Restaurantes Locais, Mar Calmo',
      quiz: { question: 'Que comboio famoso tem a sua estação central em Benguela?', answers: ['Caminho de Ferro de Benguela', 'Linha de Luanda', 'Comboio do Namibe', 'Expresso do Sul'] },
      hotspots: []
    },
    { 
      id: 'huila', name: 'Fenda da Tundavala', status: 'Publicado', views: '3.1k', date: '05 Mai 2026',
      image: 'https://pannellum.org/images/jfk.jpg',
      description: 'Uma das maiores maravilhas naturais de Angola, oferecendo uma vista vertiginosa e inesquecível sobre o horizonte.',
      bestTime: 'Maio a Setembro',
      highlights: 'Abismo de 1200m, Vista Panorâmica, Formações Rochosas',
      quiz: { question: 'A Fenda da Tundavala fica próxima de que cidade?', answers: ['Lubango', 'Matala', 'Namibe', 'Chibia'] },
      hotspots: []
    },
    { 
      id: 'namibe', name: 'Deserto do Namibe', status: 'Rascunho', views: '-', date: '-',
      image: '', description: '', bestTime: '', highlights: '', quiz: { question: '', answers: ['', '', '', ''] }, hotspots: []
    },
    { 
      id: 'malanje', name: 'Quedas de Kalandula', status: 'Rascunho', views: '-', date: '-',
      image: '', description: '', bestTime: '', highlights: '', quiz: { question: '', answers: ['', '', '', ''] }, hotspots: []
    },
  ]);

  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const handleEditClick = (tour: Tour) => {
    // Clona as respostas do quiz explicitamente para evitar mutações de estado diretas nas referências
    const clonedTour = { 
      ...tour, 
      quiz: { ...tour.quiz, answers: [...tour.quiz.answers] } 
    };
    setEditingTour(clonedTour);
  };

  const handleSave = () => {
    if (editingTour) {
      setTours(tours.map(t => t.id === editingTour.id ? editingTour : t));
      setEditingTour(null);
    }
  };

  const updateQuizAnswer = (index: number, value: string) => {
    if (!editingTour) return;
    const newAnswers = [...editingTour.quiz.answers];
    newAnswers[index] = value;
    setEditingTour({
      ...editingTour,
      quiz: { ...editingTour.quiz, answers: newAnswers }
    });
  };

  const handleViewerClick = (pitch: number, yaw: number) => {
    if (!editingTour) return;
    const text = window.prompt("Digite o texto de informação para este novo ponto:");
    if (text && text.trim() !== "") {
      setEditingTour({
        ...editingTour,
        hotspots: [...editingTour.hotspots, { pitch, yaw, text }]
      });
    }
  };

  const removeHotspot = (index: number) => {
    if (!editingTour) return;
    const newHotspots = [...editingTour.hotspots];
    newHotspots.splice(index, 1);
    setEditingTour({ ...editingTour, hotspots: newHotspots });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestão de Tours</h1>
          <p className="text-white/50">Adicione, edite ou remova experiências 360º.</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(214,38,38,0.3)] flex items-center gap-2 transition-all">
          <Plus size={20} /> Nova Tour 360
        </button>
      </div>

      {/* Tabela de Gestão */}
      <div className="bg-[#111] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Província / Tour</th>
                <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Estado</th>
                <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Visualizações</th>
                <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Atualização</th>
                <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center shrink-0">
                        <Map size={18} className="text-white/30" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{tour.name}</p>
                        <p className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{tour.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tour.status === 'Publicado' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-white/5 text-white/50 border-white/10'}`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-white/70">{tour.views}</td>
                  <td className="py-4 px-6 text-sm text-white/70">{tour.date}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      {tour.status === 'Publicado' && (
                        <Link to={`/tour/${tour.id}`} target="_blank" className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors" title="Ver Tour">
                          <Eye size={16} />
                        </Link>
                      )}
                      <button onClick={() => handleEditClick(tour)} className="p-2 text-white/50 hover:text-secondary bg-white/5 hover:bg-secondary/10 rounded-lg transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-white/50 hover:text-primary bg-white/5 hover:bg-primary/10 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal Completo */}
      {editingTour && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit2 size={20} className="text-secondary" /> Editar Tour: {editingTour.name}
              </h2>
              <button onClick={() => setEditingTour(null)} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-10 custom-scrollbar">
              
              {/* Seção 1: Informação Geral */}
              <section>
                <h3 className="text-white font-bold mb-5 flex items-center gap-2"><Map size={18} className="text-primary"/> Informação Geral</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">ID Único (Província)</label>
                    <input type="text" value={editingTour.id} disabled className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-white/50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Estado de Publicação</label>
                    <select 
                      value={editingTour.status}
                      onChange={(e) => setEditingTour({...editingTour, status: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-secondary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Publicado">Publicado</option>
                      <option value="Rascunho">Rascunho</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Nome Comercial da Tour</label>
                    <input 
                      type="text" 
                      value={editingTour.name} 
                      onChange={(e) => setEditingTour({...editingTour, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-secondary transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Clima Ideal (Ex: Maio a Setembro)</label>
                    <input 
                      type="text" 
                      value={editingTour.bestTime} 
                      onChange={(e) => setEditingTour({...editingTour, bestTime: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-secondary transition-colors" 
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-white/70 text-sm font-medium mb-2">Descrição Narrativa</label>
                  <textarea 
                    value={editingTour.description}
                    onChange={(e) => setEditingTour({...editingTour, description: e.target.value})}
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                    placeholder="Escreva a descrição rica e atrativa deste destino..."
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Destaques (Separados por vírgula)</label>
                  <input 
                    type="text" 
                    value={editingTour.highlights} 
                    onChange={(e) => setEditingTour({...editingTour, highlights: e.target.value})}
                    placeholder="Ex: Praia de Areia Branca, Gastronomia Local, Pôr do sol"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-secondary transition-colors" 
                  />
                </div>
              </section>

              {/* Seção 2: Media 360 e Hotspots */}
              <section className="pt-8 border-t border-white/5">
                <h3 className="text-white font-bold mb-5 flex items-center gap-2"><Camera size={18} className="text-primary"/> Media e Hotspots 360º</h3>
                <div className="mb-6">
                  <label className="block text-white/70 text-sm font-medium mb-2">URL da Imagem Equirretangular 360º</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      value={editingTour.image} 
                      onChange={(e) => setEditingTour({...editingTour, image: e.target.value})}
                      placeholder="/assets/360/nome.jpg ou https://url-da-cdn.com/imagem.jpg"
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-secondary transition-colors" 
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-2">Dica: Utilize ficheiros JPG com resolução mínima de 4096x2048 (Proporção 2:1).</p>
                </div>

                {/* Editor Visual de Hotspots */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-bold text-sm">Editor Visual de Pontos de Interesse (Hotspots)</h4>
                    <p className="text-xs text-primary font-medium animate-pulse">Navegue e clique na imagem abaixo para adicionar um ponto</p>
                  </div>
                  
                  {editingTour.image ? (
                    <div className="h-64 rounded-xl overflow-hidden mb-4 border border-white/10 relative">
                      <PannellumViewer 
                        image={editingTour.image} 
                        onClick={handleViewerClick}
                        hotSpots={editingTour.hotspots.map(hs => ({ pitch: hs.pitch, yaw: hs.yaw, type: 'info', text: hs.text }))}
                      />
                    </div>
                  ) : (
                    <div className="h-64 rounded-xl border border-white/10 border-dashed flex items-center justify-center mb-4">
                      <p className="text-white/30 text-sm">Adicione um URL de imagem acima para usar o Editor 360º</p>
                    </div>
                  )}

                  {/* Lista de Hotspots */}
                  <div className="flex flex-col gap-2">
                    {editingTour.hotspots.length === 0 ? (
                      <p className="text-white/30 text-xs italic">Nenhum hotspot adicionado. Clique no visualizador acima para criar um.</p>
                    ) : (
                      editingTour.hotspots.map((hs, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 p-2 px-3 rounded-lg group">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-primary" />
                            <span className="text-white text-sm font-bold">{hs.text}</span>
                            <span className="text-white/30 text-xs">(Pitch: {hs.pitch.toFixed(1)}, Yaw: {hs.yaw.toFixed(1)})</span>
                          </div>
                          <button onClick={() => removeHotspot(i)} className="text-white/30 hover:text-red-400 transition-colors opacity-50 group-hover:opacity-100">
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* Seção 3: Gamificação */}
              <section className="pt-8 border-t border-white/5">
                <h3 className="text-white font-bold mb-5 flex items-center gap-2"><Gamepad2 size={18} className="text-primary"/> Gamificação e Desafios (Quiz)</h3>
                <div className="mb-5">
                  <label className="block text-white/70 text-sm font-medium mb-2">Pergunta do Passaporte</label>
                  <input 
                    type="text" 
                    value={editingTour.quiz.question} 
                    onChange={(e) => setEditingTour({...editingTour, quiz: {...editingTour.quiz, question: e.target.value}})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-secondary transition-colors" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      <label className="block text-white/70 text-sm font-medium mb-2 flex items-center justify-between">
                        Opção {index + 1}
                        {index === 0 && <span className="text-[10px] uppercase font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">Resposta Correta</span>}
                      </label>
                      <input 
                        type="text" 
                        value={editingTour.quiz.answers[index]} 
                        onChange={(e) => updateQuizAnswer(index, e.target.value)}
                        className={`w-full bg-black/50 border rounded-xl py-2.5 px-4 text-white focus:outline-none transition-colors ${index === 0 ? 'border-green-400/30 focus:border-green-400' : 'border-white/10 focus:border-secondary'}`} 
                      />
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 bg-black/20 shrink-0">
              <button onClick={() => setEditingTour(null)} className="px-5 py-2.5 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                Cancelar e Fechar
              </button>
              <button onClick={handleSave} className="bg-secondary hover:bg-secondary/90 text-black px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <Save size={18} /> Guardar Tour
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
