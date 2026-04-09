import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export default function BillingDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['billing-dashboard'],
    queryFn: () => api.get('/billing/dashboard').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <PageHeader title="Billing & Payments" subtitle="Revenue and invoice management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💰" label="Total Revenue"      value={data?.totalRevenue ? `₹${data.totalRevenue}` : '₹0'} color="green"  />
        <StatCard icon="📋" label="Total Invoices"     value={data?.totalInvoices}      color="blue"   />
        <StatCard icon="⏳" label="Pending Payments"   value={data?.pendingInvoices}     color="yellow" />
        <StatCard icon="💵" label="Today Collection"   value={data?.todayCollection ? `₹${data.todayCollection}` : '₹0'} color="teal" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex gap-3">
          <button onClick={()=>navigate('/billing/invoices')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">View All Invoices</button>
        </div>
      </div>
    </div>
  );
}
