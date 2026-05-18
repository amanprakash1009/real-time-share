import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, FileText, HardDrive, ArrowUpRight, Search, Plus, Sparkles, X, LogOut, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuthStore } from '../store/authStore';
import roomService from '../services/roomService';

const Dashboard = () => {
  const { user, fetchMe, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const stats = [
    { label: 'Active Collaboration Rooms', value: '1', icon: FolderOpen, color: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/20' },
    { label: 'Files Shared This Week', value: '42', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/20' },
    { label: 'Direct Storage Usage', value: '840 MB', icon: HardDrive, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20' },
  ];

  // Some premium demo/recent rooms to make the dashboard look extremely rich and full of life
  const demoRooms = [
    { id: 'XK9F2P', name: 'Design Collaboration Assets', active: 3, time: 'Expires in 18 hrs' },
    { id: 'M4V8B1', name: 'Marketing Strategy Deck', active: 1, time: 'Expires in 4 hrs' },
  ];

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setErrorMsg(null);
    try {
      const response = await roomService.createRoom();
      if (response && response.roomId) {
        // Redirect the user to the newly generated room path
        navigate(`/room/${response.roomId}`);
      } else {
        throw new Error('Invalid response structure from server.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Could not create collaboration room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060912] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#060912] to-[#03050a] flex text-slate-100 font-sans selection:bg-violet-500/30 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar />

      <main className="flex-1 ml-60 p-8 xl:p-12 max-w-7xl mx-auto w-full transition-all duration-300">
        
        {/* Error notification banner */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between text-rose-400 text-sm backdrop-blur-xl"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <p>{errorMsg}</p>
              </div>
              <button 
                onClick={() => setErrorMsg(null)}
                className="p-1 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20 flex items-center gap-1.5">
                <Sparkles size={10} className="animate-spin-slow" />
                Collaborator Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">{user?.name || 'Collaborator'}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Create or join rooms to begin secure, real-time peer collaborations.</p>
          </div>

          {/* Action Header controls */}
          <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto">
            <div className="relative glass rounded-xl border border-white/5 flex items-center px-3.5 py-2.5 flex-1 sm:w-64 sm:flex-initial focus-within:border-violet-500/30 transition-all duration-300">
              <Search size={16} className="text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search active rooms..."
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              />
            </div>
            
            <button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg shadow-violet-500/20 active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none group shrink-0"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Room...
                </>
              ) : (
                <>
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                  Create New Room
                </>
              )}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-300" />
              <div className="flex items-center justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.border} shadow-inner`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <ArrowUpRight size={18} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1.5 tracking-tight">{stat.value}</p>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Workspace Management section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Area: Recent & Sandbox Rooms */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-violet-400" />
                  <h2 className="text-lg font-bold text-white tracking-tight">Active Rooms</h2>
                </div>
                <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  Temp Rooms Expire in 24 Hrs
                </span>
              </div>

              {/* Grid of rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {demoRooms.map((room, i) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                    onClick={() => navigate(`/room/${room.id}`)}
                    className="glass rounded-2xl p-6 border border-white/5 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/5 cursor-pointer group transition-all duration-300 relative"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner">
                        <FolderOpen size={20} className="text-violet-400 group-hover:text-violet-300 transition-colors" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 font-bold uppercase tracking-wider group-hover:border-violet-500/20 group-hover:text-violet-300 transition-all">
                        {room.id}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-300 transition-colors tracking-tight">
                      {room.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-6 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${room.active > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                        {room.active} active now
                      </div>
                      <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        <Clock size={12} className="text-slate-600" />
                        {room.time}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Instant Create Room Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  onClick={handleCreateRoom}
                  className="glass rounded-2xl p-6 border border-dashed border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 cursor-pointer group flex flex-col items-center justify-center text-center min-h-[195px] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-600/20 group-hover:scale-110 transition-all duration-300 mb-3 border border-white/5">
                    <Plus size={22} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">Start a new collaboration room</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Generate a secure link and invite collaborators instantly.</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Live Collaboration & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />
              
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-violet-400 animate-pulse" />
                Quick Join
              </h3>
              <p className="text-xs text-slate-400 mb-4">Have an invite code? Paste it below to instantly join your colleagues' shared room workspace.</p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const code = e.target.roomCode.value.trim().toLowerCase();
                  if (code) {
                    navigate(`/room/${code}`);
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  name="roomCode"
                  placeholder="Enter 8-digit Room Code (e.g. xk9f2p)"
                  required
                  className="w-full bg-[#0a0d16] border border-white/5 focus:border-violet-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-white/5 hover:bg-violet-600 text-white font-bold text-xs py-3 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                >
                  Join Collaborators
                </button>
              </form>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                My Credentials
              </h3>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{user?.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate max-w-[170px]">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 font-bold text-xs py-3 rounded-xl border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300 cursor-pointer"
              >
                <LogOut size={13} />
                Log Out of Account
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
