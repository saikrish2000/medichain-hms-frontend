import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PageHeader from '../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data)
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Hospital overview and management" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👨‍⚕️" label="Total Doctors"         value={data?.totalDoctors}          color="blue"   />
        <StatCard icon="🤒"   label="Total Patients"         value={data?.totalPatients}         color="green"  />
        <StatCard icon="👩‍⚕️" label="Total Nurses"           value={data?.totalNurses}           color="pink"   />
        <StatCard icon="📅"   label="Today's Appointments"   value={data?.todayAppointments}     color="purple" />
        <StatCard icon="⏳"   label="Pending Approvals"      value={data?.pendingDoctors}        color="yellow" />
        <StatCard icon="🚑"   label="Active Ambulance Calls" value={data?.activeCalls}           color="red"    />
        <StatCard icon="🩸"   label="Blood Requests"         value={data?.pendingBloodRequests}  color="orange" />
        <StatCard icon="💰"   label="Today Revenue"          value={data?.todayRevenue != null ? `₹${data.todayRevenue}` : '₹0'} color="teal" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'Pending Approvals',  path:'/admin/approvals',   color:'bg-blue-600',   icon:'✅' },
              { label:'Departments',         path:'/admin/departments', color:'bg-purple-600', icon:'🏥' },
              { label:'All Users',           path:'/admin/users',       color:'bg-green-600',  icon:'👥' },
              { label:'Audit Logs',          path:'/admin/audit-logs',  color:'bg-orange-600', icon:'📋' },
              { label:'Reports',             path:'/admin/reports',     color:'bg-teal-600',   icon:'📊' },
              { label:'Billing',             path:'/billing/dashboard', color:'bg-yellow-600', icon:'💰' },
            ].map(({ label, path, color, icon }) => (
              <button key={path} onClick={() => navigate(path)}
                className={`${color} text-white p-3 rounded-xl text-sm font-medium hover:opacity-90 transition text-left flex items-center gap-2`}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Patients</h2>
          {data?.recentPatients?.length > 0 ? (
            <div className="space-y-3">
              {data.recentPatients.slice(0, 5).map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                    {p.user?.firstName?.[0] || 'P'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.user?.firstName} {p.user?.lastName}</p>
                    <p className="text-xs text-gray-500">{p.user?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">No recent patients</p>}
        </div>
      </div>
    </div>
  );
}
