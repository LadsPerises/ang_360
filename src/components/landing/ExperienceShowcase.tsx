import { Link } from 'react-router-dom';
import { ArrowRight, MousePointer2, Hand } from 'lucide-react';
import PannellumViewer from '../tour/PannellumViewer';
import { showcaseContent } from '../../data/landingContent';

export default function ExperienceShowcase() {
  const {
    title,
    subtitle,
    panoramaImage,
    panoramaTitle,
    panoramaAuthor,
    cta,
    ctaTo,
  } = showcaseContent;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">

          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Demo 360º inline */}
        <div className="relative w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
          <PannellumViewer
            image={panoramaImage}
            title={panoramaTitle}
            author={panoramaAuthor}
            autoRotate={-2}
          />

          {/* Overlay com instruções de interação */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-sm font-medium text-white/90 pointer-events-none flex items-center gap-3 border border-white/10 shadow-xl">
            <MousePointer2 size={16} className="text-secondary animate-pulse" />
            <Hand size={16} className="text-primary" />
            Arraste para explorar o ambiente
          </div>

          {/* Badge 360º no canto */}
          <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Experiência Imersiva 360°
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to={ctaTo}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-primary text-white border border-white/20 hover:border-primary px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
          >
            {cta} <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
