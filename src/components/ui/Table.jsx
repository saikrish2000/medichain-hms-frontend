import { cn } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function Table({ columns, data, loading, emptyText = 'No records found', className }) {
  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Search className="w-10 h-10 mb-3 opacity-30" />
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="bg-slate-50/80 text-slate-500 font-medium text-xs uppercase tracking-wider px-5 py-3 whitespace-nowrap"
                style={col.width ? { width: col.width } : {}}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-t border-slate-50 hover:bg-slate-50/70 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 text-slate-700 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null;
  return (
    <div className={cn('flex items-center justify-between px-5 py-3 border-t border-slate-100', className)}>
      <p className="text-xs text-slate-500">Page {page + 1} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          const p = i + Math.max(0, page - 2);
          if (p >= totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors',
                p === page ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 text-slate-600'
              )}
            >
              {p + 1}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
