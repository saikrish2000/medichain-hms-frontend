import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminDepartments() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', description:'' });

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/admin/departments').then(r => r.data)
  });

  const createMut = useMutation({
    mutationFn: (d) => api.post('/admin/departments', d),
    onSuccess: () => { toast.success('Department created'); qc.invalidateQueries(['departments']); setShowForm(false); setForm({name:'',description:''}); }
  });
  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/admin/departments/${id}`),
    onSuccess: () => { toast.success('Department deleted'); qc.invalidateQueries(['departments']); }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Departments" subtitle={`${departments.length} departments`}
        action={
          <button onClick={() => setShowForm(s=>!s)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            + Add Department
          </button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
          <h3 className="font-semibold text-gray-800 mb-4">New Department</h3>
          <div className="grid grid-cols-2 gap-4">
            <input className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
            <input className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => createMut.mutate(form)} disabled={!form.name || createMut.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition disabled:opacity-50">
              {createMut.isPending ? 'Saving...' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(d => (
          <div key={d.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl mb-3">🏥</div>
              <h3 className="font-semibold text-gray-800">{d.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{d.description || 'No description'}</p>
            </div>
            <button onClick={() => { if(confirm('Delete this department?')) deleteMut.mutate(d.id); }}
              className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition text-xs">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
