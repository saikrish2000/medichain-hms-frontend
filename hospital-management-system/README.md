# 🏥 MediChain — Hospital Management System

> Full-scale, industry-grade Hospital Chain Management System built with Spring Boot 3.2, Thymeleaf, MySQL, and Spring Security (JWT).

---

## Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Backend    | Spring Boot 3.2.3, Java 17                       |
| Frontend   | Thymeleaf (server-side rendering), Claymorphism UI |
| Database   | MySQL 8.0 + Flyway migrations                    |
| Security   | Spring Security + JWT                            |
| Payments   | Razorpay (INR)                                   |
| SMS        | Twilio                                           |
| Email      | Gmail SMTP                                       |
| Real-time  | WebSocket (GPS tracking, live alerts)            |
| Container  | Docker + Docker Compose                          |

---

## Roles & Portals

| Role            | Portal URL    | Capabilities                                    |
|-----------------|---------------|-------------------------------------------------|
| Admin           | `/admin`      | Dashboard, approvals, users, branches, billing  |
| Doctor          | `/doctor`     | Appointments, slots, patient records, CPOE      |
| Nurse           | `/nurse`      | Station, eMAR, vitals, EWS alerts, handover     |
| Patient         | `/patient`    | Dashboard, records, vitals, appointments        |
| Blood Bank Mgr  | `/blood-bank` | Inventory, donations, requests                  |

---

## Quick Start (Docker)

```bash
git clone https://github.com/YOUR_USERNAME/medichain-hms.git
cd medichain-hms
cp .env.example .env
# Edit .env with your values
docker-compose up -d
```

App runs at **http://localhost:8080**

---

## Quick Start (Local Dev)

```bash
# Prerequisites: Java 17+, Maven 3.9+, MySQL 8.0+
export DB_URL="jdbc:mysql://localhost:3306/hospital_db?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true"
export DB_USERNAME="root"
export DB_PASSWORD="yourpassword"
export JWT_SECRET="your-64-char-secret"

mvn spring-boot:run
```

---

## Modules Built

- ✅ Authentication (JWT + role-based access)
- ✅ Admin Dashboard (approvals, departments, branches, users)
- ✅ Doctor Portal (appointments, slots, patient records, prescriptions)
- ✅ Nurse Station (eMAR, EWS alerts, vitals, shift handover, task list)
- ✅ Patient Portal (records, vitals, appointments)
- ✅ Appointment Booking (4-step: specialty → doctor → slot → confirm)
- ✅ Blood Bank (inventory, donations, requests)
- ✅ Medical Records + Prescriptions
- ✅ Audit Logs + Reports
- ✅ Multilingual (English, Hindi, Telugu)
- ✅ Claymorphism UI design system
- ✅ Flyway DB migrations (V1–V5)
- 🔜 Billing + Razorpay payments
- 🔜 Ambulance GPS tracking
- 🔜 Organ donor registry
- 🔜 Independent nurse/pharmacy/diagnostics marketplace

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions covering:
- GitHub setup + CI/CD
- Render.com (free)
- Railway.app
- AWS EC2 / DigitalOcean with Docker Compose

---

## License

Private — MediChain Hospital Management System
