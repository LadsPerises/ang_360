import Hero from '../components/landing/Hero';

import FeaturedTours from '../components/landing/FeaturedTours';
import HowItWorks from '../components/landing/HowItWorks';
import ExperienceShowcase from '../components/landing/ExperienceShowcase';
import ForPartners from '../components/landing/ForPartners';
import InteractiveMap from '../components/landing/InteractiveMap';
import Testimonials from '../components/landing/Testimonials';
import LeadCapture from '../components/landing/LeadCapture';
import FinalCTA from '../components/landing/FinalCTA';

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE — Angola360
// ═══════════════════════════════════════════════════════════════════════════
// Composition layer: monta as secções por ordem.
// Para reordenar/remover, basta editar este ficheiro.
// Para editar copy/dados: src/data/landingContent.ts
// ═══════════════════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div className="flex-1 w-full">
      <Hero />
      <FeaturedTours />
      <HowItWorks />
      <ExperienceShowcase />
      <ForPartners />
      <InteractiveMap />
      <Testimonials />
      <LeadCapture />
      <FinalCTA />
    </div>
  );
}
