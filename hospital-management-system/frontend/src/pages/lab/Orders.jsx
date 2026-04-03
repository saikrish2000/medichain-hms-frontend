import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { ORDERED:'bg-yellow-100 text-yellow-700',SAMPLE_COLLECTED:'bg-blue-100 text-blue-700',PROCESSING:'bg-purple-100 text-purple-700',COMPLETED:'bg-green-100 text-green-700',CANCELLED:'bg-red-100 text-red-600' };

export default function LabOrders() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ['lab-orders', page],
    queryFn: () => api.get(`/lab/orders?page=${page}`).then(r => r.data)
  });
  const collectMut = useMutation({
    mutationFn: (id) => api.post(`/lab/orders/${id}/collect`),
    onSuccess: () => { toast.success('Sample collected'); qc.invalidateQueries(['lab-orders']); }
  });
  const completeMut = useMutation({
    mutationFn: ({id,notes}) => api.post(`/lab/orders/${id}/complete`, {notes}),
    onSuccess: () => { toast.success('Results entered'); qc.invalidateQueries(['lab-orders']); }
  });

  const orders = data?.content || data || [];
  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Lab Orders" subtitle={`${data?.totalElements ?? orders.length} total`} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Patient','Tests','Doctor','Date','Status','Actions'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length===0
              ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">No orders</td></tr>
              : orders.map(o=>(
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.patient?.user?.firstName} {o.patient?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{o.tests?.map(t=>t.name).join(', ')||'—'}</td>
                <td className="px-4 py-3 text-gray-600">Dr. {o.doctor?.user?.firstName} {o.doctor?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{o.createdAt?.split('T')[0]||'—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {o.status==='ORDERED' && <button onClick={()=>collectMut.mutate(o.id)} className="px-2 py-1 bg-blue-500 text-white rounded-lg text-xs">Collect</button>}
                    {(o.status==='SAMPLE_COLLECTED'||o.status==='PROCESSING') &&
                      <button onClick={()=>completeMut.mutate({id:o.id,notes:'Results ready'})} className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs">Complete</button>}
                  </div>
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
