import { Eye, Map, Users, TrendingUp, ArrowUpRight, Camera, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTours: 32,
    toursViews: 0
  });

  useEffect(() => {
    fetch('/api/admin/stats.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error('Error fetching stats:', err));
  }, []);

  const metrics = [
    { title: 'Tours Visíveis', value: stats.totalTours, icon: Map, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Visualizações (Est.)', value: stats.toursViews, icon: Eye, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Utilizadores Registados', value: stats.totalUsers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Utilizadores Ativos', value: stats.activeUsers, icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Visão Geral</h1>
          <p className="text-white/50">Métricas e estatísticas do Angola360.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
          Gerar Relatório <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${metric.bg}`}>
              <metric.icon size={24} className={metric.color} />
            </div>
            <p className="text-white/50 text-sm font-medium mb-1">{metric.title}</p>
            <h3 className="text-3xl font-black text-white">{metric.value}</h3>
            
            <div className="absolute top-6 right-6 flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">
              <TrendingUp size={12} /> +12%
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Chart Area */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl h-96 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Tráfego de Exploração</h2>
          <div className="flex-1 border border-white/5 border-dashed rounded-xl flex items-center justify-center bg-black/20">
            <p className="text-white/30 text-sm">Área reservada para gráfico de linhas (Ex: Recharts)</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Atividade Recente</h2>
          <div className="flex flex-col gap-6 flex-1">
            {[
              { text: 'Novo utilizador "João" desbloqueou Luanda', time: 'Há 5 min' },
              { text: 'Admin "AT" atualizou os dados de Benguela', time: 'Há 2 horas' },
              { text: 'Pico de tráfego detectado na tour da Huíla', time: 'Há 4 horas' },
              { text: 'Backup automático concluído com sucesso', time: 'Ontem' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0"></div>
                <div>
                  <p className="text-sm text-white/80">{activity.text}</p>
                  <span className="text-xs text-white/30">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
