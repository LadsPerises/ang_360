import { useState } from 'react';
import { Save, Bell, Shield, Globe, Database, Smartphone, Palette } from 'lucide-react';

export default function Settings() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
          <p className="text-white/50">Personaliza a experiência global da plataforma Angola360.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(214,38,38,0.3)]'}`}
        >
          {saveStatus === 'saving' ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : saveStatus === 'saved' ? (
            'Guardado!'
          ) : (
            <><Save size={20} /> Guardar Alterações</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Navegação */}
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium border border-white/5">
            <Globe size={18} className="text-primary"/> Geral
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white font-medium transition-colors">
            <Palette size={18} /> Aparência
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white font-medium transition-colors">
            <Bell size={18} /> Notificações
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white font-medium transition-colors">
            <Shield size={18} /> Segurança
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white font-medium transition-colors">
            <Database size={18} /> Integrações API
          </button>
        </div>

        {/* Coluna Direita: Conteúdo */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Informações do Projeto</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Nome da Plataforma</label>
                <input type="text" defaultValue="Angola360" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-all" />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">URL Base do Site (Público)</label>
                <input type="text" defaultValue="https://angola360.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-all" />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Email de Suporte Geral</label>
                <input type="email" defaultValue="suporte@angola360.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Funcionalidades Públicas</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <h4 className="text-white font-medium">Modo de Manutenção</h4>
                  <p className="text-white/40 text-sm">Bloqueia o acesso ao site público mostrando uma página "Em Breve".</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-white/10">
                  <input type="checkbox" className="peer sr-only" />
                  <span className="absolute inset-0 rounded-full transition peer-checked:bg-primary"></span>
                  <span className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:translate-x-6"></span>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <h4 className="text-white font-medium">Sistema de Passaporte Virtual</h4>
                  <p className="text-white/40 text-sm">Permite aos utilizadores desbloquearem carimbos ao visitarem tours.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-primary">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <span className="absolute inset-0 rounded-full transition peer-checked:bg-primary"></span>
                  <span className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:translate-x-6"></span>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div>
                  <h4 className="text-white font-medium">Partilha nas Redes Sociais</h4>
                  <p className="text-white/40 text-sm">Apresenta botões de partilha (Facebook, WhatsApp) nas páginas das Tours.</p>
                </div>
                <div className="relative inline-block w-12 h-6 rounded-full bg-primary">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <span className="absolute inset-0 rounded-full transition peer-checked:bg-primary"></span>
                  <span className="absolute inset-y-1 left-1 w-4 h-4 rounded-full bg-white transition-all peer-checked:translate-x-6"></span>
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
