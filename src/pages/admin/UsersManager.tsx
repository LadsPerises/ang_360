import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, MoreVertical, Mail, Calendar, Award, RefreshCw, ShieldAlert } from 'lucide-react';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Ativo' | 'Bloqueado';
  joinDate: string;
  stampsCollected: number;
  avatarUrl?: string;
};

export default function UsersManager() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users.php');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Falha ao carregar utilizadores', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Ativo' ? 'Bloqueado' : 'Ativo';
    try {
      const res = await fetch('/api/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_user', user_id: userId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as 'Ativo' | 'Bloqueado' } : u));
      } else {
        alert('Erro ao atualizar estado.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    if (!window.confirm('Tens a certeza que queres promover este utilizador a Administrador?')) return;
    try {
      const res = await fetch('/api/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_user', user_id: userId, role: 'Admin' })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: 'Admin' } : u));
      } else {
        alert('Erro ao promover utilizador.');
      }
    } catch (err) {
      console.error(err);
    }
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
        
        <div className="flex items-center gap-4">
          <button onClick={fetchUsers} disabled={isLoading} className="text-white/50 hover:text-white transition-colors">
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user, idx) => (
          <div 
            key={user.id} 
            className="group bg-[#111] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative overflow-hidden"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Background Glow based on Status/Role */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 pointer-events-none transition-colors duration-500 ${user.role === 'Admin' ? 'bg-secondary' : user.status === 'Bloqueado' ? 'bg-red-500' : 'bg-primary'}`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-black shadow-lg overflow-hidden relative ${user.role === 'Admin' ? 'bg-gradient-to-tr from-secondary to-yellow-200' : 'bg-gradient-to-tr from-primary to-orange-400'}`}>
                  {user.avatarUrl && user.avatarUrl.startsWith('/uploads/') ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.avatarUrl === 'default' || !user.avatarUrl ? user.name.charAt(0).toUpperCase() : user.avatarUrl
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight truncate w-32" title={user.name}>{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {user.role === 'Admin' ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20"><Shield size={10} /> Admin</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">Turista</span>
                    )}
                  </div>
                </div>
              </div>
              
              {user.role !== 'Admin' && (
                <button onClick={() => promoteToAdmin(user.id)} title="Promover a Admin" className="text-white/20 hover:text-secondary transition-colors">
                  <ShieldAlert size={18} />
                </button>
              )}
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={14} className="text-white/30" />
                <span className="truncate" title={user.email}>{user.email}</span>
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
                <span className="text-sm font-bold text-white">{user.stampsCollected} <span className="text-white/30 font-normal">/ 21</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(user.stampsCollected / 21) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${user.status === 'Ativo' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {user.status === 'Ativo' ? <UserCheck size={12} /> : <UserX size={12} />}
                {user.status}
              </span>
              
              <button 
                onClick={() => updateUserStatus(user.id, user.status)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${user.status === 'Ativo' ? 'text-white/50 hover:text-red-400 hover:bg-red-400/10' : 'text-white/50 hover:text-green-400 hover:bg-green-400/10'}`}
              >
                {user.status === 'Ativo' ? 'Bloquear' : 'Desbloquear'}
              </button>
            </div>
          </div>
        ))}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center border border-white/5 border-dashed rounded-2xl bg-white/[0.02]">
            <Search className="mx-auto text-white/20 mb-4" size={40} />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum utilizador encontrado</h3>
            <p className="text-white/50">Não foram encontrados resultados na base de dados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
