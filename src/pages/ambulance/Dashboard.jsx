import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function AmbulanceDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['ambulance-dashboard'],
    queryFn: () => api.get('/ambulance/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Ambulance Control" subtitle="Fleet and emergency dispatch management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🚑" label="Total Fleet"      value={data?.totalAmbulances}   color="blue"   />
        <StatCard icon="✅" label="Available"         value={data?.availableAmbulances} color="green" />
        <StatCard icon="🔴" label="Active Calls"      value={data?.activeCalls}        color="red"   />
        <StatCard icon="📊" label="Total Calls Today" value={data?.callsToday}          color="orange"/>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/ambulance/dispatch')} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">🚨 Dispatch Ambulance</button>
          <button onClick={()=>navigate('/ambulance/calls')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">View All Calls</button>
          <button onClick={()=>navigate('/ambulance/fleet')} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">Manage Fleet</button>
        </div>
      </div>
    </div>
  );
}
