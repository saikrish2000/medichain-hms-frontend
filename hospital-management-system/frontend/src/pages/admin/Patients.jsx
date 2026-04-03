import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminPatients() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-patients', page, query],
    queryFn: () => {
      const url = query
        ? `/admin/patients/search?q=${encodeURIComponent(query)}&page=${page}`
        : `/admin/patients?page=${page}`;
      return api.get(url).then(r => r.data);
    }
  });

  const patients = data?.content || data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="All Patients" subtitle={`${data?.totalElements ?? patients.length} registered patients`} />

      <div className="flex gap-3 mb-5">
        <input
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if(e.key==='Enter') { setQuery(search); setPage(0); } }}
        />
        <button onClick={() => { setQuery(search); setPage(0); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
          Search
        </button>
        {query && (
          <button onClick={() => { setQuery(''); setSearch(''); setPage(0); }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">
            Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name','Gender','Blood Group','Phone','Registered'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No patients found</td></tr>
            ) : patients.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.user?.firstName} {p.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{p.gender?.toLowerCase() || '—'}</td>
                <td className="px-4 py-3">
                  {p.bloodGroup && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">{p.bloodGroup.replace('_','+').replace('NEGATIVE','-')}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.user?.phone || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
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
