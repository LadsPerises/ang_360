import { Map as MapIcon } from 'lucide-react';
import AngolaMap from '../ui/AngolaMap';
import { mapContent } from '../../data/landingContent';

export default function InteractiveMap() {
  return (
    <section className="py-24 px-6 bg-black/40 border-y border-white/5">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <MapIcon size={48} className="mx-auto text-secondary mb-6 opacity-80" />
        <h2 className="text-4xl md:text-5xl font-bold mb-6">{mapContent.title}</h2>
        <p className="text-xl text-text-muted">{mapContent.subtitle}</p>
      </div>
      <AngolaMap />
    </section>
  );
}
