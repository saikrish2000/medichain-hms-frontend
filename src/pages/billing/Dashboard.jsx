import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const STATUS_COLOR = {
  PAID:'bg-green-100 text-green-700', PENDING:'bg-yellow-100 text-yellow-700',
  PARTIAL:'bg-blue-100 text-blue-700', CANCELLED:'bg-red-100 text-red-600',
};

export default function BillingDashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['billing-dashboard'],
    queryFn: () => api.get('/billing/dashboard').then(r => r.data),
    staleTime: 30000,
  });
  const { data: recent = [], isLoading: recLoading } = useQuery({
    queryKey: ['billing-recent'],
    queryFn: () => api.get('/billing/invoices?page=0&size=8').then(r => r.data?.content || r.data || []),
    staleTime: 30000,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Billing & Payments" subtitle="Revenue and invoice management" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💰" label="Total Revenue"    value={data?.totalRevenue ? `₹${Number(data.totalRevenue).toLocaleString('en-IN')}` : '₹0'} color="green"  />
        <StatCard icon="📋" label="Total Invoices"   value={data?.totalInvoices}     color="blue"   />
        <StatCard icon="⏳" label="Pending Payments" value={data?.pendingInvoices}   color="yellow" />
        <StatCard icon="💵" label="Today Collection" value={data?.todayCollection ? `₹${Number(data.todayCollection).toLocaleString('en-IN')}` : '₹0'} color="teal" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => navigate('/billing/invoices')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          📋 All Invoices
        </button>
        <button onClick={() => navigate('/billing/invoices?filter=PENDING')}
          className="px-5 py-2.5 bg-yellow-500 text-white rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors">
          ⏳ Pending Payments
        </button>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Invoices</h2>
          <button onClick={() => navigate('/billing/invoices')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all →</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recLoading ? (
            <div className="p-8 text-center text-gray-400">Loading…</div>
          ) : recent.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No invoices yet</div>
          ) : recent.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {inv.patient?.user?.firstName} {inv.patient?.user?.lastName}
                </p>
                <p className="text-xs text-gray-400">{inv.invoiceNumber} · {inv.invoiceDate}</p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                ₹{Number(inv.totalAmount || 0).toLocaleString('en-IN')}
              </p>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
