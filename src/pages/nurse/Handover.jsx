import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function NurseHandover() {
  const [form, setForm] = useState({ wardId:'', shift:'MORNING', notes:'' });
  const saveMut = useMutation({
    mutationFn: (d) => api.post('/nurse/handover', d),
    onSuccess: () => { toast.success('Handover report submitted'); setForm({wardId:'',shift:'MORNING',notes:''}); }
  });
  return (
    <div>
      <PageHeader title="Shift Handover" subtitle="Transfer patient care information" />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ward ID</label>
            <input type="number" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.wardId} onChange={e=>setForm(f=>({...f,wardId:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Shift</label>
            <select className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.shift} onChange={e=>setForm(f=>({...f,shift:e.target.value}))}>
              {['MORNING','EVENING','NIGHT'].map(s=><option key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()} Shift</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Handover Notes *</label>
            <textarea rows={6} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe patient status, pending tasks, critical notes..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
          </div>
          <button onClick={()=>saveMut.mutate(form)} disabled={!form.notes||saveMut.isPending}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {saveMut.isPending?'Submitting...':'Submit Handover Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
