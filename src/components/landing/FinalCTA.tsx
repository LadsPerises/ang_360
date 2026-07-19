import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { finalCtaContent } from '../../data/landingContent';

export default function FinalCTA() {
  const { title, subtitle, cta, ctaTo } = finalCtaContent;

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Fundo com gradiente Angola */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary/80" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Padrão decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-white/90 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
          {subtitle}
        </p>

        <Link
          to={ctaTo}
          className="inline-flex items-center gap-3 bg-black hover:bg-black/80 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl border border-white/10"
        >
          <Compass size={24} />
          {cta}
        </Link>
      </div>
    </section>
  );
}
