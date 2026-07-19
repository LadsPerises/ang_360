import { Hotel, Compass, Landmark, ArrowRight, Handshake } from 'lucide-react';
import { forPartnersContent } from '../../data/landingContent';

// Mapa de ícones para os tipos de parceiros
const PARTNER_ICONS = {
  Hotel: Hotel,
  Compass: Compass,
  Landmark: Landmark,
} as const;

export default function ForPartners() {
  const { badge, title, subtitle, partners, cta } = forPartnersContent;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-secondary mb-6">
            <Handshake size={14} />
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
          <p className="text-text-muted text-lg leading-relaxed">{subtitle}</p>
        </div>

        {/* Grid de parceiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, i) => {
            const Icon = PARTNER_ICONS[partner.icon as keyof typeof PARTNER_ICONS];
            return (
              <div
                key={i}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-secondary/40 transition-all hover:-translate-y-2 group"
              >
                {/* Ícone */}
                <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:border-secondary transition-colors">
                  {Icon && <Icon size={26} className="text-secondary group-hover:text-black transition-colors" />}
                </div>

                {/* Tag de benefício */}
                <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-4 border border-secondary/20">
                  {partner.benefit}
                </span>

                <h3 className="text-xl font-bold text-white mb-4">{partner.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{partner.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="mailto:parcerias@angola360.ao?subject=Quero%20tornar-me%20Parceiro%20Angola360"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-secondary hover:text-black text-white border border-white/20 hover:border-secondary px-8 py-4 rounded-full font-bold transition-all hover:scale-105"
          >
            {cta} <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
