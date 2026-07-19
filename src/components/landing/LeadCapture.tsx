import { useState, type FormEvent } from 'react';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { leadCaptureContent } from '../../data/landingContent';

export default function LeadCapture() {
  const { badge, title, subtitle, placeholder, button, successMessage, privacy } =
    leadCaptureContent;

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: ligar ao Supabase/ConvertKit quando backend estiver pronto.
    // Por agora, mostramos apenas o estado de sucesso.
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      // Reset após 6 segundos para permitir nova submissão
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden text-center">
          {/* Decoração de fundo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-secondary mb-6">
              <Sparkles size={14} />
              {badge}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">{subtitle}</p>

            {/* Formulário */}
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-primary transition-colors placeholder:text-text-muted/60"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(214,38,28,0.3)] whitespace-nowrap"
                >
                  {button} <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="max-w-md mx-auto bg-secondary/10 border border-secondary/30 rounded-xl p-6 flex items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
                <CheckCircle size={24} className="text-secondary" />
                <span className="text-white font-medium">{successMessage}</span>
              </div>
            )}

            <p className="text-text-muted/60 text-xs mt-4">{privacy}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
