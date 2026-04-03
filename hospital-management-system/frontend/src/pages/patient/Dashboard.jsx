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
};

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['patient-dashboard'],
    queryFn: () => api.get('/patient/dashboard').then(r => r.data)
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title={`Hello, ${user?.firstName || user?.username}!`} subtitle="Your health summary" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📅" label="Appointments"      value={data?.totalAppointments} color="blue"   />
        <StatCard icon="💊" label="Prescriptions"      value={data?.prescriptions}     color="purple" />
        <StatCard icon="🔬" label="Lab Orders"         value={data?.labOrders}         color="orange" />
        <StatCard icon="💰" label="Pending Bills"      value={data?.pendingBills ? `₹${data.pendingBills}` : '₹0'} color="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
            <button onClick={()=>navigate('/patient/appointments')} className="text-xs text-blue-600 hover:underline">View all</button>
          </div>
          {data?.upcomingAppointments?.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingAppointments.slice(0,4).map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Dr. {a.doctor?.user?.firstName} {a.doctor?.user?.lastName}</p>
                    <p className="text-xs text-gray-500">{a.slot?.date} · {a.slot?.startTime?.slice(0,5)}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status]||'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-3">No upcoming appointments</p>
              <button onClick={()=>navigate('/appointments/book')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">Book Now</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Book Appointment', path:'/appointments/book',    color:'bg-blue-600',   icon:'📅' },
              { label:'My Records',       path:'/patient/records',      color:'bg-purple-600', icon:'📋' },
              { label:'My Vitals',        path:'/patient/vitals',       color:'bg-green-600',  icon:'❤️' },
              { label:'My Bills',         path:'/billing/my-bills',     color:'bg-yellow-600', icon:'💰' },
            ].map(({label,path,color,icon})=>(
              <button key={path} onClick={()=>navigate(path)}
                className={`${color} text-white p-3 rounded-xl text-sm font-medium hover:opacity-90 transition flex items-center gap-2`}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>

          {data?.latestVitals && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 mb-2">Latest Vitals</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p className="text-gray-400">BP</p><p className="font-semibold">{data.latestVitals.bloodPressure||'—'}</p></div>
                <div><p className="text-gray-400">Temp</p><p className="font-semibold">{data.latestVitals.temperature ? `${data.latestVitals.temperature}°` : '—'}</p></div>
                <div><p className="text-gray-400">Pulse</p><p className="font-semibold">{data.latestVitals.pulseRate ? `${data.latestVitals.pulseRate} bpm` : '—'}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
