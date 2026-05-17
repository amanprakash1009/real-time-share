import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#060912] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full glass rounded-3xl p-10 text-center border border-white/10 shadow-2xl"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-red-500/20">
          <AlertTriangle size={32} className="text-red-400" />
        </div>

        <h1 className="text-6xl font-bold text-white tracking-tight mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-4">Page not found</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The room or page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full" leftIcon={<Home size={16} />}>
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
