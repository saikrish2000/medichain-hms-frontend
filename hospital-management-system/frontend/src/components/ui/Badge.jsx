import { cn } from '../../utils/helpers';

const variants = {
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-green-100 text-green-700',
  red:    'bg-red-100 text-red-700',
  amber:  'bg-amber-100 text-amber-700',
  purple: 'bg-purple-100 text-purple-700',
  slate:  'bg-slate-100 text-slate-600',
  teal:   'bg-teal-100 text-teal-700',
  orange: 'bg-orange-100 text-orange-700',
};

const statusMap = {
  PENDING:          'amber',
  CONFIRMED:        'blue',
  COMPLETED:        'green',
  CANCELLED:        'red',
  REJECTED:         'red',
  APPROVED:         'green',
  ACTIVE:           'green',
  INACTIVE:         'slate',
  PAID:             'green',
  PARTIAL:          'amber',
  AVAILABLE:        'green',
  OCCUPIED:         'red',
  DISPATCHED:       'blue',
  ON_ROUTE:         'teal',
  AT_SCENE:         'amber',
  ORDERED:          'amber',
  PROCESSING:       'blue',
  SAMPLE_COLLECTED: 'teal',
  MAINTENANCE:      'slate',
  LOW:              'amber',
  HIGH:             'red',
  CRITICAL_LOW:     'red',
  CRITICAL_HIGH:    'red',
  NORMAL:           'green',
};

export default function Badge({ children, variant, status, dot = false, className }) {
  const color = variant || (status ? statusMap[status] : 'slate');
  const v     = variants[color] || variants.slate;
  const label = children || status;

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', v, className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', `bg-current`)} />}
      {label}
    </span>
  );
}
