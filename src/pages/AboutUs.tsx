import { Eye, Heart, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="flex-1 w-full bg-dark-bg pb-24">
      {/* Hero Section */}
      <section className="relative py-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80" 
            alt="About Us Background" 
            className="w-full h-full object-cover grayscale opacity-50"
          />
        </div>
        
        <div className="relative z-20 pt-16 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            A Nossa <span className="text-primary">História</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto">
            Descubra a visão por trás do Angola 360 e a nossa missão de levar Angola ao mundo.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -z-10" />
          
          <div className="prose prose-invert prose-lg max-w-none text-text-muted leading-relaxed">
            <p className="text-white/90 text-xl font-medium mb-6">
              Tudo começou com uma visão audaz e profunda: <strong className="text-primary">desvendar a alma de Angola e entregá-la ao mundo.</strong>
            </p>
            <p className="mb-6">
              A Flopes CS não construiu apenas um site; forjou uma ponte digital. Nascemos da convicção férrea de que os nossos cânions majestosos, o tecido orgânico da nossa arquitetura urbana e o pulsar inconfundível do nosso património não podiam ficar reféns da distância ou do tempo.
            </p>
            <p className="mb-6">
              Hoje, o Angola 360 é a sua janela infinita para África. Através de uma simbiose perfeita entre captação equirretangular de classe mundial, camadas de áudio ambiental arrebatadoras e moldes de design vanguardistas, apagamos a fronteira entre o digital e a poeira da terra. Quer seja o nómada digital curioso ou o investidor perspicaz, esta é a sua jornada.
            </p>
            <p className="text-2xl font-bold text-white mt-8 text-center border-t border-white/10 pt-8">
              Não apenas observe. <span className="text-secondary">Sinta, Explore e Pertença.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="max-w-6xl mx-auto px-6 mt-16 md:mt-24">
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] group">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" 
            alt="A Equipa Angola 360" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-8">
            <p className="text-white text-xl font-bold tracking-wider uppercase">Os arquitetos da nossa visão digital.</p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="max-w-6xl mx-auto px-6 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/50 transition-colors text-center group">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors">
              <Eye className="text-primary group-hover:text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Visão</h3>
            <p className="text-text-muted">
              Ser a plataforma de referência global para a exploração virtual imersiva das maravilhas naturais e culturais de Angola.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 hover:border-secondary/50 transition-colors text-center group">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary transition-colors">
              <Heart className="text-secondary group-hover:text-black" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Missão</h3>
            <p className="text-text-muted">
              Democratizar o acesso às ricas paisagens angolanas, promovendo o turismo e a preservação do património através de tecnologia 360º de ponta.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 hover:border-white/30 transition-colors text-center group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-white transition-colors">
              <Users className="text-text-muted group-hover:text-black" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Valores</h3>
            <p className="text-text-muted">
              Inovação Tecnológica, Autenticidade Cultural, Sustentabilidade Turística e Excelência Visual em cada panorama.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
