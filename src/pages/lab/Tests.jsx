import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LabTests() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', code:'', description:'', price:'', turnaroundHours:'', sampleType:'' });

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['lab-tests'],
    queryFn: () => api.get('/lab/tests').then(r => r.data)
  });
  const createMut = useMutation({
    mutationFn: (d) => api.post('/lab/tests', d),
    onSuccess: () => { toast.success('Test added'); qc.invalidateQueries(['lab-tests']); setShowForm(false); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Test Catalog" subtitle={`${tests.length} tests available`}
        action={<button onClick={()=>setShowForm(s=>!s)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">+ Add Test</button>}
      />
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[['name','Test Name *'],['code','Test Code'],['sampleType','Sample Type'],['price','Price (₹)'],['turnaroundHours','Turnaround (hrs)'],['description','Description']].map(([k,label])=>(
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={k==='price'||k==='turnaroundHours'?'number':'text'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={()=>createMut.mutate(form)} disabled={!form.name||createMut.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50">
              {createMut.isPending?'Adding...':'Add Test'}
            </button>
            <button onClick={()=>setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map(t=>(
          <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-400">{t.code||'—'}</p>
              </div>
              <span className="text-lg font-bold text-blue-600">₹{t.price||0}</span>
            </div>
            <p className="text-xs text-gray-500">{t.sampleType||''}{t.turnaroundHours?` · ${t.turnaroundHours}h TAT`:''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
