import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function DoctorSlots() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('existing');
  const [form, setForm] = useState({ date:'', startTime:'', endTime:'', durationMinutes:20, maxPatients:1 });
  const [recurForm, setRecurForm] = useState({ dayOfWeek:'MONDAY', startTime:'09:00', endTime:'13:00', durationMinutes:20, maxPatients:1, weeksAhead:4 });

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['doctor-slots'],
    queryFn: () => api.get('/doctor/slots').then(r => r.data)
  });

  const createSlot = useMutation({
    mutationFn: (d) => api.post('/doctor/slots', d),
    onSuccess: () => { toast.success('Slot created'); qc.invalidateQueries(['doctor-slots']); }
  });
  const createRecurring = useMutation({
    mutationFn: (d) => api.post('/doctor/slots/recurring', d),
    onSuccess: () => { toast.success('Recurring slots created'); qc.invalidateQueries(['doctor-slots']); }
  });
  const blockSlot = useMutation({
    mutationFn: (id) => api.post(`/doctor/slots/${id}/block`),
    onSuccess: () => { toast.success('Slot blocked'); qc.invalidateQueries(['doctor-slots']); }
  });
  const unblockSlot = useMutation({
    mutationFn: (id) => api.post(`/doctor/slots/${id}/unblock`),
    onSuccess: () => { toast.success('Slot unblocked'); qc.invalidateQueries(['doctor-slots']); }
  });
  const deleteSlot = useMutation({
    mutationFn: (id) => api.delete(`/doctor/slots/${id}`),
    onSuccess: () => { toast.success('Slot deleted'); qc.invalidateQueries(['doctor-slots']); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Manage Slots" subtitle="Control your availability" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['existing','My Slots'],['new','New Slot'],['recurring','Recurring Slots']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${tab===key ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'existing' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Date','Start','End','Duration','Max Pts','Booked','Status','Actions'].map(h=>(
                  <th key={h} className="px-3 py-3 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {slots.length===0
                ? <tr><td colSpan={8} className="text-center py-10 text-gray-400">No slots yet</td></tr>
                : slots.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">{s.date}</td>
                  <td className="px-3 py-3">{s.startTime?.slice(0,5)}</td>
                  <td className="px-3 py-3">{s.endTime?.slice(0,5)}</td>
                  <td className="px-3 py-3">{s.durationMinutes}m</td>
                  <td className="px-3 py-3">{s.maxPatients}</td>
                  <td className="px-3 py-3">{s.bookedCount || 0}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${s.blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {s.blocked ? 'Blocked' : 'Open'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {s.blocked
                        ? <button onClick={() => unblockSlot.mutate(s.id)} className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600">Unblock</button>
                        : <button onClick={() => blockSlot.mutate(s.id)}   className="px-2 py-1 bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600">Block</button>
                      }
                      <button onClick={() => { if(confirm('Delete this slot?')) deleteSlot.mutate(s.id); }}
                        className="px-2 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'new' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg">
          <h3 className="font-semibold text-gray-800 mb-5">Create Single Slot</h3>
          <div className="space-y-4">
            {[
              ['date','Date','date'],['startTime','Start Time','time'],['endTime','End Time','time'],
            ].map(([k,label,type]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} required />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input type="number" min={5} max={120} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.durationMinutes} onChange={e=>setForm(f=>({...f,durationMinutes:+e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients</label>
                <input type="number" min={1} max={20} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.maxPatients} onChange={e=>setForm(f=>({...f,maxPatients:+e.target.value}))} />
              </div>
            </div>
            <button onClick={() => createSlot.mutate(form)} disabled={!form.date||!form.startTime||!form.endTime||createSlot.isPending}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {createSlot.isPending ? 'Creating...' : 'Create Slot'}
            </button>
          </div>
        </div>
      )}

      {tab === 'recurring' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-lg">
          <h3 className="font-semibold text-gray-800 mb-5">Create Recurring Weekly Slots</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={recurForm.dayOfWeek} onChange={e=>setRecurForm(f=>({...f,dayOfWeek:e.target.value}))}>
                {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(d=>(
                  <option key={d} value={d}>{d.charAt(0)+d.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="time" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={recurForm.startTime} onChange={e=>setRecurForm(f=>({...f,startTime:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="time" className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={recurForm.endTime} onChange={e=>setRecurForm(f=>({...f,endTime:e.target.value}))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input type="number" min={5} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={recurForm.durationMinutes} onChange={e=>setRecurForm(f=>({...f,durationMinutes:+e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients</label>
                <input type="number" min={1} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={recurForm.maxPatients} onChange={e=>setRecurForm(f=>({...f,maxPatients:+e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weeks Ahead</label>
                <input type="number" min={1} max={12} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={recurForm.weeksAhead} onChange={e=>setRecurForm(f=>({...f,weeksAhead:+e.target.value}))} />
              </div>
            </div>
            <button onClick={() => createRecurring.mutate(recurForm)} disabled={createRecurring.isPending}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50">
              {createRecurring.isPending ? 'Creating...' : 'Create Recurring Slots'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
