import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40',
  secondary:
    'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-200',
  ghost:
    'hover:bg-white/5 text-slate-400 hover:text-white',
  danger:
    'bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 hover:text-red-300',
  success:
    'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300',
};

const sizes = {
  xs:  'px-2.5 py-1 text-xs rounded-lg gap-1',
  sm:  'px-3.5 py-1.5 text-sm rounded-xl gap-1.5',
  md:  'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg:  'px-6 py-3 text-base rounded-2xl gap-2',
  xl:  'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

/**
 * Button — a versatile, animated button component.
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-medium transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2
          focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
          ${variants[variant]} ${sizes[size]} ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
