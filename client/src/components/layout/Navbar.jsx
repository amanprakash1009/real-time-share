import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

/**
 * Navbar — sticky animated navigation bar with scroll-aware glass effect.
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled || !isLanding
            ? 'bg-[#060912]/80 backdrop-blur-xl border-b border-white/8 shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Drop<span className="gradient-text-purple">Share</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            {isLanding && (
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {token && user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((o) => !o)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <Avatar name={user.name} size="sm" status="online" />
                    <span className="hidden sm:block text-sm text-slate-300 font-medium">
                      {user.name?.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 glass border border-white/10 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/8">
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <User size={14} /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut size={14} /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Get started</Button>
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              {isLanding && (
                <button
                  className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen((o) => !o)}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && isLanding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/8 bg-[#060912]/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {!token && (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
