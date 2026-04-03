import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function BloodBankDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['blood-bank-dashboard'],
    queryFn: () => api.get('/blood-bank/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Blood Bank" subtitle="Inventory and donation management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🩸" label="Total Units"          value={data?.totalUnits}          color="red"    />
        <StatCard icon="⚠️" label="Critical Stock"       value={data?.criticalStockCount}   color="orange" />
        <StatCard icon="📋" label="Pending Requests"     value={data?.pendingRequests}      color="yellow" />
        <StatCard icon="❤️" label="Donations This Month" value={data?.donationsThisMonth}   color="pink"   />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {['A_POSITIVE','A_NEGATIVE','B_POSITIVE','B_NEGATIVE','AB_POSITIVE','AB_NEGATIVE','O_POSITIVE','O_NEGATIVE'].map(bg => {
          const inv = data?.inventory?.find(i=>i.bloodGroup===bg);
          return (
            <div key={bg} className={`bg-white rounded-2xl p-4 shadow-sm border ${inv?.isBelowThreshold?'border-red-200':'border-gray-100'} flex items-center justify-between`}>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${inv?.isBelowThreshold?'bg-red-100 text-red-700':'bg-red-50 text-red-600'}`}>
                  {bg.replace('_POSITIVE','+').replace('_NEGATIVE','-')}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{inv?.unitsAvailable ?? 0}</p>
                <p className="text-xs text-gray-400">units</p>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={()=>navigate('/blood-bank/inventory')} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Manage Inventory</button>
    </div>
  );
}
