import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const STATUS_COLOR = {
  PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700',
  COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600',
  NO_SHOW:'bg-gray-100 text-gray-600', IN_PROGRESS:'bg-purple-100 text-purple-700',
};

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-dashboard'],
    queryFn: () => api.get('/doctor/dashboard').then(r => r.data)
  });
  const { data: today = [] } = useQuery({
    queryKey: ['doctor-today-appts'],
    queryFn: () => api.get('/doctor/appointments/today').then(r => r.data)
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={`Good morning, Dr. ${user?.lastName || user?.username}!`} subtitle="Your schedule and activity overview" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📅" label="Today's Appointments" value={data?.todayAppointments}  color="blue"   />
        <StatCard icon="👥" label="Total Patients"       value={data?.totalPatients}       color="green"  />
        <StatCard icon="💊" label="Prescriptions"        value={data?.prescriptionsWritten} color="purple" />
        <StatCard icon="🔬" label="Lab Orders"           value={data?.labOrdersCreated}    color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
            <button onClick={() => navigate('/doctor/appointments')} className="text-xs text-blue-600 hover:underline">View all</button>
          </div>
          {today.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">No appointments today</p>
            : <div className="space-y-3">
                {today.slice(0,6).map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">{a.patient?.user?.firstName} {a.patient?.user?.lastName}</p>
                      <p className="text-xs text-gray-500">{a.slot?.startTime ? new Date('1970-01-01T'+a.slot.startTime).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '—'}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status] || 'bg-gray-100 text-gray-600'}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
          }
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {label:'Manage Slots',     path:'/doctor/slots',         color:'bg-blue-600',   icon:'🕐'},
              {label:'Appointments',     path:'/doctor/appointments',  color:'bg-green-600',  icon:'📅'},
              {label:'Patients',         path:'/doctor/patients',      color:'bg-purple-600', icon:'👥'},
              {label:'Prescriptions',    path:'/doctor/prescriptions', color:'bg-yellow-600', icon:'💊'},
              {label:'Lab Orders',       path:'/doctor/lab-orders',    color:'bg-orange-600', icon:'🔬'},
            ].map(({label,path,color,icon}) => (
              <button key={path} onClick={() => navigate(path)}
                className={`${color} text-white p-3 rounded-xl text-sm font-medium hover:opacity-90 transition text-left flex items-center gap-2`}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
