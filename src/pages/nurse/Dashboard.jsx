import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function NurseDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['nurse-dashboard'],
    queryFn: () => api.get('/nurse/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title={`Nurse Station — ${user?.firstName||user?.username}`} subtitle="Patient care overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Assigned Patients" value={data?.assignedPatients}  color="blue"   />
        <StatCard icon="✅" label="Pending Tasks"     value={data?.pendingTasks}      color="yellow" />
        <StatCard icon="💊" label="Pending Meds"      value={data?.pendingMedications} color="purple" />
        <StatCard icon="❤️" label="Vitals Today"      value={data?.vitalsRecorded}    color="green"  />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {label:'My Patients',  path:'/nurse/patients', color:'bg-blue-600',   icon:'👥'},
            {label:'Tasks',        path:'/nurse/tasks',    color:'bg-yellow-600', icon:'✅'},
            {label:'Record Vitals',path:'/nurse/vitals',   color:'bg-green-600',  icon:'❤️'},
            {label:'eMAR',         path:'/nurse/emar',     color:'bg-purple-600', icon:'💊'},
            {label:'Handover',     path:'/nurse/handover', color:'bg-teal-600',   icon:'🔄'},
          ].map(({label,path,color,icon})=>(
            <button key={path} onClick={()=>navigate(path)}
              className={`${color} text-white p-4 rounded-xl text-sm font-medium hover:opacity-90 transition flex items-center gap-2`}>
              <span className="text-lg">{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
