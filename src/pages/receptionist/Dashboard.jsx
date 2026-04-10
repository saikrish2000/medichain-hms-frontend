import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const STATUS_COLOR = {
  PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700',
  COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600',
  IN_PROGRESS:'bg-purple-100 text-purple-700',
};

export default function ReceptionistDashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['receptionist-dashboard'],
    queryFn: () => api.get('/receptionist/dashboard').then(r => r.data),
    staleTime: 30000,
  });
  const { data: todayAppts = [], isLoading: apptLoading } = useQuery({
    queryKey: ['receptionist-today'],
    queryFn: () => api.get('/receptionist/appointments/today').then(r => r.data),
    staleTime: 30000,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Reception Desk" subtitle="Patient check-in and appointment management" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📅" label="Today's Appointments" value={data?.todayAppointments}  color="blue"   />
        <StatCard icon="✅" label="Checked In"           value={data?.checkedIn}           color="green"  />
        <StatCard icon="⏳" label="Waiting"              value={data?.waiting}             color="yellow" />
        <StatCard icon="🆕" label="New Patients Today"   value={data?.newPatientsToday}    color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Book Appointment', icon:'📅', color:'bg-blue-600 hover:bg-blue-700', route:'/receptionist/appointments' },
          { label:'Manage Patients',  icon:'👥', color:'bg-green-600 hover:bg-green-700', route:'/admin/patients' },
          { label:'Billing',          icon:'💰', color:'bg-purple-600 hover:bg-purple-700', route:'/billing/dashboard' },
          { label:'Today\'s Schedule', icon:'📋', color:'bg-orange-500 hover:bg-orange-600', route:'/receptionist/appointments' },
        ].map(({ label, icon, color, route }) => (
          <button key={label} onClick={() => navigate(route)}
            className={`${color} text-white rounded-2xl p-4 text-left transition-colors shadow-sm`}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="font-semibold text-sm">{label}</p>
          </button>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Today's Schedule</h2>
          <button onClick={() => navigate('/receptionist/appointments')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all →
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {apptLoading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : todayAppts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No appointments scheduled for today</div>
          ) : todayAppts.slice(0, 8).map(a => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                {a.patient?.user?.firstName?.[0] || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {a.patient?.user?.firstName} {a.patient?.user?.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  Dr. {a.doctor?.user?.firstName} {a.doctor?.user?.lastName}
                  {a.appointmentTime && ` · ${a.appointmentTime}`}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status] || 'bg-gray-100 text-gray-600'}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
