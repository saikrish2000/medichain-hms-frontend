import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function LabDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['lab-dashboard'],
    queryFn: () => api.get('/lab/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Laboratory" subtitle="Diagnostics and test management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Total Orders"      value={data?.totalOrders}      color="blue"   />
        <StatCard icon="⏳" label="Pending"           value={data?.pendingOrders}    color="yellow" />
        <StatCard icon="🔬" label="Processing"        value={data?.processingOrders} color="purple" />
        <StatCard icon="✅" label="Completed Today"   value={data?.completedToday}   color="green"  />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/lab/orders')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Manage Orders</button>
          <button onClick={()=>navigate('/lab/tests')} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700">Test Catalog</button>
        </div>
      </div>
    </div>
  );
}
