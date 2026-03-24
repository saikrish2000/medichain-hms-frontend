import { useQuery } from '@tanstack/react-query';
import { patientApi } from '../../api';
import { StatCard } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatDate, formatTime } from '../../utils/helpers';
import { Calendar, FileText, Activity, CreditCard, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['patient-dashboard'],
    queryFn:  () => patientApi.getDashboard().then(r => r.data),
  });
  const d = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute right-12 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-12" />
        <div className="relative">
          <p className="text-primary-200 text-sm">Welcome back,</p>
          <h2 className="text-2xl font-bold mt-0.5">{user?.fullName?.split(' ')[0]} 👋</h2>
          <p className="text-primary-200 text-sm mt-2">How are you feeling today?</p>
        </div>
        <Link to="/patient/appointments"
          className="relative mt-4 inline-flex items-center gap-2 bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-50 transition-colors">
          <Plus size={15} /> Book Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Upcoming Appts"  value={d.upcomingCount ?? '—'} icon={<Calendar size={20} />}  color="blue" />
        <StatCard title="Medical Records" value={d.recordCount ?? '—'}   icon={<FileText size={20} />}  color="green" />
        <StatCard title="Prescriptions"   value={d.rxCount ?? '—'}       icon={<Activity size={20} />}  color="purple" />
        <StatCard title="Pending Bills"   value={d.pendingBills ?? '—'}  icon={<CreditCard size={20} />}color="amber" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Upcoming Appointments</h3>
            <Link to="/patient/appointments" className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="px-5 py-4"><div className="skeleton h-12 rounded-xl" /></div>)
            ) : d.upcomingAppointments?.length ? (
              d.upcomingAppointments.slice(0, 4).map((a) => (
                <div key={a.id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                    <p className="text-xs font-bold text-primary-600 leading-none">
                      {new Date(a.appointmentDate).toLocaleDateString('en', { day: '2-digit' })}
                    </p>
                    <p className="text-xs text-primary-400 leading-none mt-0.5">
                      {new Date(a.appointmentDate).toLocaleDateString('en', { month: 'short' })}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      Dr. {a.doctor?.user?.firstName} {a.doctor?.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{a.doctor?.specialization?.name}</p>
                  </div>
                  <Badge status={a.status} />
                </div>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No upcoming appointments
              </div>
            )}
          </div>
        </div>

        {/* Recent records */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Recent Medical Records</h3>
            <Link to="/patient/records" className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {isLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="px-5 py-4"><div className="skeleton h-12 rounded-xl" /></div>)
            ) : d.recentRecords?.length ? (
              d.recentRecords.slice(0, 4).map((r) => (
                <Link key={r.id} to={`/patient/records/${r.id}`}
                  className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={15} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{r.diagnosis || 'Medical Visit'}</p>
                    <p className="text-xs text-slate-400">Dr. {r.doctor?.user?.firstName} • {formatDate(r.visitDate)}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </Link>
              ))
            ) : (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No records yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
