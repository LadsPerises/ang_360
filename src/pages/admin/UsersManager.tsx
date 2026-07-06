import { useState } from 'react';
import { Search, UserCheck, UserX, Shield, MoreVertical, Mail, Calendar, Award } from 'lucide-react';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Turista';
  status: 'Ativo' | 'Bloqueado';
  joinDate: string;
  stampsCollected: number;
  avatarUrl?: string;
};

export default function UsersManager() {
  const [users, setUsers] = useState<UserProfile[]>([
    { id: '1', name: 'Ladislau Borges', email: 'ladislau@angola360.com', role: 'Admin', status: 'Ativo', joinDate: '01 Mai 2026', stampsCollected: 18, avatarUrl: 'LB' },
    { id: '2', name: 'Ana Costa', email: 'ana.costa@gmail.com', role: 'Turista', status: 'Ativo', joinDate: '05 Mai 2026', stampsCollected: 4, avatarUrl: 'AC' },
    { id: '3', name: 'Paulo Silva', email: 'paulo.s@yahoo.com', role: 'Turista', status: 'Ativo', joinDate: '06 Mai 2026', stampsCollected: 2, avatarUrl: 'PS' },
    { id: '4', name: 'Marta Mendes', email: 'marta.mendes@hotmail.com', role: 'Turista', status: 'Bloqueado', joinDate: '07 Mai 2026', stampsCollected: 0, avatarUrl: 'MM' },
    { id: '5', name: 'João Santos', email: 'joao.santos@outlook.com', role: 'Turista', status: 'Ativo', joinDate: '08 Mai 2026', stampsCollected: 1, avatarUrl: 'JS' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === 'Ativo' ? 'Bloqueado' : 'Ativo' };
      }
      return user;
    }));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
          <p className="text-white/50">Gira os utilizadores registados e o progresso dos seus passaportes.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user, idx) => (
          <div 
            key={user.id} 
            className="group bg-[#111] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative overflow-hidden"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Background Glow based on Status/Role */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500 ${user.role === 'Admin' ? 'bg-secondary' : user.status === 'Bloqueado' ? 'bg-red-500' : 'bg-primary'}`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-black shadow-lg ${user.role === 'Admin' ? 'bg-gradient-to-tr from-secondary to-yellow-200' : 'bg-gradient-to-tr from-primary to-orange-400'}`}>
                  {user.avatarUrl}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {user.role === 'Admin' ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20"><Shield size={10} /> Admin</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">Turista</span>
                    )}
                  </div>
                </div>
              </div>
              
              <button className="text-white/30 hover:text-white transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={14} className="text-white/30" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Calendar size={14} className="text-white/30" />
                <span>Membro desde {user.joinDate}</span>
              </div>
            </div>

            {/* Passport Progress Bar */}
            <div className="mb-6 relative z-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-white/50 uppercase tracking-wider font-bold flex items-center gap-1"><Award size={12} className="text-primary"/> Passaporte</span>
                <span className="text-sm font-bold text-white">{user.stampsCollected} <span className="text-white/30 font-normal">/ 18</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(user.stampsCollected / 18) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${user.status === 'Ativo' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {user.status === 'Ativo' ? <UserCheck size={12} /> : <UserX size={12} />}
                {user.status}
              </span>
              
              <button 
                onClick={() => toggleUserStatus(user.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.status === 'Ativo' ? 'text-white/50 hover:text-red-400 hover:bg-red-400/10' : 'text-white/50 hover:text-green-400 hover:bg-green-400/10'}`}
              >
                {user.status === 'Ativo' ? 'Bloquear' : 'Desbloquear'}
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center border border-white/5 border-dashed rounded-2xl bg-white/[0.02]">
            <Search className="mx-auto text-white/20 mb-4" size={40} />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum utilizador encontrado</h3>
            <p className="text-white/50">Não foram encontrados resultados para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
