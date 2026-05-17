import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Layers, Clock, Wifi } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-time sync',
    description: 'Files appear for all room members the instant they\'re uploaded. Zero delay, powered by WebSockets.',
    gradient: 'from-violet-500 to-indigo-600',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: Globe,
    title: 'Any file type',
    description: 'Images, videos, PDFs, code files, archives — share anything up to 2 GB per file with full previews.',
    gradient: 'from-blue-500 to-cyan-600',
    glow: 'shadow-blue-500/20',
  },
  {
    icon: Shield,
    title: 'Secure rooms',
    description: 'Every room has a unique code. Only people with your link or code can join and access files.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: Layers,
    title: 'File previews',
    description: 'Preview images, play videos, read PDFs and text files — all without leaving the room.',
    gradient: 'from-orange-500 to-amber-600',
    glow: 'shadow-orange-500/20',
  },
  {
    icon: Clock,
    title: 'Activity history',
    description: 'A live activity feed shows who joined, uploaded, or deleted files — with timestamps.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/20',
  },
  {
    icon: Wifi,
    title: 'Live presence',
    description: 'See who\'s in the room right now with live avatar stacks and online indicators.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-purple-500/20',
  },
];

/**
 * Features — six animated feature cards in a 3-column grid.
 */
const Features = () => {
  return (
    <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-violet-400 uppercase tracking-widest">Features</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Everything you need to share
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            A complete file-sharing toolkit built for speed, simplicity, and real-time collaboration.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="glass-hover rounded-2xl p-6 h-full">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg ${feat.glow}`}
                >
                  <feat.icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
