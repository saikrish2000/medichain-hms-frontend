import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function DoctorPrescriptions() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [apptId, setApptId] = useState('');
  const [items, setItems] = useState([{ medicineName:'', dosage:'', frequency:'', duration:'', instructions:'' }]);

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['doctor-prescriptions'],
    queryFn: () => api.get('/doctor/prescriptions').then(r => r.data)
  });

  const createMut = useMutation({
    mutationFn: (d) => api.post('/doctor/prescriptions', d),
    onSuccess: () => { toast.success('Prescription created'); qc.invalidateQueries(['doctor-prescriptions']); setShowForm(false); setApptId(''); setItems([{medicineName:'',dosage:'',frequency:'',duration:'',instructions:''}]); }
  });

  const addItem = () => setItems(i=>[...i,{medicineName:'',dosage:'',frequency:'',duration:'',instructions:''}]);
  const removeItem = (idx) => setItems(i=>i.filter((_,j)=>j!==idx));
  const updateItem = (idx,k,v) => setItems(i=>i.map((x,j)=>j===idx?{...x,[k]:v}:x));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Prescriptions" subtitle={`${prescriptions.length} total`}
        action={<button onClick={()=>setShowForm(s=>!s)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">+ New Prescription</button>}
      />

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">New Prescription</h3>
          <input className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Appointment ID *" value={apptId} onChange={e=>setApptId(e.target.value)} type="number" />
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-3 p-3 bg-gray-50 rounded-xl">
                <input className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Medicine *" value={item.medicineName} onChange={e=>updateItem(idx,'medicineName',e.target.value)} />
                <input className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dosage" value={item.dosage} onChange={e=>updateItem(idx,'dosage',e.target.value)} />
                <input className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Frequency" value={item.frequency} onChange={e=>updateItem(idx,'frequency',e.target.value)} />
                <input className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Duration" value={item.duration} onChange={e=>updateItem(idx,'duration',e.target.value)} />
                <button onClick={()=>removeItem(idx)} className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addItem} className="px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">+ Add Medicine</button>
            <button onClick={()=>createMut.mutate({appointmentId:Number(apptId),items})} disabled={!apptId||createMut.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50">
              {createMut.isPending?'Saving...':'Save Prescription'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Patient','Date','Items','Status'].map(h=><th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {prescriptions.length===0
              ? <tr><td colSpan={4} className="text-center py-10 text-gray-400">No prescriptions</td></tr>
              : prescriptions.map(p=>(
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.appointment?.patient?.user?.firstName} {p.appointment?.patient?.user?.lastName}</td>
                <td className="px-4 py-3 text-gray-600">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-gray-600">{p.items?.length || 0} medicines</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                    ${p.status==='DISPENSED'?'bg-green-100 text-green-700':p.status==='PENDING'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
