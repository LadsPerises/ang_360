import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { featuredToursContent } from '../../data/landingContent';

export default function FeaturedTours() {
  const { title, subtitle, tours } = featuredToursContent;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-text-muted text-lg">{subtitle}</p>
        </div>
        <Link
          to="/explore"
          className="hidden md:flex items-center gap-2 text-primary hover:text-white transition-colors font-bold uppercase tracking-widest text-sm"
        >
          Ver todos <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tours.map((tour, idx) => (
          <Link
            key={idx}
            to={tour.to}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-dark-card transition-transform hover:-translate-y-2 border border-white/5 shadow-xl"
          >
            <div className="absolute inset-0">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 shadow-lg">
              360°
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 z-20">
              <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">
                {tour.province}
              </span>
              <h3 className="text-2xl text-white font-bold leading-tight group-hover:text-secondary transition-colors">
                {tour.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Link
          to="/explore"
          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2 w-full justify-center"
        >
          Ver todos os destinos <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
