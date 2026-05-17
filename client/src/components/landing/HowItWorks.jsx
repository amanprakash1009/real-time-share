import { motion } from 'framer-motion';
import { PlusCircle, Link2, Upload } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: PlusCircle,
    title: 'Create a room',
    description: 'Click "Create Room" to instantly generate a private sharing room with a unique code.',
    color: 'text-violet-400',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
  },
  {
    step: '02',
    icon: Link2,
    title: 'Share the link',
    description: 'Copy the room link or code and send it to anyone — no account needed to join as a guest.',
    color: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
  },
  {
    step: '03',
    icon: Upload,
    title: 'Drop your files',
    description: 'Drag and drop files into the room. Everyone sees them instantly in real time.',
    color: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
];

/**
 * HowItWorks — 3-step numbered section with connecting line.
 */
const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">How it works</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Up and running in 30 seconds
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            No setup, no configuration. Just create, share, and collaborate.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div
                  className={`relative w-24 h-24 rounded-2xl glass border ${step.border} flex items-center justify-center mb-6 shadow-xl ${step.glow}`}
                >
                  <step.icon size={36} className={step.color} />
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#060912] border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
