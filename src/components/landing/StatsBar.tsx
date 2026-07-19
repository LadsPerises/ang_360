import { statsContent } from '../../data/landingContent';

export default function StatsBar() {
  return (
    <section className="relative -mt-px bg-black border-y border-white/5">
      {/* Glow decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {statsContent.map((stat, i) => (
            <div
              key={i}
              className="text-center md:border-r md:border-white/10 last:border-r-0"
            >
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-text-muted font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
