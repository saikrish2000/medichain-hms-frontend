import api from './axios';

// ── Admin ──────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard:    ()               => api.get('/admin/dashboard'),
  getDoctors:      (params)         => api.get('/admin/doctors', { params }),
  approveDoctor:   (id)             => api.post(`/admin/doctors/${id}/approve`),
  rejectDoctor:    (id, reason)     => api.post(`/admin/doctors/${id}/reject`, { reason }),
  getNurses:       (params)         => api.get('/admin/nurses', { params }),
  approveNurse:    (id)             => api.post(`/admin/nurses/${id}/approve`),
  getPatients:     (params)         => api.get('/admin/patients', { params }),
  getDepartments:  ()               => api.get('/admin/departments'),
  createDept:      (data)           => api.post('/admin/departments', data),
  getBranches:     ()               => api.get('/admin/branches'),
  createBranch:    (data)           => api.post('/admin/branches', data),
  getUsers:        (params)         => api.get('/admin/users', { params }),
  toggleUser:      (id)             => api.post(`/admin/users/${id}/toggle`),
  getAuditLogs:    (params)         => api.get('/admin/audit-logs', { params }),
  getReports:      (params)         => api.get('/admin/reports', { params }),
};

// ── Doctor ─────────────────────────────────────────────────────────
export const doctorApi = {
  getDashboard:      ()             => api.get('/doctor/dashboard'),
  getAppointments:   (params)       => api.get('/doctor/appointments', { params }),
  updateAppt:        (id, data)     => api.put(`/doctor/appointments/${id}`, data),
  getPatients:       (params)       => api.get('/doctor/patients', { params }),
  getSlots:          ()             => api.get('/doctor/slots'),
  createSlot:        (data)         => api.post('/doctor/slots', data),
  deleteSlot:        (id)           => api.delete(`/doctor/slots/${id}`),
  getPrescriptions:  (params)       => api.get('/doctor/prescriptions', { params }),
  createPrescription:(data)         => api.post('/doctor/prescriptions', data),
  getLabOrders:      (params)       => api.get('/doctor/lab-orders', { params }),
  createLabOrder:    (data)         => api.post('/doctor/lab-orders', data),
  getMedicalRecord:  (id)           => api.get(`/doctor/records/${id}`),
  createRecord:      (data)         => api.post('/doctor/records', data),
  getProfile:        ()             => api.get('/doctor/profile'),
  updateProfile:     (data)         => api.put('/doctor/profile', data),
};

// ── Patient ────────────────────────────────────────────────────────
export const patientApi = {
  getDashboard:      ()             => api.get('/patient/dashboard'),
  getAppointments:   (params)       => api.get('/patient/appointments', { params }),
  bookAppointment:   (data)         => api.post('/patient/appointments/book', data),
  cancelAppointment: (id)           => api.post(`/patient/appointments/${id}/cancel`),
  getRecords:        ()             => api.get('/patient/records'),
  getRecord:         (id)           => api.get(`/patient/records/${id}`),
  getVitals:         ()             => api.get('/patient/vitals'),
  getInvoices:       ()             => api.get('/patient/invoices'),
  getProfile:        ()             => api.get('/patient/profile'),
  updateProfile:     (data)         => api.put('/patient/profile', data),
};

// ── Appointments (booking flow) ────────────────────────────────────
export const appointmentApi = {
  getSpecializations: ()            => api.get('/appointments/specializations'),
  getDoctorsBySpec:   (specId, branchId) => api.get(`/appointments/doctors?specId=${specId}&branchId=${branchId}`),
  getSlots:          (doctorId, date) => api.get(`/appointments/slots?doctorId=${doctorId}&date=${date}`),
  book:              (data)         => api.post('/appointments/book', data),
  getBranches:       ()             => api.get('/appointments/branches'),
};

// ── Nurse ──────────────────────────────────────────────────────────
export const nurseApi = {
  getDashboard:  ()                 => api.get('/nurse/dashboard'),
  getPatients:   ()                 => api.get('/nurse/patients'),
  getTasks:      ()                 => api.get('/nurse/tasks'),
  completeTask:  (id)               => api.post(`/nurse/tasks/${id}/complete`),
  getVitals:     (patientId)        => api.get(`/nurse/vitals/${patientId}`),
  recordVitals:  (data)             => api.post('/nurse/vitals', data),
  getEws:        (patientId)        => api.get(`/nurse/ews/${patientId}`),
  getHandover:   ()                 => api.get('/nurse/handover'),
  getEmar:       ()                 => api.get('/nurse/emar'),
};

// ── Pharmacy ───────────────────────────────────────────────────────
export const pharmacyApi = {
  getDashboard:      ()             => api.get('/pharmacy/dashboard'),
  getMedicines:      (params)       => api.get('/pharmacy/medicines', { params }),
  saveMedicine:      (data)         => api.post('/pharmacy/medicines', data),
  updateMedicine:    (id, data)     => api.put(`/pharmacy/medicines/${id}`, data),
  updateStock:       (id, data)     => api.post(`/pharmacy/medicines/${id}/stock`, data),
  getLowStock:       ()             => api.get('/pharmacy/low-stock'),
  getPrescriptions:  (params)       => api.get('/pharmacy/prescriptions', { params }),
  dispensePrescription: (id)        => api.post(`/pharmacy/prescriptions/${id}/dispense`),
};

// ── Lab ────────────────────────────────────────────────────────────
export const labApi = {
  getDashboard:  ()                 => api.get('/lab/dashboard'),
  getTests:      (params)           => api.get('/lab/tests', { params }),
  saveTest:      (data)             => api.post('/lab/tests', data),
  getOrders:     (params)           => api.get('/lab/orders', { params }),
  getOrder:      (id)               => api.get(`/lab/orders/${id}`),
  collectSample: (id)               => api.post(`/lab/orders/${id}/collect`),
  enterResults:  (id, data)         => api.post(`/lab/orders/${id}/results`, data),
};

// ── Billing ────────────────────────────────────────────────────────
export const billingApi = {
  getDashboard:  ()                 => api.get('/billing/dashboard'),
  getInvoices:   (params)           => api.get('/billing/invoices', { params }),
  getInvoice:    (id)               => api.get(`/billing/invoices/${id}`),
  createInvoice: (data)             => api.post('/billing/invoices', data),
  markPaid:      (id, data)         => api.post(`/billing/invoices/${id}/pay`, data),
  getMyBills:    ()                 => api.get('/billing/my-bills'),
};

// ── Ambulance ──────────────────────────────────────────────────────
export const ambulanceApi = {
  getDashboard:    ()               => api.get('/ambulance/dashboard'),
  requestAmbulance:(data)           => api.post('/ambulance/dispatch', data),
  getCalls:        (params)         => api.get('/ambulance/calls', { params }),
  updateStatus:    (id, status)     => api.post(`/ambulance/calls/${id}/status`, { status }),
  getFleet:        ()               => api.get('/ambulance/fleet'),
  saveAmbulance:   (data)           => api.post('/ambulance/fleet', data),
  updateLocation:  (id, lat, lng)   => api.post(`/ambulance/location/${id}`, { lat, lng }),
};

// ── Blood Bank ─────────────────────────────────────────────────────
export const bloodBankApi = {
  getDashboard:    ()               => api.get('/blood-bank/dashboard'),
  getInventory:    ()               => api.get('/blood-bank/inventory'),
  requestBlood:    (data)           => api.post('/blood-bank/requests', data),
  getRequests:     ()               => api.get('/blood-bank/requests'),
  getDonors:       ()               => api.get('/blood-bank/donors'),
};

// ── Receptionist ───────────────────────────────────────────────────
export const receptionistApi = {
  getDashboard:    ()               => api.get('/receptionist/dashboard'),
  getAppointments: (params)         => api.get('/receptionist/appointments', { params }),
  checkIn:         (id)             => api.post(`/receptionist/appointments/${id}/checkin`),
};
