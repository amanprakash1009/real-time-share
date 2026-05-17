import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';

/**
 * Login — premium split-layout login page.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, token } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => { if (token) navigate('/dashboard', { replace: true }); }, [token, navigate]);

  useEffect(() => {
    if (error) {
      setToast({ type: 'error', msg: error });
      clearError();
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(form);
    if (res.success) {
      setToast({ type: 'success', msg: 'Welcome back! 👋' });
      setTimeout(() => navigate('/dashboard'), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#060912] flex">
      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden px-14 py-12"
        style={{ background: 'linear-gradient(135deg, #0d0a1f 0%, #12082a 50%, #0a0f1f 100%)' }}
      >
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)' }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Drop<span className="gradient-text-purple">Share</span></span>
        </div>

        {/* Middle content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Share files with your team — <span className="gradient-text">instantly</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Create a room, drop your files, and collaborate in real time. No email attachments, no cloud uploads.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {['Real-time sync across all devices', 'No file size limits for rooms', 'Secure private rooms'].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} className="text-violet-400" />
                </div>
                <span className="text-sm text-slate-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative flex items-center gap-8">
          {[{ num: '10K+', label: 'Daily rooms' }, { num: '500K+', label: 'Files shared' }, { num: '<50ms', label: 'Latency' }].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.num}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 relative">
        {/* Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium z-50 ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">Drop<span className="gradient-text-purple">Share</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className={`relative flex items-center glass rounded-xl border transition-colors ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10 focus-within:border-violet-500/50'}`}>
                <Mail size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-white placeholder-slate-600 pl-11 pr-4 py-3 text-sm outline-none"
                />
              </div>
              {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className={`relative flex items-center glass rounded-xl border transition-colors ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10 focus-within:border-violet-500/50'}`}>
                <Lock size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="w-full bg-transparent text-white placeholder-slate-600 pl-11 pr-12 py-3 text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{fieldErrors.password}</p>}
            </div>

            <Button id="login-submit" type="submit" size="lg" isLoading={isLoading} rightIcon={<ArrowRight size={17} />} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>

          {/* Back to landing */}
          <div className="text-center mt-4">
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
