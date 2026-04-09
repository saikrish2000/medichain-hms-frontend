import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminAuditLogs() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: () => api.get(`/admin/audit-logs?page=${page}`).then(r => r.data)
  });
  const logs = data?.content || data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="System activity trail" />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Time','User','Action','Entity','Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length === 0
              ? <tr><td colSpan={5} className="text-center py-10 text-gray-400">No logs found</td></tr>
              : logs.map((l, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {l.createdAt ? new Date(l.createdAt).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 font-medium">{l.username || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{l.action}</td>
                <td className="px-4 py-3 text-gray-500">{l.entityType}{l.entityId ? ` #${l.entityId}` : ''}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${l.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            <button onClick={() => setPage(p=>Math.max(0,p-1))} disabled={page===0}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <span className="text-sm text-gray-500">{page+1}/{totalPages}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={page>=totalPages-1}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
