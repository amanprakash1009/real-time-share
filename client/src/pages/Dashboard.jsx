import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, HardDrive, ArrowUpRight, Search } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const { user, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const stats = [
    { label: 'Active Rooms', value: '3', icon: FolderOpen, color: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/20' },
    { label: 'Total Files Shared', value: '128', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
    { label: 'Storage Used', value: '4.2 GB', icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  ];

  const recentRooms = [
    { id: 'XK9F2P', name: 'Design Assets Q3', active: 3, time: '2 mins ago' },
    { id: 'M4V8B1', name: 'Marketing Video Drafts', active: 1, time: '1 hour ago' },
    { id: 'P9L2K4', name: 'Frontend Deploy Logs', active: 0, time: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-[#060912] flex">
      <Sidebar />

      <main className="flex-1 ml-60 p-8">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p className="text-sm text-slate-400 mt-1">Here is what's happening with your files today.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative glass rounded-xl border border-white/10 flex items-center px-3 py-2 w-64 focus-within:border-violet-500/40 transition-colors">
              <Search size={16} className="text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search rooms or files..."
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.border}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <ArrowUpRight size={18} className="text-slate-600" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Rooms */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Rooms</h2>
            <button className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors">View all</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                className="glass-hover rounded-2xl p-5 border border-white/8 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center">
                    <FolderOpen size={20} className="text-violet-400" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                    {room.id}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{room.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${room.active > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    {room.active} active now
                  </div>
                  <span>{room.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
