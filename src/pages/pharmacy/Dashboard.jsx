import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function PharmacyDashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['pharmacy-dashboard'],
    queryFn: () => api.get('/pharmacy/dashboard').then(r => r.data),
    staleTime: 30000,
  });
  const { data: lowStock = [] } = useQuery({
    queryKey: ['pharmacy-lowstock'],
    queryFn: () => api.get('/pharmacy/medicines/low-stock').then(r => r.data),
    staleTime: 30000,
  });
  const { data: pending = [] } = useQuery({
    queryKey: ['pharmacy-pending-rx'],
    queryFn: () => api.get('/pharmacy/prescriptions/pending').then(r => r.data),
    staleTime: 20000,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Pharmacy" subtitle="Inventory and dispensing management" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💊" label="Total Medicines"       value={data?.totalMedicines}       color="blue"   />
        <StatCard icon="⚠️" label="Low Stock Alerts"      value={data?.lowStockCount}         color="yellow" />
        <StatCard icon="📋" label="Pending Prescriptions" value={data?.pendingPrescriptions}  color="orange" />
        <StatCard icon="✅" label="Dispensed Today"       value={data?.dispensedToday}        color="green"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">⚠️ Low Stock Alerts</h2>
            <button onClick={() => navigate('/pharmacy/medicines')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium">Manage →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStock.length === 0 ? (
              <div className="p-8 text-center text-green-500">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm font-medium">All medicines well stocked</p>
              </div>
            ) : lowStock.slice(0, 6).map(m => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.category} · {m.manufacturer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{m.stockQuantity ?? m.currentStock} left</p>
                  <p className="text-xs text-gray-400">Min: {m.minimumStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Prescriptions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">📋 Pending Prescriptions</h2>
            <button onClick={() => navigate('/pharmacy/prescriptions')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {pending.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-sm">No pending prescriptions</p>
              </div>
            ) : pending.slice(0, 6).map(rx => (
              <div key={rx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">
                  {rx.patient?.user?.firstName?.[0] || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {rx.patient?.user?.firstName} {rx.patient?.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Dr. {rx.doctor?.user?.firstName} · {rx.prescriptionDate || rx.createdAt?.split('T')[0]}
                  </p>
                </div>
                <button onClick={() => navigate('/pharmacy/prescriptions')}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700">
                  Dispense
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
