import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['receptionist-dashboard'],
    queryFn: () => api.get('/receptionist/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Reception Desk" subtitle="Patient check-in and appointment management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📅" label="Today's Appointments" value={data?.todayAppointments}  color="blue"   />
        <StatCard icon="✅" label="Checked In"           value={data?.checkedIn}           color="green"  />
        <StatCard icon="⏳" label="Waiting"              value={data?.waiting}             color="yellow" />
        <StatCard icon="👥" label="New Patients Today"   value={data?.newPatientsToday}    color="purple" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/receptionist/appointments')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Manage Appointments</button>
          <button onClick={()=>navigate('/billing/dashboard')} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">Billing</button>
        </div>
      </div>
    </div>
  );
}
