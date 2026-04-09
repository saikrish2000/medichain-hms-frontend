import { cn } from '../../utils/helpers';

export default function Card({ children, className, glass = false, ...props }) {
  return (
    <div
      className={cn(
        glass
          ? 'bg-white/70 backdrop-blur-xl shadow-glass border border-white/60'
          : 'bg-white shadow-card border border-slate-100',
        'rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, action, title, subtitle }) {
  if (title || subtitle || action) {
    return (
      <div className={cn('px-6 pt-6 pb-4 flex items-start justify-between', className)}>
        <div>
          {title    && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          {children}
        </div>
        {action && <div className="ml-4 flex-shrink-0">{action}</div>}
      </div>
    );
  }
  return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>;
}

export function CardBody({ children, className }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-50 rounded-b-2xl bg-slate-50/50', className)}>
      {children}
    </div>
  );
}

// Stat card
export function StatCard({ title, value, icon, color = 'blue', trend, trendLabel, className }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-100 text-blue-600',   text: 'text-blue-600' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-100 text-red-600',     text: 'text-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' },
    amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-100 text-teal-600',   text: 'text-teal-600' },
  };
  const c = colors[color] || colors.blue;

  return (
    <Card className={cn('p-5 hover:shadow-card-md transition-shadow', c.bg, className)}>
      <div className="flex items-center gap-4">
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', c.icon)}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{value ?? '—'}</p>
          {trend != null && (
            <p className={cn('text-xs mt-1', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
