import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, LayoutDashboard, FolderOpen, Clock, Settings, LogOut, Plus,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'My Rooms',  icon: FolderOpen,      to: '/rooms' },
  { label: 'History',   icon: Clock,            to: '/history' },
  { label: 'Settings',  icon: Settings,         to: '/settings' },
];

/**
 * Sidebar — fixed dashboard sidebar with logo, navigation, and user section.
 */
const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 w-60 flex flex-col bg-[#080b14] border-r border-white/8 z-30"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/8">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Drop<span className="gradient-text-purple">Share</span>
          </span>
        </NavLink>
      </div>

      {/* Create Room CTA */}
      <div className="px-3 py-3 border-b border-white/8">
        <NavLink to="/room/new">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20">
            <Plus size={15} />
            Create Room
          </button>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 py-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">
          Menu
        </p>
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <Avatar name={user?.name || ''} size="sm" status="online" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
