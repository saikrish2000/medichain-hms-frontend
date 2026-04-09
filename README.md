# MediChain HMS — Frontend

React + Vite + Tailwind CSS frontend for the MediChain Hospital Management System.

## Tech Stack
- React 18, Vite 5, Tailwind CSS 3
- React Router DOM 6
- TanStack React Query 5
- Zustand (auth state)
- Axios
- React Hook Form + Zod
- Recharts
- Framer Motion
- Lucide React icons
- React Hot Toast

## Quick Start

```bash
git clone https://github.com/saikrish2000/medichain-hms-frontend.git
cd medichain-hms-frontend
npm install
cp .env.example .env.local
# Edit .env.local: set VITE_API_BASE_URL to your backend URL
npm run dev
```

App runs at: http://localhost:5173

## Connecting to Backend
Edit `src/api/axios.js`:
```js
baseURL: 'http://localhost:8080'  // your Spring Boot backend
```

## Pages / Roles
- Admin: Dashboard, Users, Departments, Approvals, Reports, Audit Logs
- Doctor: Dashboard, Appointments, Patients, Prescriptions, Lab Orders, Slots
- Nurse: Dashboard, Patients, Vitals, Tasks, eMAR, Handover
- Patient: Dashboard, Appointments, Book Appointment, Records, Vitals
- Pharmacy: Dashboard, Medicines, Prescriptions
- Lab: Dashboard, Orders, Tests
- Ambulance: Dashboard, Calls, Dispatch, Fleet
- Blood Bank: Dashboard, Inventory
- Billing: Dashboard, Invoices, My Bills
- Receptionist: Dashboard, Appointments

## Build for Production
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or Nginx
```

## Backend Repo
https://github.com/saikrish2000/medichain-hms-backend

## Branches
`main` (prod) · `develop` (active dev) · `feature/*`
