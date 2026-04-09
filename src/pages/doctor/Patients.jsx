import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function DoctorPatients() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['doctor-patients', page],
    queryFn: () => api.get(`/doctor/patients?page=${page}`).then(r => r.data)
  });
  const patients = data?.content || data || [];
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="My Patients" subtitle={`${data?.totalElements ?? patients.length} patients`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Name','Gender','Age','Blood Group','Phone','Email'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.length===0
              ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No patients</td></tr>
              : patients.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.user?.firstName} {p.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{p.gender?.toLowerCase()||'—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.dateOfBirth ? new Date().getFullYear()-new Date(p.dateOfBirth).getFullYear() : '—'}</td>
                <td className="px-4 py-3">
                  {p.bloodGroup && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-semibold">{p.bloodGroup}</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.user?.phone||'—'}</td>
                <td className="px-4 py-3 text-gray-500">{p.user?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(data?.totalPages||1)>1 && (
          <div className="flex justify-center gap-2 py-4 border-t border-gray-100">
            <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-500">{page+1}/{data?.totalPages}</span>
            <button onClick={()=>setPage(p=>p+1)} disabled={page>=(data?.totalPages||1)-1} className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
