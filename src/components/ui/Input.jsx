import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconRight,
  className,
  containerClass,
  type = 'text',
  size = 'md',
  ...props
}, ref) => {
  const sizes = { sm: 'px-3 py-2 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-4 py-3 text-base' };

  return (
    <div className={cn('space-y-1.5', containerClass)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-slate-50 disabled:text-slate-400 transition-all duration-150',
            sizes[size],
            icon     && 'pl-10',
            iconRight && 'pr-10',
            error     ? 'border-red-400 focus:ring-red-400' : 'border-slate-200',
            className
          )}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef(({ label, error, children, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <select
      ref={ref}
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 text-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:bg-slate-50 transition-all duration-150',
        error ? 'border-red-400' : 'border-slate-200',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = 'Select';

export const Textarea = forwardRef(({ label, error, className, rows = 3, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border bg-white text-slate-900 text-sm resize-none',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'transition-all duration-150 placeholder:text-slate-400',
        error ? 'border-red-400' : 'border-slate-200',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export default Input;
