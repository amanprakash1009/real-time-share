import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Button from '../ui/Button';

/**
 * CTASection — full-width gradient CTA banner.
 */
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(96,165,250,0.2) 50%, rgba(52,211,153,0.15) 100%)',
            border: '1px solid rgba(139,92,246,0.3)',
          }}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40"
              style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-xl shadow-violet-500/30 mb-6 mx-auto">
              <Zap size={24} className="text-white" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Ready to share instantly?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
              Create your first room for free in under 10 seconds. No credit card, no setup.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight size={18} />}
                className="shadow-2xl shadow-violet-500/30"
              >
                Get started — it's free
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
