import { cn } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  success:   'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
  warning:   'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 shadow-sm',
  ghost:     'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  outline:   'border border-slate-300 text-slate-700 hover:bg-slate-50 bg-white',
  link:      'text-primary-600 hover:text-primary-700 hover:underline p-0 h-auto',
};

const sizes = {
  xs: 'text-xs px-2.5 py-1 rounded-lg',
  sm: 'text-sm px-3 py-1.5 rounded-xl',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3 rounded-xl',
  xl: 'text-lg px-8 py-4 rounded-2xl',
};

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon,
  iconRight,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
