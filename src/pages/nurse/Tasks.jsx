import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const PRIORITY_COLOR = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};
const STATUS_COLOR = {
  PENDING: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-600',
};

export default function NurseTasks() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('PENDING');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['nurse-tasks'],
    queryFn: () => api.get('/nurse/tasks').then(r => r.data),
    staleTime: 20000,
  });

  const completeMut = useMutation({
    mutationFn: (id) => api.put(`/nurse/tasks/${id}/complete`),
    onSuccess: () => { qc.invalidateQueries(['nurse-tasks']); toast.success('Task marked complete'); },
    onError: () => toast.error('Failed to update task'),
  });

  const startMut = useMutation({
    mutationFn: (id) => api.put(`/nurse/tasks/${id}/start`),
    onSuccess: () => { qc.invalidateQueries(['nurse-tasks']); toast.success('Task started'); },
  });

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);
  const counts = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0, OVERDUE: 0 };
  tasks.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="My Tasks" subtitle={`${tasks.length} total tasks`} />

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Pending', count: counts.PENDING, color:'bg-gray-50 border-gray-200', icon:'⏳' },
          { label:'In Progress', count: counts.IN_PROGRESS, color:'bg-blue-50 border-blue-200', icon:'🔄' },
          { label:'Completed', count: counts.COMPLETED, color:'bg-green-50 border-green-200', icon:'✅' },
          { label:'Overdue', count: counts.OVERDUE, color:'bg-red-50 border-red-200', icon:'🚨' },
        ].map(({ label, count, color, icon }) => (
          <div key={label} className={`${color} border rounded-2xl p-4 text-center cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => setFilter(label.toUpperCase().replace(' ','_'))}>
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-2xl font-bold text-gray-800">{count}</p>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-5">
        {['ALL','PENDING','IN_PROGRESS','COMPLETED','OVERDUE'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {s.replace('_',' ')}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-5xl mb-3">✅</p>
            <p className="text-gray-500 font-medium">No tasks in this category</p>
          </div>
        ) : filtered.map(t => (
          <div key={t.id}
            className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
              t.status === 'OVERDUE' ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
            }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{t.taskName || t.title}</p>
                  {t.priority && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_COLOR[t.priority] || ''}`}>
                      {t.priority}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[t.status] || ''}`}>
                    {t.status?.replace('_',' ')}
                  </span>
                </div>
                {t.description && <p className="text-sm text-gray-500 mb-2">{t.description}</p>}
                <div className="flex gap-4 text-xs text-gray-400">
                  {t.patient && <span>👤 {t.patient?.user?.firstName} {t.patient?.user?.lastName}</span>}
                  {t.dueTime && <span>⏰ Due: {t.dueTime}</span>}
                  {t.ward && <span>🏥 {t.ward?.name}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {t.status === 'PENDING' && (
                  <button onClick={() => startMut.mutate(t.id)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-200 transition-colors">
                    Start
                  </button>
                )}
                {(t.status === 'PENDING' || t.status === 'IN_PROGRESS') && (
                  <button onClick={() => completeMut.mutate(t.id)}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors">
                    ✓ Done
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
