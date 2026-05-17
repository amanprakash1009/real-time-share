import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Link2, Users } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Hero — the main landing page hero section with animated blobs and CTA.
 */
const Hero = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)' }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet-500/30 text-sm text-violet-300">
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-emerald-400 rounded-full"
              />
              Real-time file sharing — no install required
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
          >
            Share files at the{' '}
            <span className="gradient-text">speed of light</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create a room, drop your files, share the link. Your team sees them instantly — no uploads to cloud, no waiting. Just instant real-time sharing.
          </motion.p>

          {/* CTA group */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="xl"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight size={18} />}
              className="shadow-2xl shadow-violet-500/30"
            >
              Start sharing for free
            </Button>

            {/* Join code input */}
            <div className="flex items-center gap-0 glass border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 px-4 text-slate-500">
                <Link2 size={16} />
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter room code"
                  maxLength={8}
                  className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-36 py-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && joinCode.trim()) {
                      navigate(`/room/${joinCode.trim()}`);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => joinCode.trim() && navigate(`/room/${joinCode.trim()}`)}
                className="h-full px-4 py-3 bg-white/5 hover:bg-white/10 border-l border-white/10 text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                Join
              </button>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <Users size={14} className="text-slate-600" />
              <span>10,000+ files shared today</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-slate-600" />
              <span>Under 50ms latency</span>
            </div>
            <span className="hidden sm:block text-slate-700">•</span>
            <span className="hidden sm:block">No storage limits</span>
          </motion.div>

          {/* Mock product preview */}
          <motion.div
            variants={itemVariants}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 glow-purple">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                <div className="flex-1 flex justify-center">
                  <div className="px-3 py-1 rounded-md bg-white/5 text-xs text-slate-500 font-mono">
                    dropshare.app/room/XK9F2P
                  </div>
                </div>
              </div>

              {/* Simulated room UI */}
              <div className="grid grid-cols-3 min-h-[280px]">
                {/* Files area */}
                <div className="col-span-2 p-6 border-r border-white/8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-slate-400 font-medium">3 users connected</span>
                    </div>
                    <div className="text-xs text-slate-600">Room: XK9F2P</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'design-mockup.fig', size: '4.2 MB', color: 'bg-pink-500/20 border-pink-500/20 text-pink-400' },
                      { name: 'backend-api.zip',   size: '1.8 MB', color: 'bg-amber-500/20 border-amber-500/20 text-amber-400' },
                      { name: 'presentation.pdf',  size: '2.1 MB', color: 'bg-rose-500/20 border-rose-500/20 text-rose-400' },
                      { name: 'demo-video.mp4',    size: '18 MB',  color: 'bg-red-500/20 border-red-500/20 text-red-400' },
                    ].map((f) => (
                      <div key={f.name} className="flex items-center gap-3 p-3 glass rounded-xl border border-white/8">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${f.color}`}>
                          {f.name.split('.').pop().toUpperCase().slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-white font-medium truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-500">{f.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat sidebar */}
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Live Chat</p>
                  {[
                    { name: 'Aman',  msg: 'Uploaded the design files 🎨', time: '2m' },
                    { name: 'Rahul', msg: 'Looks great! Downloading now', time: '1m' },
                    { name: 'Priya', msg: 'Can you add the API docs?',     time: 'now' },
                  ].map((m) => (
                    <div key={m.name + m.time} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-violet-400">{m.name}</span>
                        <span className="text-[9px] text-slate-600">{m.time} ago</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{m.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
