import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-700',CONFIRMED:'bg-blue-100 text-blue-700',COMPLETED:'bg-green-100 text-green-700',CANCELLED:'bg-red-100 text-red-600',IN_PROGRESS:'bg-purple-100 text-purple-700' };

export default function ReceptionistAppointments() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery({
    queryKey: ['receptionist-appointments', page, date],
    queryFn: () => api.get(`/receptionist/appointments?page=${page}&date=${date}`).then(r => r.data)
  });
  const checkInMut = useMutation({
    mutationFn: (id) => api.post(`/receptionist/appointments/${id}/check-in`),
    onSuccess: () => { toast.success('Patient checked in'); qc.invalidateQueries(['receptionist-appointments']); }
  });

  const appts = data?.content || data || [];
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Appointments" subtitle="Today's patient flow" />
      <div className="flex gap-3 mb-5 items-center">
        <input type="date" className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={date} onChange={e=>setDate(e.target.value)} />
        <span className="text-sm text-gray-500">{appts.length} appointments</span>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Patient','Doctor','Time','Reason','Status','Action'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appts.length===0
              ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No appointments for this date</td></tr>
              : appts.map(a=>(
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.patient?.user?.firstName} {a.patient?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600">Dr. {a.doctor?.user?.firstName} {a.doctor?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{a.slot?.startTime?.slice(0,5)||'—'}</td>
                <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{a.reason||'—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status]||'bg-gray-100 text-gray-600'}`}>{a.status}</span></td>
                <td className="px-4 py-3">
                  {a.status==='CONFIRMED' && !a.checkedInAt && (
                    <button onClick={()=>checkInMut.mutate(a.id)} className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600">Check In</button>
                  )}
                  {a.checkedInAt && <span className="text-xs text-green-600 font-medium">✓ Checked In</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
