import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ROLE_BADGE = {
  ADMIN:'bg-purple-100 text-purple-700', DOCTOR:'bg-blue-100 text-blue-700',
  PATIENT:'bg-green-100 text-green-700', NURSE:'bg-pink-100 text-pink-700',
  PHARMACIST:'bg-yellow-100 text-yellow-700', LAB_TECHNICIAN:'bg-orange-100 text-orange-700',
  BLOOD_BANK_MANAGER:'bg-red-100 text-red-700', AMBULANCE_OPERATOR:'bg-teal-100 text-teal-700',
  RECEPTIONIST:'bg-indigo-100 text-indigo-700',
};

export default function AdminUsers() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => api.get(`/admin/users?page=${page}`).then(r => r.data)
  });

  if (isLoading) return <LoadingSpinner />;
  const users = data?.content || data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <PageHeader title="All Users" subtitle={`${data?.totalElements || users.length} total users`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Name','Username','Email','Role','Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{u.username}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_BADGE[u.role] || 'bg-gray-100 text-gray-600'}`}>
                    {u.role?.replace(/_/g,' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {u.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0}
              className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-500">{page+1} / {totalPages}</span>
            <button onClick={() => setPage(p => p+1)} disabled={page>=totalPages-1}
              className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
