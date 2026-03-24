import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard, Users, Calendar, Stethoscope, Pill, FlaskConical,
  Ambulance, CreditCard, Heart, UserCheck, ClipboardList, Settings,
  LogOut, Building2, Activity, FileText, Bell, Shield, ChevronRight,
  Droplets, Bed, Package, UserCog
} from 'lucide-react';

// Navigation config per role
const NAV = {
  ADMIN: [
    { section: 'Overview' },
    { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users',        icon: Users,           label: 'All Users' },
    { section: 'Operations' },
    { to: '/admin/approvals',    icon: UserCheck,       label: 'Approvals' },
    { to: '/admin/departments',  icon: Building2,       label: 'Departments' },
    { to: '/admin/branches',     icon: Building2,       label: 'Branches' },
    { to: '/admin/patients',     icon: Users,           label: 'Patients' },
    { section: 'Finance & Reports' },
    { to: '/billing/dashboard',  icon: CreditCard,      label: 'Billing' },
    { to: '/admin/reports',      icon: FileText,        label: 'Reports' },
    { to: '/admin/audit-logs',   icon: Shield,          label: 'Audit Logs' },
  ],
  DOCTOR: [
    { section: 'Overview' },
    { to: '/doctor/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'Clinical' },
    { to: '/doctor/appointments',icon: Calendar,        label: 'Appointments' },
    { to: '/doctor/patients',    icon: Users,           label: 'My Patients' },
    { to: '/doctor/prescriptions',icon: Pill,           label: 'Prescriptions' },
    { to: '/doctor/lab-orders',  icon: FlaskConical,    label: 'Lab Orders' },
    { to: '/doctor/slots',       icon: ClipboardList,   label: 'My Slots' },
  ],
  NURSE: [
    { section: 'Overview' },
    { to: '/nurse/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'Ward' },
    { to: '/nurse/patients',     icon: Users,           label: 'Patients' },
    { to: '/nurse/tasks',        icon: ClipboardList,   label: 'Tasks' },
    { to: '/nurse/vitals',       icon: Activity,        label: 'Vitals' },
    { to: '/nurse/emar',         icon: Pill,            label: 'eMAR' },
    { to: '/nurse/handover',     icon: UserCog,         label: 'Handover' },
  ],
  PATIENT: [
    { section: 'Overview' },
    { to: '/patient/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'Care' },
    { to: '/patient/appointments',icon: Calendar,       label: 'Appointments' },
    { to: '/patient/records',    icon: FileText,        label: 'Medical Records' },
    { to: '/patient/vitals',     icon: Activity,        label: 'Vitals' },
    { section: 'Finance' },
    { to: '/billing/my-bills',   icon: CreditCard,      label: 'My Bills' },
  ],
  PHARMACIST: [
    { section: 'Overview' },
    { to: '/pharmacy/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'Pharmacy' },
    { to: '/pharmacy/medicines', icon: Pill,            label: 'Medicines' },
    { to: '/pharmacy/prescriptions',icon: ClipboardList,label: 'Prescriptions' },
    { to: '/pharmacy/low-stock', icon: Package,         label: 'Low Stock' },
  ],
  LAB_TECHNICIAN: [
    { section: 'Overview' },
    { to: '/lab/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'Lab' },
    { to: '/lab/orders',         icon: FlaskConical,    label: 'Orders' },
    { to: '/lab/tests',          icon: ClipboardList,   label: 'Test Catalog' },
  ],
  AMBULANCE_OPERATOR: [
    { section: 'Overview' },
    { to: '/ambulance/dashboard',icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'Operations' },
    { to: '/ambulance/calls',    icon: Ambulance,       label: 'Active Calls' },
    { to: '/ambulance/fleet',    icon: Ambulance,       label: 'Fleet' },
    { to: '/ambulance/dispatch', icon: Bell,            label: 'Dispatch' },
  ],
  BLOOD_BANK_MANAGER: [
    { section: 'Overview' },
    { to: '/blood-bank/dashboard',icon: LayoutDashboard,label: 'Dashboard' },
    { section: 'Blood Bank' },
    { to: '/blood-bank/inventory',icon: Droplets,       label: 'Inventory' },
    { to: '/blood-bank/requests', icon: Heart,          label: 'Requests' },
    { to: '/blood-bank/donors',   icon: Users,          label: 'Donors' },
  ],
  RECEPTIONIST: [
    { section: 'Overview' },
    { to: '/receptionist/dashboard',icon: LayoutDashboard,label: 'Dashboard' },
    { section: 'Front Desk' },
    { to: '/receptionist/appointments',icon: Calendar,  label: 'Appointments' },
    { to: '/billing/dashboard',  icon: CreditCard,      label: 'Billing' },
  ],
};

// Fallback
NAV.INDEPENDENT_NURSE   = NAV.NURSE;
NAV.PHLEBOTOMIST        = NAV.LAB_TECHNICIAN;

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const navItems = (user?.role ? NAV[user.role] : []) || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-slate-100 flex-shrink-0', collapsed && 'justify-center px-0')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-glow">
          <Heart className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-slate-900 text-sm leading-tight">MediChain</p>
            <p className="text-xs text-slate-400">Hospital Suite</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin no-scrollbar">
        {navItems.map((item, i) => {
          if (item.section) {
            if (collapsed) return <div key={i} className="my-2 border-t border-slate-100" />;
            return <p key={i} className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-3 py-2 mt-3 mb-1 first:mt-1">{item.section}</p>;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('dashboard')}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
                collapsed && 'justify-center px-0 w-10 h-10 mx-auto'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" size={18} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className={cn('border-t border-slate-100 p-3 flex-shrink-0', collapsed && 'flex justify-center')}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.fullName?.[0] || user?.username?.[0] || '?'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName || user?.username}</p>
              <p className="text-xs text-slate-400 truncate">{user?.role?.replace('_',' ')}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-500',
            'hover:bg-red-50 hover:text-red-600 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <LogOut size={16} />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={cn(
        'hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white border-r border-slate-100 z-30',
        'transition-all duration-300 shadow-sm',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}>
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="relative w-[260px] bg-white h-full shadow-xl flex flex-col">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
