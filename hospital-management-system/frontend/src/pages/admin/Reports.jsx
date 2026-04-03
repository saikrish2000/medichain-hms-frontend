import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function AdminReports() {
  const today = new Date().toISOString().split('T')[0];
  const [from, setFrom] = useState(new Date(Date.now()-30*86400000).toISOString().split('T')[0]);
  const [to, setTo] = useState(today);
  const [fetchRange, setFetchRange] = useState({from, to});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reports', fetchRange],
    queryFn: () => api.get(`/admin/reports?from=${fetchRange.from}&to=${fetchRange.to}`).then(r => r.data)
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Analytics and operational insights" />
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
          <input type="date" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={from} onChange={e=>setFrom(e.target.value)} max={to} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
          <input type="date" className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={to} onChange={e=>setTo(e.target.value)} min={from} max={today} />
        </div>
        <button onClick={() => setFetchRange({from, to})}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📅" label="Total Appointments" value={data?.totalAppointments}  color="blue"   />
        <StatCard icon="✅" label="Completed"          value={data?.completedAppts}      color="green"  />
        <StatCard icon="❌" label="Cancelled"          value={data?.cancelledAppts}      color="red"    />
        <StatCard icon="💰" label="Revenue (₹)"        value={data?.totalRevenue}        color="teal"   />
        <StatCard icon="👤" label="New Patients"        value={data?.newPatients}         color="purple" />
        <StatCard icon="👨‍⚕️" label="Active Doctors"   value={data?.activeDoctors}       color="orange" />
        <StatCard icon="🧪" label="Lab Orders"          value={data?.labOrders}           color="yellow" />
        <StatCard icon="💊" label="Prescriptions"       value={data?.prescriptions}       color="pink"   />
      </div>
    </div>
  );
}
