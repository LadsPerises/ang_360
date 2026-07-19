import { Link } from 'react-router-dom';
import { Compass, MapPin, Camera, Globe } from 'lucide-react';
import { heroContent } from '../../data/landingContent';

// Mapa de ícones de credibilidade (string do ficheiro de dados → componente)
const CREDIBILITY_ICONS = {
  MapPin: MapPin,
  Camera: Camera,
  Globe: Globe,
} as const;

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      {/* Background video + overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dark-bg z-10" />
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80">
          <source src="/assets/images/herov.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 max-w-4xl mx-auto pt-20">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
          {heroContent.title}{' '}
          <span className="text-secondary font-black uppercase drop-shadow-xl">
            {heroContent.titleHighlight}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
          {heroContent.subtitle}
        </p>

        {/* CTA único */}
        <div className="flex justify-center">
          <Link
            to={heroContent.primaryCtaTo}
            className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(214,38,28,0.4)]"
          >
            <Compass size={24} />
            {heroContent.primaryCta}
          </Link>
        </div>

        {/* Indicadores de credibilidade */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12">
          {heroContent.credibility.map((item, i) => {
            const Icon = CREDIBILITY_ICONS[item.icon as keyof typeof CREDIBILITY_ICONS];
            return (
              <div key={i} className="flex items-center gap-2 text-white/70 text-sm font-medium">
                {Icon && <Icon size={16} className="text-secondary" />}
                {item.label}
              </div>
            );
          })}
        </div>
      </div>


    </section>
  );
}
