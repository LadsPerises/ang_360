import { Map, Eye, Award } from 'lucide-react';
import { howItWorksContent } from '../../data/landingContent';

// Mapa de ícones (string do ficheiro de dados → componente lucide)
const STEP_ICONS = {
  Map: Map,
  Eye: Eye,
  Award: Award,
} as const;

export default function HowItWorks() {
  const { title, subtitle, steps } = howItWorksContent;

  return (
    <section className="py-24 px-6 bg-black/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Linha conectora horizontal (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {steps.map((step, i) => {
            const Icon = STEP_ICONS[step.icon as keyof typeof STEP_ICONS];
            return (
              <div key={i} className="relative text-center group">
                {/* Número do passo */}
                <div className="text-6xl md:text-7xl font-black text-white/5 mb-4 group-hover:text-primary/10 transition-colors">
                  {step.number}
                </div>

                {/* Ícone circular */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl opacity-20 group-hover:opacity-40 blur-md transition-opacity" />
                  <div className="relative w-full h-full bg-dark-card border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    {Icon && <Icon size={32} className="text-primary" />}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-text-muted leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
