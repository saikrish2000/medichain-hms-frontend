import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function NurseTasks() {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['nurse-tasks'],
    queryFn: () => api.get('/nurse/tasks').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Tasks" subtitle={`${tasks.length} pending tasks`} />
      {tasks.length===0
        ? <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No pending tasks</div>
        : <div className="space-y-3">
            {tasks.map((t,i)=>(
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{t.title||t.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.patient?.user?.firstName} {t.patient?.user?.lastName} · {t.dueTime||'—'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.priority==='HIGH'?'bg-red-100 text-red-600':t.priority==='MEDIUM'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>
                  {t.priority||'NORMAL'}
                </span>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
