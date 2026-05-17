/**
 * Badge — small status / category label.
 */
const Badge = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default:  'bg-white/5 border border-white/10 text-slate-400',
    purple:   'bg-violet-500/15 border border-violet-500/20 text-violet-400',
    blue:     'bg-blue-500/15 border border-blue-500/20 text-blue-400',
    green:    'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400',
    red:      'bg-red-500/15 border border-red-500/20 text-red-400',
    amber:    'bg-amber-500/15 border border-amber-500/20 text-amber-400',
    pink:     'bg-pink-500/15 border border-pink-500/20 text-pink-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
