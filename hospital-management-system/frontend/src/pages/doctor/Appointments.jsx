import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = {
  PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700',
  COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600',
  NO_SHOW:'bg-gray-100 text-gray-600', IN_PROGRESS:'bg-purple-100 text-purple-700',
  REJECTED:'bg-red-100 text-red-600',
};

export default function DoctorAppointments() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-appointments', page],
    queryFn: () => api.get(`/doctor/appointments?page=${page}`).then(r => r.data)
  });

  const action = (url) => useMutation({ mutationFn: () => api.post(url), onSuccess: () => { toast.success('Updated'); qc.invalidateQueries(['doctor-appointments']); }});
  const confirm   = useMutation({ mutationFn: (id) => api.post(`/doctor/appointments/${id}/confirm`),   onSuccess: () => { toast.success('Confirmed'); qc.invalidateQueries(['doctor-appointments']); }});
  const reject    = useMutation({ mutationFn: (id) => api.post(`/doctor/appointments/${id}/reject`),    onSuccess: () => { toast.success('Rejected');  qc.invalidateQueries(['doctor-appointments']); }});
  const complete  = useMutation({ mutationFn: (id) => api.post(`/doctor/appointments/${id}/complete`),  onSuccess: () => { toast.success('Completed'); qc.invalidateQueries(['doctor-appointments']); }});
  const noShow    = useMutation({ mutationFn: (id) => api.post(`/doctor/appointments/${id}/no-show`),   onSuccess: () => { toast.success('Marked no-show'); qc.invalidateQueries(['doctor-appointments']); }});

  const appts = data?.content || data || [];
  const totalPages = data?.totalPages || 1;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="My Appointments" subtitle={`${data?.totalElements ?? appts.length} total`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Patient','Date','Time','Reason','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appts.length === 0
              ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No appointments</td></tr>
              : appts.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.patient?.user?.firstName} {a.patient?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{a.slot?.date || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{a.slot?.startTime ? a.slot.startTime.slice(0,5) : '—'}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{a.reason || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status]||'bg-gray-100 text-gray-600'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {a.status === 'PENDING' && <>
                      <button onClick={() => confirm.mutate(a.id)} className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600">Confirm</button>
                      <button onClick={() => reject.mutate(a.id)}  className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600">Reject</button>
                    </>}
                    {(a.status==='CONFIRMED'||a.status==='IN_PROGRESS') && <>
                      <button onClick={() => complete.mutate(a.id)} className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600">Complete</button>
                      <button onClick={() => noShow.mutate(a.id)}   className="px-2 py-1 bg-gray-400 text-white rounded-lg text-xs hover:bg-gray-500">No-show</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
            <button onClick={() => setPage(p=>Math.max(0,p-1))} disabled={page===0} className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <span className="text-sm text-gray-500">{page+1}/{totalPages}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={page>=totalPages-1} className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
