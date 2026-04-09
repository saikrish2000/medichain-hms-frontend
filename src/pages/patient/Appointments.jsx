import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700', COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600', NO_SHOW:'bg-gray-100 text-gray-600', REJECTED:'bg-red-100 text-red-600' };

export default function PatientAppointments() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['patient-appointments', page],
    queryFn: () => api.get(`/patient/appointments?page=${page}`).then(r => r.data)
  });
  const cancelMut = useMutation({
    mutationFn: (id) => api.post(`/patient/appointments/${id}/cancel`),
    onSuccess: () => { toast.success('Appointment cancelled'); qc.invalidateQueries(['patient-appointments']); }
  });

  const appts = data?.content || data || [];
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="My Appointments" subtitle={`${data?.totalElements ?? appts.length} total`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Doctor','Specialty','Date','Time','Reason','Status','Action'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appts.length===0
              ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No appointments</td></tr>
              : appts.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">Dr. {a.doctor?.user?.firstName} {a.doctor?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{a.doctor?.specialization?.name||'—'}</td>
                <td className="px-4 py-3 text-gray-600">{a.slot?.date||'—'}</td>
                <td className="px-4 py-3 text-gray-600">{a.slot?.startTime?.slice(0,5)||'—'}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{a.reason||'—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status]||'bg-gray-100 text-gray-600'}`}>{a.status}</span></td>
                <td className="px-4 py-3">
                  {(a.status==='PENDING'||a.status==='CONFIRMED') && (
                    <button onClick={()=>{ if(confirm('Cancel this appointment?')) cancelMut.mutate(a.id); }}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200">Cancel</button>
                  )}
                </td>
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
