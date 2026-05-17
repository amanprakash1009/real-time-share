import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';

/**
 * Register — premium split-layout registration page.
 */
const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, token } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const getPasswordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '20%' };
    if (pw.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'Fair', color: 'bg-amber-500', width: '65%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register({ name: form.name, email: form.email, password: form.password });
    if (res.success) {
      setToast({ type: 'success', msg: 'Account created! Welcome 🎉' });
      setTimeout(() => navigate('/dashboard'), 1400);
    }
  };

  const inputBase = (field) =>
    `w-full bg-transparent text-white placeholder-slate-600 text-sm outline-none`;

  const wrapperBase = (field) =>
    `relative flex items-center glass rounded-xl border transition-colors ${
      fieldErrors[field] ? 'border-red-500/50' : 'border-white/10 focus-within:border-violet-500/50'
    }`;

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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)' }} />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Drop<span className="gradient-text-purple">Share</span></span>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Start sharing files in <span className="gradient-text">seconds</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Join thousands of teams who use DropShare to share files instantly. Free forever, no credit card needed.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              { icon: Shield, label: 'Secure rooms', sub: 'Private & encrypted' },
              { icon: Zap,    label: 'Instant sync',  sub: 'Under 50ms latency' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="glass border border-white/8 rounded-2xl p-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={15} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-sm text-slate-600">
          "The simplest way to share files with the team. We use it every sprint."<br />
          <span className="text-slate-400 font-medium mt-1 block">— Priya S., Product Designer</span>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-12 relative overflow-y-auto">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-sm font-medium z-50 ${
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
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
              <div className={wrapperBase('name')}>
                <User size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
                <input id="reg-name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Aman Prakash" className={`${inputBase('name')} pl-11 pr-4 py-3`} />
              </div>
              {fieldErrors.name && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className={wrapperBase('email')}>
                <Mail size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
                <input id="reg-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={`${inputBase('email')} pl-11 pr-4 py-3`} />
              </div>
              {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className={wrapperBase('password')}>
                <Lock size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
                <input id="reg-password" name="password" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className={`${inputBase('password')} pl-11 pr-12 py-3`} />
                <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-[11px] text-slate-500">{strength.label}</p>
                </div>
              )}
              {fieldErrors.password && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm password</label>
              <div className={wrapperBase('confirmPassword')}>
                <Lock size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
                <input id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" className={`${inputBase('confirmPassword')} pl-11 pr-12 py-3`} />
                <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} />{fieldErrors.confirmPassword}</p>}
            </div>

            <div className="pt-2">
              <Button id="register-submit" type="submit" size="lg" isLoading={isLoading} rightIcon={<ArrowRight size={17} />} className="w-full">
                Create account
              </Button>
            </div>
          </form>

          <p className="text-xs text-slate-600 text-center mt-4">
            By signing up you agree to our <a href="#" className="text-slate-500 hover:text-slate-300">Terms</a> &amp; <a href="#" className="text-slate-500 hover:text-slate-300">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
          </p>

          <div className="text-center mt-3">
            <Link to="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">← Back to home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
