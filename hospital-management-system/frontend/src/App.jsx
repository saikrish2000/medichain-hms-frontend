import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import AppLayout from './layouts/AppLayout';

// Auth pages
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin pages
import AdminDashboard   from './pages/admin/Dashboard';
import AdminApprovals   from './pages/admin/Approvals';
import AdminPatients    from './pages/admin/Patients';
import AdminDepartments from './pages/admin/Departments';
import AdminUsers       from './pages/admin/Users';
import AdminAuditLogs   from './pages/admin/AuditLogs';
import AdminReports     from './pages/admin/Reports';

// Doctor pages
import DoctorDashboard      from './pages/doctor/Dashboard';
import DoctorAppointments   from './pages/doctor/Appointments';
import DoctorPatients       from './pages/doctor/Patients';
import DoctorPrescriptions  from './pages/doctor/Prescriptions';
import DoctorLabOrders      from './pages/doctor/LabOrders';
import DoctorSlots          from './pages/doctor/Slots';

// Patient pages
import PatientDashboard    from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';
import PatientRecords      from './pages/patient/Records';
import PatientVitals       from './pages/patient/Vitals';
import BookAppointment     from './pages/patient/BookAppointment';

// Nurse pages
import NurseDashboard  from './pages/nurse/Dashboard';
import NursePatients   from './pages/nurse/Patients';
import NurseTasks      from './pages/nurse/Tasks';
import NurseVitals     from './pages/nurse/Vitals';
import NurseEmar       from './pages/nurse/Emar';
import NurseHandover   from './pages/nurse/Handover';

// Pharmacy pages
import PharmacyDashboard      from './pages/pharmacy/Dashboard';
import PharmacyMedicines      from './pages/pharmacy/Medicines';
import PharmacyPrescriptions  from './pages/pharmacy/Prescriptions';

// Lab pages
import LabDashboard from './pages/lab/Dashboard';
import LabOrders    from './pages/lab/Orders';
import LabTests     from './pages/lab/Tests';

// Billing pages
import BillingDashboard from './pages/billing/Dashboard';
import BillingInvoices  from './pages/billing/Invoices';
import MyBills          from './pages/billing/MyBills';

// Ambulance pages
import AmbulanceDashboard from './pages/ambulance/Dashboard';
import AmbulanceCalls     from './pages/ambulance/Calls';
import AmbulanceFleet     from './pages/ambulance/Fleet';
import AmbulanceDispatch  from './pages/ambulance/Dispatch';

// Blood Bank pages
import BloodBankDashboard from './pages/blood-bank/Dashboard';
import BloodBankInventory from './pages/blood-bank/Inventory';

// Receptionist pages
import ReceptionistDashboard    from './pages/receptionist/Dashboard';
import ReceptionistAppointments from './pages/receptionist/Appointments';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// ── Auth Guard ─────────────────────────────────────────────────────
function RequireAuth({ children, roles }) {
  const { isAuth, user } = useAuthStore();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"         element={<Navigate to="/login" replace />} />

          {/* Protected app routes */}
          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>

            {/* Admin */}
            <Route path="/admin/dashboard"   element={<RequireAuth roles={['ADMIN']}><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/approvals"   element={<RequireAuth roles={['ADMIN']}><AdminApprovals /></RequireAuth>} />
            <Route path="/admin/patients"    element={<RequireAuth roles={['ADMIN']}><AdminPatients /></RequireAuth>} />
            <Route path="/admin/departments" element={<RequireAuth roles={['ADMIN']}><AdminDepartments /></RequireAuth>} />
            <Route path="/admin/users"       element={<RequireAuth roles={['ADMIN']}><AdminUsers /></RequireAuth>} />
            <Route path="/admin/audit-logs"  element={<RequireAuth roles={['ADMIN']}><AdminAuditLogs /></RequireAuth>} />
            <Route path="/admin/reports"     element={<RequireAuth roles={['ADMIN']}><AdminReports /></RequireAuth>} />

            {/* Doctor */}
            <Route path="/doctor/dashboard"     element={<RequireAuth roles={['DOCTOR']}><DoctorDashboard /></RequireAuth>} />
            <Route path="/doctor/appointments"  element={<RequireAuth roles={['DOCTOR']}><DoctorAppointments /></RequireAuth>} />
            <Route path="/doctor/patients"      element={<RequireAuth roles={['DOCTOR']}><DoctorPatients /></RequireAuth>} />
            <Route path="/doctor/prescriptions" element={<RequireAuth roles={['DOCTOR']}><DoctorPrescriptions /></RequireAuth>} />
            <Route path="/doctor/lab-orders"    element={<RequireAuth roles={['DOCTOR']}><DoctorLabOrders /></RequireAuth>} />
            <Route path="/doctor/slots"         element={<RequireAuth roles={['DOCTOR']}><DoctorSlots /></RequireAuth>} />

            {/* Patient */}
            <Route path="/patient/dashboard"    element={<RequireAuth roles={['PATIENT']}><PatientDashboard /></RequireAuth>} />
            <Route path="/patient/appointments" element={<RequireAuth roles={['PATIENT']}><PatientAppointments /></RequireAuth>} />
            <Route path="/patient/records"      element={<RequireAuth roles={['PATIENT']}><PatientRecords /></RequireAuth>} />
            <Route path="/patient/vitals"       element={<RequireAuth roles={['PATIENT']}><PatientVitals /></RequireAuth>} />
            <Route path="/appointments/book"    element={<RequireAuth roles={['PATIENT']}><BookAppointment /></RequireAuth>} />

            {/* Nurse */}
            <Route path="/nurse/dashboard" element={<RequireAuth roles={['NURSE','INDEPENDENT_NURSE']}><NurseDashboard /></RequireAuth>} />
            <Route path="/nurse/patients"  element={<RequireAuth roles={['NURSE','INDEPENDENT_NURSE']}><NursePatients /></RequireAuth>} />
            <Route path="/nurse/tasks"     element={<RequireAuth roles={['NURSE','INDEPENDENT_NURSE']}><NurseTasks /></RequireAuth>} />
            <Route path="/nurse/vitals"    element={<RequireAuth roles={['NURSE','INDEPENDENT_NURSE']}><NurseVitals /></RequireAuth>} />
            <Route path="/nurse/emar"      element={<RequireAuth roles={['NURSE','INDEPENDENT_NURSE']}><NurseEmar /></RequireAuth>} />
            <Route path="/nurse/handover"  element={<RequireAuth roles={['NURSE','INDEPENDENT_NURSE']}><NurseHandover /></RequireAuth>} />

            {/* Pharmacy */}
            <Route path="/pharmacy/dashboard"     element={<RequireAuth roles={['PHARMACIST','ADMIN']}><PharmacyDashboard /></RequireAuth>} />
            <Route path="/pharmacy/medicines"     element={<RequireAuth roles={['PHARMACIST','ADMIN']}><PharmacyMedicines /></RequireAuth>} />
            <Route path="/pharmacy/prescriptions" element={<RequireAuth roles={['PHARMACIST','ADMIN']}><PharmacyPrescriptions /></RequireAuth>} />

            {/* Lab */}
            <Route path="/lab/dashboard" element={<RequireAuth roles={['LAB_TECHNICIAN','PHLEBOTOMIST','ADMIN']}><LabDashboard /></RequireAuth>} />
            <Route path="/lab/orders"    element={<RequireAuth roles={['LAB_TECHNICIAN','PHLEBOTOMIST','ADMIN','DOCTOR']}><LabOrders /></RequireAuth>} />
            <Route path="/lab/tests"     element={<RequireAuth roles={['LAB_TECHNICIAN','ADMIN']}><LabTests /></RequireAuth>} />

            {/* Billing */}
            <Route path="/billing/dashboard" element={<RequireAuth roles={['ADMIN','RECEPTIONIST']}><BillingDashboard /></RequireAuth>} />
            <Route path="/billing/invoices"  element={<RequireAuth roles={['ADMIN','RECEPTIONIST']}><BillingInvoices /></RequireAuth>} />
            <Route path="/billing/my-bills"  element={<RequireAuth roles={['PATIENT']}><MyBills /></RequireAuth>} />

            {/* Ambulance */}
            <Route path="/ambulance/dashboard" element={<RequireAuth roles={['AMBULANCE_OPERATOR','ADMIN']}><AmbulanceDashboard /></RequireAuth>} />
            <Route path="/ambulance/calls"     element={<RequireAuth roles={['AMBULANCE_OPERATOR','ADMIN']}><AmbulanceCalls /></RequireAuth>} />
            <Route path="/ambulance/fleet"     element={<RequireAuth roles={['AMBULANCE_OPERATOR','ADMIN']}><AmbulanceFleet /></RequireAuth>} />
            <Route path="/ambulance/dispatch"  element={<RequireAuth roles={['AMBULANCE_OPERATOR','ADMIN']}><AmbulanceDispatch /></RequireAuth>} />

            {/* Blood Bank */}
            <Route path="/blood-bank/dashboard" element={<RequireAuth roles={['BLOOD_BANK_MANAGER','ADMIN']}><BloodBankDashboard /></RequireAuth>} />
            <Route path="/blood-bank/inventory" element={<RequireAuth roles={['BLOOD_BANK_MANAGER','ADMIN']}><BloodBankInventory /></RequireAuth>} />

            {/* Receptionist */}
            <Route path="/receptionist/dashboard"    element={<RequireAuth roles={['RECEPTIONIST','ADMIN']}><ReceptionistDashboard /></RequireAuth>} />
            <Route path="/receptionist/appointments" element={<RequireAuth roles={['RECEPTIONIST','ADMIN']}><ReceptionistAppointments /></RequireAuth>} />

          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: '13px',
            fontWeight: '500',
            padding: '12px 16px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
