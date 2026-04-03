import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function AmbulanceDispatch() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ callerName:'', callerPhone:'', pickupAddress:'', emergencyType:'MEDICAL', priorityLevel:'HIGH', notes:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const dispatchMut = useMutation({
    mutationFn: (d) => api.post('/ambulance/calls', d),
    onSuccess: () => { toast.success('Ambulance dispatched!'); setForm({callerName:'',callerPhone:'',pickupAddress:'',emergencyType:'MEDICAL',priorityLevel:'HIGH',notes:''}); qc.invalidateQueries(['ambulance-calls']); }
  });

  return (
    <div>
      <PageHeader title="Dispatch Ambulance" subtitle="Create emergency call and assign vehicle" />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-2xl">
        <div className="grid grid-cols-2 gap-5">
          {[['callerName','Caller Name'],['callerPhone','Caller Phone'],['pickupAddress','Pickup Address']].map(([k,label])=>(
            <div key={k} className={k==='pickupAddress'?'col-span-2':''}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} *</label>
              <input className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form[k]} onChange={e=>set(k,e.target.value)} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Type</label>
            <select className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.emergencyType} onChange={e=>set('emergencyType',e.target.value)}>
              {['MEDICAL','TRAUMA','CARDIAC','OBSTETRIC','PEDIATRIC','PSYCHIATRIC','ACCIDENT'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <select className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.priorityLevel} onChange={e=>set('priorityLevel',e.target.value)}>
              {['LOW','MEDIUM','HIGH','CRITICAL'].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Any additional details..." />
          </div>
        </div>
        <button onClick={()=>dispatchMut.mutate(form)} disabled={!form.callerPhone||!form.pickupAddress||dispatchMut.isPending}
          className="mt-5 w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50 text-lg">
          🚨 {dispatchMut.isPending?'Dispatching...':'Dispatch Now'}
        </button>
      </div>
    </div>
  );
}
