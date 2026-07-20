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
    <section className="relative h-screen min-h-[750px] flex flex-col justify-center px-4 overflow-hidden bg-dark-bg">
      
      {/* Background video + overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/85 to-transparent z-10" />
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-40 lg:opacity-70 lg:translate-x-[20%] transition-transform duration-1000">
          <source src="/assets/images/herov.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Blurred colored circular indicators for aesthetic depth */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[130px] pointer-events-none z-10" />
      <div className="absolute bottom-1/4 left-10 w-[250px] h-[250px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 text-left flex flex-col justify-center">
            


            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white leading-tight drop-shadow-lg">
              {heroContent.title}{' '}
              <span className="text-secondary font-black drop-shadow-xl block lg:inline-block">
                {heroContent.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 font-light leading-relaxed drop-shadow-md">
              {heroContent.subtitle}
            </p>

            {/* CTA */}
            <div>
              <Link
                to={heroContent.primaryCtaTo}
                className="bg-primary hover:bg-primary/95 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(214,38,28,0.4)] w-fit"
              >
                <Compass size={24} />
                {heroContent.primaryCta}
              </Link>
            </div>

            {/* Credibility indicators listed cleanly */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-12 pt-8 border-t border-white/5">
              {heroContent.credibility.map((item, i) => {
                const Icon = CREDIBILITY_ICONS[item.icon as keyof typeof CREDIBILITY_ICONS];
                return (
                  <div key={i} className="flex items-center gap-2 text-white/60 text-xs font-semibold uppercase tracking-wider">
                    {Icon && <Icon size={14} className="text-primary" />}
                    {item.label}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column (Floating Premium Card) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative h-full">
            
            {/* The Floating stats card (like the mockup) */}
            <div className="glass p-6 rounded-3xl w-full max-w-[280px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative z-20 group hover:border-secondary/30 transition-all duration-500">
              
              {/* Small accent color blob */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/15 rounded-full blur-xl" />
              
              {/* Stat number */}
              <h3 className="text-3xl font-black text-white mb-2">100% Gratuito</h3>
              
              {/* Label */}
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Acesso livre a todo o património histórico, natural e cultural de Angola. Sem custos, apenas descoberta.
              </p>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
