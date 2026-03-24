import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
  Users, Stethoscope, Calendar, DollarSign, Building2,
  UserCheck, Activity, TrendingUp, Clock, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

const mockRevenue = [
  { month: 'Oct', revenue: 185000 }, { month: 'Nov', revenue: 220000 },
  { month: 'Dec', revenue: 195000 }, { month: 'Jan', revenue: 248000 },
  { month: 'Feb', revenue: 262000 }, { month: 'Mar', revenue: 285000 },
];
const mockDeptLoad = [
  { dept: 'General', patients: 45 }, { dept: 'Cardio', patients: 32 },
  { dept: 'Ortho', patients: 28 },   { dept: 'Paeds', patients: 22 },
  { dept: 'Neuro', patients: 18 },
];

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey:  ['admin-dashboard'],
    queryFn:   () => adminApi.getDashboard().then(r => r.data),
    refetchInterval: 30000,
  });

  const stats = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="dot-green" />
          <span className="text-sm text-slate-500">Live</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Doctors"    value={isLoading ? '...' : stats.totalDoctors}   icon={<Stethoscope size={20} />} color="blue" />
        <StatCard title="Pending Approval" value={isLoading ? '...' : stats.pendingDoctors}  icon={<UserCheck size={20} />}   color="amber" />
        <StatCard title="Total Patients"   value={isLoading ? '...' : stats.totalPatients}   icon={<Users size={20} />}       color="green" />
        <StatCard title="Today's Appts"    value={isLoading ? '...' : stats.todayAppointments} icon={<Calendar size={20} />}  color="purple" />
        <StatCard title="Branches"         value={isLoading ? '...' : stats.totalBranches}   icon={<Building2 size={20} />}  color="teal" />
        <StatCard title="Today's Revenue"  value={formatCurrency(stats.todayRevenue || 0)}    icon={<DollarSign size={20} />} color="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 6 months</p>
            </div>
            <Badge variant="green" dot>+12% this month</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockRevenue}>
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3a6efd" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3a6efd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                     tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                       contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#3a6efd" strokeWidth={2}
                    fill="url(#revenue)" dot={{ fill: '#3a6efd', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Load */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Dept Load</h3>
          <p className="text-xs text-slate-400 mb-5">Today's patients per dept</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDeptLoad} layout="vertical" barSize={10}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="patients" fill="#3a6efd" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Pending Approvals</h3>
            <a href="/admin/approvals" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all →</a>
          </div>
          <div className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="px-6 py-4"><div className="skeleton h-8 rounded-lg" /></div>)
            ) : stats.pendingApprovals?.length ? (
              stats.pendingApprovals.map((doc) => (
                <div key={doc.id} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Stethoscope size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {doc.user?.firstName} {doc.user?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{doc.specialization?.name}</p>
                    </div>
                  </div>
                  <Badge status="PENDING" dot />
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-slate-400">No pending approvals</div>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Patients</h3>
            <a href="/admin/patients" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all →</a>
          </div>
          <div className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="px-6 py-4"><div className="skeleton h-8 rounded-lg" /></div>)
            ) : stats.recentPatients?.length ? (
              stats.recentPatients.map((p) => (
                <div key={p.id} className="px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                      <Users size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {p.user?.firstName} {p.user?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{p.patientIdNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(p.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-slate-400">No patients yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
