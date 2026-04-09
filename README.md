# MediChain HMS — Frontend

![Frontend CI](https://github.com/saikrish2000/medichain-hms-frontend/actions/workflows/ci.yml/badge.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-blue)

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
Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Pages / Roles
| Role | Pages |
|------|-------|
| Admin | Dashboard, Users, Departments, Approvals, Reports, Audit Logs |
| Doctor | Dashboard, Appointments, Patients, Prescriptions, Lab Orders, Slots |
| Nurse | Dashboard, Patients, Vitals, Tasks, eMAR, Handover |
| Patient | Dashboard, Appointments, Book Appointment, Records, Vitals |
| Pharmacy | Dashboard, Medicines, Prescriptions |
| Lab | Dashboard, Orders, Tests |
| Ambulance | Dashboard, Calls, Dispatch, Fleet |
| Blood Bank | Dashboard, Inventory |
| Billing | Dashboard, Invoices, My Bills |
| Receptionist | Dashboard, Appointments |

## Build for Production
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or Nginx
```

## Backend Repo
https://github.com/saikrish2000/medichain-hms-backend

## Branches
`main` (prod) · `develop` (active dev) · `feature/*`
