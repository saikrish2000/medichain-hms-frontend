import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import toast from 'react-hot-toast';

export default function NurseVitals() {
  const [form, setForm] = useState({ patientId:'', bloodPressure:'', temperature:'', pulseRate:'', oxygenSaturation:'', weight:'', height:'', notes:'' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const saveMut = useMutation({
    mutationFn: (d) => api.post('/nurse/vitals', d),
    onSuccess: () => { toast.success('Vitals recorded'); setForm({patientId:'',bloodPressure:'',temperature:'',pulseRate:'',oxygenSaturation:'',weight:'',height:'',notes:''}); }
  });

  return (
    <div>
      <PageHeader title="Record Vitals" subtitle="Enter patient vital measurements" />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient ID *</label>
            <input type="number" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter patient ID" value={form.patientId} onChange={e=>set('patientId',e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ['bloodPressure','Blood Pressure','e.g. 120/80'],['temperature','Temperature (°C)','e.g. 37.0'],
              ['pulseRate','Pulse Rate (bpm)','e.g. 72'],['oxygenSaturation','SpO₂ (%)','e.g. 98'],
              ['weight','Weight (kg)','e.g. 65'],['height','Height (cm)','e.g. 170'],
            ].map(([k,label,ph])=>(
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)} />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Additional observations..." value={form.notes} onChange={e=>set('notes',e.target.value)} />
          </div>
          <button onClick={()=>saveMut.mutate(form)} disabled={!form.patientId||saveMut.isPending}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
            {saveMut.isPending?'Saving...':'Record Vitals'}
          </button>
        </div>
      </div>
    </div>
  );
}
