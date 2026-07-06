import { useState } from 'react';
import { readAuditLog, clearAuditLog, type AuditEntry } from '../../lib/security';
import { Activity, Trash2, ShieldCheck, ShieldX, LogIn, LogOut, Edit2, AlertTriangle } from 'lucide-react';

function getActionIcon(action: string) {
  if (action === 'LOGIN_SUCCESS') return <LogIn size={14} className="text-green-400" />;
  if (action === 'LOGIN_FAILED') return <ShieldX size={14} className="text-red-400" />;
  if (action === 'LOGOUT') return <LogOut size={14} className="text-white/40" />;
  if (action.includes('TOUR') || action.includes('EDIT')) return <Edit2 size={14} className="text-secondary" />;
  if (action.includes('DELETE')) return <Trash2 size={14} className="text-red-400" />;
  return <Activity size={14} className="text-white/50" />;
}

function getActionColor(action: string): string {
  if (action === 'LOGIN_SUCCESS') return 'text-green-400 bg-green-400/10 border-green-400/20';
  if (action === 'LOGIN_FAILED') return 'text-red-400 bg-red-400/10 border-red-400/20';
  if (action === 'LOGOUT') return 'text-white/40 bg-white/5 border-white/10';
  if (action.includes('DELETE')) return 'text-red-400 bg-red-400/10 border-red-400/20';
  return 'text-secondary bg-secondary/10 border-secondary/20';
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>(readAuditLog());
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    clearAuditLog();
    setLogs([]);
    setConfirmClear(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="text-primary" size={28} /> Registo de Auditoria
          </h1>
          <p className="text-white/50">Todas as ações realizadas por administradores são registadas aqui.</p>
        </div>
        
        {logs.length > 0 && (
          <button 
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 transition-all text-sm"
          >
            <Trash2 size={16} /> Limpar Registo
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="py-20 text-center border border-white/5 border-dashed rounded-2xl bg-white/[0.02]">
          <ShieldCheck className="mx-auto text-white/20 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Registo limpo</h3>
          <p className="text-white/40">Ainda não foram registadas ações. As ações de login, edição e eliminação aparecerão aqui.</p>
        </div>
      ) : (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Data / Hora</th>
                  <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Administrador</th>
                  <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Ação</th>
                  <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Recurso</th>
                  <th className="py-4 px-6 text-xs font-bold text-white/50 uppercase tracking-widest">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-6 text-sm text-white/50 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('pt-PT')}
                    </td>
                    <td className="py-3 px-6 text-sm text-white font-medium">{log.adminEmail}</td>
                    <td className="py-3 px-6">
                      <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)} {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-white/70">{log.resource}</td>
                    <td className="py-3 px-6 text-sm text-white/50 italic">{log.details ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-white/5 text-xs text-white/30">
            {logs.length} evento(s) registado(s) · Máximo de 200 entradas · Guardado localmente até ligar ao Supabase
          </div>
        </div>
      )}

      {/* Confirm Clear Modal */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-red-500/30 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center animate-in zoom-in duration-200">
            <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Confirmar limpeza</h3>
            <p className="text-white/60 mb-6">Esta ação é irreversível. Todo o histórico de auditoria será eliminado permanentemente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmClear(false)} className="flex-1 py-3 rounded-xl font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors">Cancelar</button>
              <button onClick={handleClear} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">Sim, limpar tudo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
