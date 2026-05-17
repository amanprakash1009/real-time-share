/**
 * Avatar — user avatar with fallback initials and optional status dot.
 */
const Avatar = ({
  name = '',
  src,
  size = 'md',
  status,
  className = '',
}) => {
  const sizes = {
    xs:  'w-6 h-6 text-[10px]',
    sm:  'w-8 h-8 text-xs',
    md:  'w-10 h-10 text-sm',
    lg:  'w-12 h-12 text-base',
    xl:  'w-16 h-16 text-xl',
  };

  const statusColors = {
    online:  'bg-emerald-400',
    away:    'bg-amber-400',
    offline: 'bg-slate-500',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Generate a consistent hue from the name string
  const hue = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-black/20`}
        style={{
          background: src ? undefined : `hsl(${hue}, 65%, 45%)`,
        }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover rounded-full" />
        ) : (
          initials || '?'
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#060912] ${statusColors[status] || statusColors.offline}`}
        />
      )}
    </div>
  );
};

/**
 * AvatarStack — overlapping avatar row with overflow count.
 */
export const AvatarStack = ({ users = [], max = 4, size = 'sm' }) => {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  return (
    <div className="flex items-center">
      {visible.map((user, i) => (
        <div
          key={user.id || i}
          className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-[#060912] -ml-2 first:ml-0`}
          title={user.name}
          style={{
            background: `hsl(${(user.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 65%, 45%)`,
            zIndex: visible.length - i,
          }}
        >
          {(user.name || '?').slice(0, 2).toUpperCase()}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-slate-400 bg-slate-800 ring-2 ring-[#060912] -ml-2 text-[10px]`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default Avatar;
