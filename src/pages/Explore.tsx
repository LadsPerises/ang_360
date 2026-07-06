import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, X, Compass } from 'lucide-react';

const PROVINCES = [
  'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
  'Icolo e Bengo', 'Luanda', 'Lunda Norte', 'Lunda Sul',
  'Malanje', 'Moxico', 'Moxico Leste', 'Namibe', 'Uíge', 'Zaire'
];

const MOCK_TOURS = [
  { id: '1', title: 'Fortaleza de São Miguel', province: 'Luanda', excerpt: 'Explore a história militar de Luanda nesta fortaleza icónica com vista para a baía.', image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80' },
  { id: '2', title: 'Praia da Caotinha', province: 'Benguela', excerpt: 'Águas cristalinas e areia dourada numa das praias mais bonitas do sul.', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80' },
  { id: '3', title: 'Serra da Leba', province: 'Huíla', excerpt: 'Uma estrada serpenteante pelas montanhas, uma obra-prima da engenharia e natureza.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  { id: '4', title: 'Baía dos Tigres', province: 'Namibe', excerpt: 'Uma ilha fantasma engolida pelas areias do deserto do Namibe.', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80' },
  { id: '5', title: 'Quedas de Kalandula', province: 'Malanje', excerpt: 'As segundas maiores quedas de água de África num cenário de tirar o fôlego.', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80' },
  { id: '6', title: 'Parque Nacional da Kissama', province: 'Bengo', excerpt: 'Safari virtual pela savana angolana para observar a vida selvagem.', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
  { id: '7', title: 'Cristo Rei', province: 'Huíla', excerpt: 'Monumento sobranceiro ao vale do Lubango.', image: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=800&q=80' },
  { id: '8', title: 'Ilha do Mussulo', province: 'Luanda', excerpt: 'Um paraíso de coqueiros e praias tranquilas perto da capital.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentProvince = searchParams.get('province') || '';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTours = MOCK_TOURS.filter(tour => {
    const matchesProvince = currentProvince ? tour.province === currentProvince : true;
    const matchesSearch = searchQuery ? tour.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesProvince && matchesSearch;
  });

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setSearchParams({ province: e.target.value });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
  };

  return (
    <div className="flex-1 w-full pb-24">
      {/* Header */}
      <header className="relative py-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?q=80&w=2667&auto=format&fit=crop" 
            alt="Explore Header" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 pt-16 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {currentProvince ? (
              <>Tours em: <span className="text-primary">{currentProvince}</span></>
            ) : (
              'Descubra Angola'
            )}
          </h1>
          <p className="text-xl text-white/80">
            Cada província guarda um segredo. Escolha seu destino e deixe-se levar.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        {/* Filter Bar */}
        <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between mb-12 shadow-lg">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              value={currentProvince} 
              onChange={handleProvinceChange}
              className="bg-dark-card border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-primary w-full md:w-64 appearance-none"
            >
              <option value="">Todas as Províncias</option>
              {PROVINCES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-1 md:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar tour..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-card border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary w-full"
              />
            </div>
            {(currentProvince || searchQuery) && (
              <button onClick={clearFilters} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-colors" title="Limpar Filtros">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map(tour => (
              <Link key={tour.id} to={`/tour/${tour.id}`} className="group bg-dark-card rounded-3xl overflow-hidden border border-white/5 shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white">
                    <MapPin size={14} className="text-primary" />
                    {tour.province}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10">
                    360°
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {tour.title}
                  </h3>
                  <p className="text-text-muted flex-1 mb-6">
                    {tour.excerpt}
                  </p>
                  <button className="w-full bg-white/5 group-hover:bg-primary text-white py-3 rounded-xl font-bold transition-colors">
                    Viajar Agora
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-dark-card rounded-3xl border border-white/5">
            <Compass size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">Nenhum tour encontrado</h3>
            <p className="text-text-muted">Tente ajustar os filtros ou pesquisar por outro termo.</p>
            <button onClick={clearFilters} className="mt-6 text-primary hover:text-white font-medium">
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
