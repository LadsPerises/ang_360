import { Quote, Star } from 'lucide-react';
import { testimonialsContent } from '../../data/landingContent';

export default function Testimonials() {
  const { badge, title, testimonials } = testimonialsContent;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-6">
            <Star size={14} className="text-secondary" />
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
        </div>

        {/* Grid de testemunhos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glass p-8 rounded-3xl relative hover:border-primary/30 transition-colors group"
            >
              {/* Ícone de citação */}
              <Quote
                size={48}
                className="text-primary/20 mb-4 group-hover:text-primary/40 transition-colors"
              />

              {/* Estrelas */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} className="text-secondary fill-secondary" />
                ))}
              </div>

              {/* Citação */}
              <p className="text-white/80 leading-relaxed mb-6 italic">"{t.quote}"</p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                />
                <div>
                  <div className="text-white font-bold text-sm">{t.author}</div>
                  <div className="text-text-muted text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
