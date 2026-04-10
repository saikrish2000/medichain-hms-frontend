import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const STATUS_COLOR = {
  PENDING:'bg-yellow-100 text-yellow-700', PROCESSING:'bg-blue-100 text-blue-700',
  COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600',
};

export default function LabDashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['lab-dashboard'],
    queryFn: () => api.get('/lab/dashboard').then(r => r.data),
    staleTime: 30000,
  });
  const { data: orders = [], isLoading: ordLoading } = useQuery({
    queryKey: ['lab-orders-recent'],
    queryFn: () => api.get('/lab/orders?page=0&size=6').then(r => r.data?.content || r.data || []),
    staleTime: 20000,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Laboratory" subtitle="Diagnostics and test management" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Total Orders"     value={data?.totalOrders}       color="blue"   />
        <StatCard icon="⏳" label="Pending"          value={data?.pendingOrders}     color="yellow" />
        <StatCard icon="🔬" label="Processing"       value={data?.processingOrders}  color="purple" />
        <StatCard icon="✅" label="Completed Today"  value={data?.completedToday}    color="green"  />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => navigate('/lab/orders')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          📋 Manage Orders
        </button>
        <button onClick={() => navigate('/lab/tests')}
          className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          🔬 Test Catalog
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <button onClick={() => navigate('/lab/orders')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all →</button>
        </div>
        <div className="divide-y divide-gray-50">
          {ordLoading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-3xl mb-2">🔬</p>
              <p className="text-sm">No lab orders yet</p>
            </div>
          ) : orders.map(o => (
            <div key={o.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 text-sm">🧪</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {o.patient?.user?.firstName} {o.patient?.user?.lastName}
                </p>
                <p className="text-xs text-gray-400">
                  {o.testName || o.labTest?.name} · {o.orderDate || o.createdAt?.split('T')[0]}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
