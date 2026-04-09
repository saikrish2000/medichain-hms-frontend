import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ── Tailwind class merger ──────────────────────────────────────────
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Date helpers ──────────────────────────────────────────────────
export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  if (!date) return '—';
  try { return format(typeof date === 'string' ? parseISO(date) : date, fmt); }
  catch { return date; }
};

export const formatDateTime = (date) => formatDate(date, 'dd MMM yyyy, hh:mm a');
export const formatTime     = (date) => formatDate(date, 'hh:mm a');
export const timeAgo        = (date) => {
  if (!date) return '—';
  try { return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }); }
  catch { return date; }
};

// ── Currency ──────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount == null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
};

// ── Role helpers ──────────────────────────────────────────────────
export const getRoleDashboard = (role) => {
  const map = {
    ADMIN:                  '/admin/dashboard',
    DOCTOR:                 '/doctor/dashboard',
    NURSE:                  '/nurse/dashboard',
    INDEPENDENT_NURSE:      '/nurse/dashboard',
    PATIENT:                '/patient/dashboard',
    BLOOD_BANK_MANAGER:     '/blood-bank/dashboard',
    AMBULANCE_OPERATOR:     '/ambulance/dashboard',
    PHARMACIST:             '/pharmacy/dashboard',
    LAB_TECHNICIAN:         '/lab/dashboard',
    PHLEBOTOMIST:           '/lab/phlebotomist',
    MEDICAL_SHOP_OWNER:     '/medical-shop/dashboard',
    DIAGNOSTIC_CENTER_OWNER:'/diagnostic/dashboard',
    RECEPTIONIST:           '/receptionist/dashboard',
  };
  return map[role] || '/dashboard';
};

export const getRoleLabel = (role) => {
  const map = {
    ADMIN:                  'Administrator',
    DOCTOR:                 'Doctor',
    NURSE:                  'Nurse',
    INDEPENDENT_NURSE:      'Independent Nurse',
    PATIENT:                'Patient',
    BLOOD_BANK_MANAGER:     'Blood Bank Manager',
    AMBULANCE_OPERATOR:     'Ambulance Operator',
    PHARMACIST:             'Pharmacist',
    LAB_TECHNICIAN:         'Lab Technician',
    PHLEBOTOMIST:           'Phlebotomist',
    MEDICAL_SHOP_OWNER:     'Medical Shop Owner',
    DIAGNOSTIC_CENTER_OWNER:'Diagnostic Center Owner',
    RECEPTIONIST:           'Receptionist',
  };
  return map[role] || role;
};

export const getRoleColor = (role) => {
  const map = {
    ADMIN:          'purple', DOCTOR: 'blue',
    NURSE:          'teal',   PATIENT: 'green',
    PHARMACIST:     'amber',  LAB_TECHNICIAN: 'orange',
    RECEPTIONIST:   'slate',  AMBULANCE_OPERATOR: 'red',
  };
  return map[role] || 'slate';
};

// ── Status helpers ────────────────────────────────────────────────
export const getStatusBadge = (status) => {
  const map = {
    PENDING:    { label: 'Pending',    cls: 'badge-amber' },
    CONFIRMED:  { label: 'Confirmed',  cls: 'badge-blue' },
    COMPLETED:  { label: 'Completed',  cls: 'badge-green' },
    CANCELLED:  { label: 'Cancelled',  cls: 'badge-red' },
    ACTIVE:     { label: 'Active',     cls: 'badge-green' },
    INACTIVE:   { label: 'Inactive',   cls: 'badge-slate' },
    APPROVED:   { label: 'Approved',   cls: 'badge-green' },
    REJECTED:   { label: 'Rejected',   cls: 'badge-red' },
    PAID:       { label: 'Paid',       cls: 'badge-green' },
    PARTIAL:    { label: 'Partial',    cls: 'badge-amber' },
    AVAILABLE:  { label: 'Available',  cls: 'badge-green' },
    OCCUPIED:   { label: 'Occupied',   cls: 'badge-red' },
    DISPATCHED: { label: 'Dispatched', cls: 'badge-blue' },
  };
  return map[status] || { label: status, cls: 'badge-slate' };
};

// ── Number formatting ─────────────────────────────────────────────
export const formatNumber = (n) =>
  new Intl.NumberFormat('en-IN').format(n ?? 0);

// ── Truncate ──────────────────────────────────────────────────────
export const truncate = (str, len = 50) =>
  str?.length > len ? str.slice(0, len) + '…' : str ?? '';

// ── Debounce ──────────────────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
