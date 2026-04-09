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
    queryFn: () => api.get('/pharmacy/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Pharmacy" subtitle="Inventory and dispensing management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💊" label="Total Medicines"      value={data?.totalMedicines}      color="blue"   />
        <StatCard icon="⚠️" label="Low Stock"            value={data?.lowStockCount}        color="yellow" />
        <StatCard icon="📋" label="Pending Prescriptions" value={data?.pendingPrescriptions} color="orange" />
        <StatCard icon="✅" label="Dispensed Today"      value={data?.dispensedToday}       color="green"  />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/pharmacy/medicines')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">Manage Medicines</button>
          <button onClick={()=>navigate('/pharmacy/prescriptions')} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition">Dispense Prescriptions</button>
        </div>
      </div>
    </div>
  );
}
