import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-700',PAID:'bg-green-100 text-green-700',PARTIAL:'bg-blue-100 text-blue-700',CANCELLED:'bg-red-100 text-red-600' };

export default function MyBills() {
  const { data: bills = [], isLoading } = useQuery({
    queryKey: ['my-bills'],
    queryFn: () => api.get('/billing/my-bills').then(r => r.data)
  });
  if (isLoading) return <LoadingSpinner />;
  const total = bills.reduce((s,b)=>s+(b.totalAmount||0),0);
  const pending = bills.filter(b=>b.status==='PENDING').reduce((s,b)=>s+((b.totalAmount||0)-(b.amountPaid||0)),0);

  return (
    <div>
      <PageHeader title="My Bills" subtitle="Your payment history" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Bills</p>
          <p className="text-2xl font-bold text-gray-800">{bills.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">₹{total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-bold text-red-500">₹{pending}</p>
        </div>
      </div>
      <div className="space-y-3">
        {bills.length===0
          ? <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 text-gray-400">No bills yet</div>
          : bills.map(b=>(
          <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{b.description||'Hospital Invoice'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{b.createdAt?.split('T')[0]||'—'} · {b.paymentMethod||'—'}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">₹{b.totalAmount||0}</p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[b.status]||'bg-gray-100 text-gray-600'}`}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
