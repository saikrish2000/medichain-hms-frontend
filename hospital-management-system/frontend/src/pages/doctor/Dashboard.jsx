import { useQuery } from '@tanstack/react-query';
import { doctorApi } from '../../api';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatTime, formatDate } from '../../utils/helpers';
import { Calendar, Users, FileText, Clock, CheckCircle2, Activity, Pill } from 'lucide-react';

export default function DoctorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['doctor-dashboard'],
    queryFn:  () => doctorApi.getDashboard().then(r => r.data),
    refetchInterval: 30000,
  });

  const d = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good morning, Dr. {d.doctorName?.split(' ')[0] || '—'} 👋</h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's your schedule overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={d.todayCount ?? '—'} icon={<Calendar size={20} />} color="blue" />
        <StatCard title="Pending"              value={d.pendingCount ?? '—'} icon={<Clock size={20} />}    color="amber" />
        <StatCard title="Total Patients"       value={d.totalPatients ?? '—'} icon={<Users size={20} />}  color="green" />
        <StatCard title="Prescriptions"        value={d.prescriptionCount ?? '—'} icon={<Pill size={20} />} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card border border-slate-100">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Today's Schedule</h3>
            <a href="/doctor/appointments" className="text-xs text-primary-600 font-medium hover:text-primary-700">Full schedule →</a>
          </div>
          <div className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4">
                  <div className="skeleton w-14 h-14 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2"><div className="skeleton h-4 rounded w-40" /><div className="skeleton h-3 rounded w-24" /></div>
                </div>
              ))
            ) : d.todayList?.length ? (
              d.todayList.map((appt) => (
                <div key={appt.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="w-14 text-center flex-shrink-0">
                    <p className="text-xs font-bold text-primary-600">{formatTime(appt.appointmentTime)}</p>
                    <p className="text-xs text-slate-400">{appt.durationMinutes || 30}min</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100" />
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {appt.patient?.user?.firstName} {appt.patient?.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{appt.reasonForVisit || 'General Consultation'}</p>
                  </div>
                  <Badge status={appt.status} dot />
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-sm text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                No appointments scheduled for today
              </div>
            )}
          </div>
        </div>

        {/* Quick actions + featured patient */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Write Prescription', href: '/doctor/prescriptions', icon: Pill,       color: 'blue' },
                { label: 'Order Lab Tests',    href: '/doctor/lab-orders',    icon: Activity,   color: 'green' },
                { label: 'Add Medical Record', href: '/doctor/records',        icon: FileText,   color: 'purple' },
                { label: 'Manage Slots',       href: '/doctor/slots',          icon: Calendar,   color: 'amber' },
              ].map(({ label, href, icon: Icon, color }) => (
                <a key={href} href={href}
                  className={`flex items-center gap-3 p-3 rounded-xl bg-${color}-50 hover:bg-${color}-100 transition-colors group`}>
                  <div className={`w-8 h-8 rounded-lg bg-${color}-100 group-hover:bg-${color}-200 flex items-center justify-center transition-colors`}>
                    <Icon size={15} className={`text-${color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Pending approvals widget */}
          {d.pendingAppts?.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-800">{d.pendingAppts.length} pending approvals</h3>
              </div>
              <p className="text-xs text-amber-600 mb-3">Patients waiting for confirmation</p>
              <a href="/doctor/appointments?filter=pending"
                className="text-xs font-medium text-amber-700 hover:text-amber-800 underline">
                Review now →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
