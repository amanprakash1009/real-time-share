import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Share2, ArrowLeft, Copy, Check, Loader2, AlertCircle, 
  Sparkles, Clock, Calendar, HelpCircle 
} from 'lucide-react';
import roomService from '../services/roomService';
import { useAuthStore } from '../store/authStore';

const RoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await roomService.getRoom(id);
        if (data && data.success) {
          setRoom(data.room);
        } else {
          throw new Error('Could not fetch room details.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'The room could not be loaded.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/room/${id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format date strings nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if room is active or expired
  const getTimeRemaining = (expiresAtStr) => {
    if (!expiresAtStr) return '';
    const diff = new Date(expiresAtStr) - new Date();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${mins}m remaining`;
    }
    return `${mins}m remaining`;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060912] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#060912] to-[#03050a] flex items-center justify-center p-6 text-slate-100">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-pulse" />
            <Loader2 className="w-16 h-16 text-violet-500 animate-spin absolute inset-0" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5"
          >
            <h3 className="text-lg font-bold text-white tracking-tight">Initializing Workspace</h3>
            <p className="text-xs text-slate-400">Verifying secure peer routing & keys...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render error/expired state
  if (error || !room) {
    return (
      <div className="min-h-screen bg-[#060912] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#060912] to-[#03050a] flex items-center justify-center p-6 text-slate-100 selection:bg-rose-500/20 selection:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl" />
          
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6 shadow-inner">
              <AlertCircle className="w-7 h-7 text-rose-400" />
            </div>
            
            <h2 className="text-xl font-extrabold text-white mb-2 tracking-tight">Access Verification Failed</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              {error || 'This room could not be loaded. The link may be broken, or the workspace has exceeded its 24-hour collaboration limit and has been secure-wiped.'}
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm py-3.5 px-6 rounded-2xl border border-white/5 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-violet-500/20 active:scale-[0.98] cursor-pointer"
            >
              <ArrowLeft size={16} />
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isOwner = user && room.owner && user.id === room.owner._id;

  return (
    <div className="min-h-screen bg-[#060912] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#060912] to-[#03050a] text-slate-100 font-sans selection:bg-violet-500/30 selection:text-white">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-white/5 glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Leave Room"
            >
              <ArrowLeft size={16} />
            </button>
            
            <div className="h-6 w-px bg-white/10" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 tracking-wider uppercase">
                  Active Session
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  Expires: {formatDate(room.expiresAt)}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                Room Workspace
                <span className="text-slate-500 font-mono font-medium">#{room.roomId}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg shadow-violet-500/15 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Copy Invite Link'}</span>
              <span className="inline sm:hidden">{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Info Banner */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Room Details block */}
          <div className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-violet-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Collaboration Room ID</h4>
              <p className="text-lg font-mono font-bold text-white tracking-wide">{room.roomId}</p>
              <button 
                onClick={handleCopyLink} 
                className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 mt-1 transition-colors"
              >
                Copy join code & link
              </button>
            </div>
          </div>

          {/* Time Remaining block */}
          <div className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Clock size={18} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Self-Destruct TTL Expiry</h4>
              <p className="text-base font-bold text-white mt-0.5">{getTimeRemaining(room.expiresAt)}</p>
              <p className="text-[10px] text-slate-500 mt-1">Automatically secure-wiped at expire date</p>
            </div>
          </div>

          {/* Member Count block */}
          <div className="glass rounded-2xl p-6 border border-white/5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Users size={18} className="text-blue-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Authenticated Members</h4>
              <p className="text-lg font-bold text-white tracking-tight">{room.members?.length || 0} Collaborators</p>
              <p className="text-[10px] text-slate-500 mt-1">Live active peer sharing enabled</p>
            </div>
          </div>

        </section>

        {/* Dashboard Panels */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Members list (Responsive Grid on Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass rounded-3xl border border-white/5 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Users size={20} className="text-violet-400" />
                    Authorized Collaborators
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Anyone with this access list can edit, comment, and collaborate.</p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 tracking-wider uppercase shrink-0">
                  {room.members?.length || 0} Total
                </span>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.members?.map((member, i) => {
                  const isMemberOwner = room.owner && member._id === room.owner._id;
                  const isCurrentUser = user && member._id === user.id;

                  return (
                    <motion.div
                      key={member._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className={`p-4 rounded-2xl border ${
                        isCurrentUser 
                          ? 'bg-violet-500/5 border-violet-500/20' 
                          : 'bg-white/5 border-white/5'
                      } hover:border-white/10 hover:shadow-lg transition-all duration-300 flex items-center gap-4 relative overflow-hidden group`}
                    >
                      {/* Left Gradient User Avatar Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/25 flex items-center justify-center font-bold text-violet-400 shrink-0 select-none text-base group-hover:scale-105 transition-transform">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          member.name?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                          {member.name}
                          {isCurrentUser && (
                            <span className="text-[9px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/25 px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{member.email}</p>
                      </div>

                      {/* Right Tag/Badge */}
                      <div className="ml-auto">
                        {isMemberOwner ? (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                            <Shield size={10} />
                            Owner
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-500/10 border border-slate-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
                            Member
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Info Sidebar (Owner Details & Space Actions) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Owner/Creator Card */}
            <div className="glass rounded-3xl border border-white/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
                <Shield size={14} className="text-amber-400" />
                Room Administrator
              </h3>

              {room.owner ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-xl text-amber-400 shadow-inner">
                      {room.owner.avatar ? (
                        <img src={room.owner.avatar} alt={room.owner.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        room.owner.name?.charAt(0).toUpperCase() || 'A'
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-white truncate">{room.owner.name}</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{room.owner.email}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl border border-white/5 p-4 text-xs text-slate-400 space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span>Authority Type:</span>
                      <span className="font-semibold text-white">Full Access Root</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Room Status:</span>
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Created On:</span>
                      <span className="font-semibold text-white">{new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-dashed border-white/5 text-slate-500 text-xs">
                  Administrator data unavailable
                </div>
              )}
            </div>

            {/* Quick Share Code details */}
            <div className="glass rounded-3xl border border-white/5 p-6 space-y-4 relative overflow-hidden">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 size={14} className="text-violet-400" />
                Invite Code
              </h3>
              <p className="text-xs text-slate-400">
                Share this 8-character unique alphanumeric room ID with your teammates to invite them instantly:
              </p>
              
              <div className="flex items-center gap-2 p-3 bg-[#0a0d16] border border-white/5 rounded-2xl">
                <span className="text-base font-mono font-bold text-white tracking-widest pl-2 select-all uppercase">
                  {room.roomId}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="ml-auto p-2 bg-white/5 hover:bg-violet-600 hover:text-white text-slate-400 rounded-xl transition-all border border-white/5 active:scale-95 cursor-pointer"
                  title="Copy Join Code Link"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="text-[10px] text-slate-500 leading-normal flex items-start gap-1.5 mt-2 bg-violet-500/5 p-3 rounded-xl border border-violet-500/10">
                <HelpCircle size={14} className="text-violet-400 shrink-0 mt-0.5" />
                <span>
                  All collaborators must have a registered profile and be logged in to access this collaboration session.
                </span>
              </div>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
};

export default RoomPage;
