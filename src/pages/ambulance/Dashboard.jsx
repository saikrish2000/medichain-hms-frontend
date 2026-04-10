import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const STATUS_COLOR = {
  AVAILABLE:'bg-green-100 text-green-700', ON_CALL:'bg-blue-100 text-blue-700',
  MAINTENANCE:'bg-yellow-100 text-yellow-700', OUT_OF_SERVICE:'bg-red-100 text-red-600',
};
const CALL_COLOR = {
  PENDING:'bg-yellow-100 text-yellow-700', DISPATCHED:'bg-blue-100 text-blue-700',
  COMPLETED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-600',
};

export default function AmbulanceDashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['ambulance-dashboard'],
    queryFn: () => api.get('/ambulance/dashboard').then(r => r.data),
    staleTime: 15000,
  });
  const { data: activeCalls = [] } = useQuery({
    queryKey: ['ambulance-active-calls'],
    queryFn: () => api.get('/ambulance/calls?status=DISPATCHED&size=5').then(r => r.data?.content || r.data || []),
    staleTime: 10000,
    refetchInterval: 15000,
  });
  const { data: fleet = [] } = useQuery({
    queryKey: ['ambulance-fleet-summary'],
    queryFn: () => api.get('/ambulance/fleet').then(r => r.data),
    staleTime: 30000,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Ambulance Control" subtitle="Real-time fleet and emergency dispatch" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🚑" label="Total Fleet"       value={data?.totalAmbulances}      color="blue"   />
        <StatCard icon="✅" label="Available"          value={data?.availableAmbulances}  color="green"  />
        <StatCard icon="🔴" label="Active Calls"       value={data?.activeCalls}          color="red"    />
        <StatCard icon="📊" label="Calls Today"        value={data?.callsToday}           color="orange" />
      </div>

      {/* Emergency Dispatch Button */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-5 mb-6 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-lg">🚨 Emergency Dispatch</p>
          <p className="text-red-100 text-sm">Dispatch an ambulance immediately</p>
        </div>
        <button onClick={() => navigate('/ambulance/dispatch')}
          className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-md">
          Dispatch Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active Calls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">🔴 Active Calls</h2>
            <button onClick={() => navigate('/ambulance/calls')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium">All calls →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {activeCalls.length === 0 ? (
              <div className="p-8 text-center text-green-500">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm font-medium">No active emergencies</p>
              </div>
            ) : activeCalls.map(c => (
              <div key={c.id} className="px-5 py-3.5 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{c.patientName || c.callerName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CALL_COLOR[c.status] || ''}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{c.pickupAddress}</p>
                {c.assignedAmbulance && (
                  <p className="text-xs text-blue-500 mt-0.5">🚑 {c.assignedAmbulance.vehicleNumber}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">🚑 Fleet Status</h2>
            <button onClick={() => navigate('/ambulance/fleet')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium">Manage →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {fleet.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No fleet data</div>
            ) : fleet.slice(0, 6).map(a => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <span className="text-2xl">🚑</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{a.vehicleNumber}</p>
                  <p className="text-xs text-gray-400">{a.driverName || 'Unassigned'}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[a.status] || 'bg-gray-100 text-gray-600'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
