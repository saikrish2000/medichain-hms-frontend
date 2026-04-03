import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { ORDERED:'bg-yellow-100 text-yellow-700', SAMPLE_COLLECTED:'bg-blue-100 text-blue-700', PROCESSING:'bg-purple-100 text-purple-700', COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600' };

export default function DoctorLabOrders() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId:'', testIds:[], clinicalNotes:'' });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['doctor-lab-orders'],
    queryFn: () => api.get('/doctor/lab-orders').then(r => r.data)
  });
  const { data: tests = [] } = useQuery({
    queryKey: ['lab-tests'],
    queryFn: () => api.get('/lab/tests').then(r => r.data)
  });

  const createMut = useMutation({
    mutationFn: (d) => api.post('/doctor/lab-orders', d),
    onSuccess: () => { toast.success('Lab order created'); qc.invalidateQueries(['doctor-lab-orders']); setShowForm(false); setForm({patientId:'',testIds:[],clinicalNotes:''}); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Lab Orders" subtitle={`${orders.length} total orders`}
        action={<button onClick={()=>setShowForm(s=>!s)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">+ New Order</button>}
      />

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 max-w-lg">
          <h3 className="font-semibold text-gray-800 mb-4">New Lab Order</h3>
          <div className="space-y-4">
            <input className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Patient ID *" type="number" value={form.patientId} onChange={e=>setForm(f=>({...f,patientId:e.target.value}))} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Tests *</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tests.map(t => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.testIds.includes(t.id)}
                      onChange={e => setForm(f=>({...f, testIds: e.target.checked ? [...f.testIds,t.id] : f.testIds.filter(x=>x!==t.id)}))} />
                    <span className="text-sm text-gray-700">{t.name} — ₹{t.price}</span>
                  </label>
                ))}
              </div>
            </div>
            <textarea className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Clinical notes..." rows={2} value={form.clinicalNotes} onChange={e=>setForm(f=>({...f,clinicalNotes:e.target.value}))} />
            <button onClick={()=>createMut.mutate(form)} disabled={!form.patientId||form.testIds.length===0||createMut.isPending}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {createMut.isPending?'Creating...':'Create Order'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Patient','Tests','Date','Status','Notes'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length===0
              ? <tr><td colSpan={5} className="text-center py-10 text-gray-400">No lab orders</td></tr>
              : orders.map(o=>(
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.patient?.user?.firstName} {o.patient?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{o.tests?.map(t=>t.name).join(', ') || '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{o.createdAt?new Date(o.createdAt).toLocaleDateString():'—'}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{o.clinicalNotes||'—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
