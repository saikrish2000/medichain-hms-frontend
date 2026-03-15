# Hospital Management System — Project Structure

```
hospital-management-system/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/com/hospital/
│   │   │   ├── HospitalManagementApplication.java
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   ├── WebConfig.java
│   │   │   │   ├── WebSocketConfig.java
│   │   │   │   └── ModelMapperConfig.java
│   │   │   │
│   │   │   ├── entity/
│   │   │   │   ├── User.java
│   │   │   │   ├── Doctor.java
│   │   │   │   ├── Nurse.java
│   │   │   │   ├── Patient.java
│   │   │   │   ├── HospitalBranch.java
│   │   │   │   ├── Department.java
│   │   │   │   ├── Specialization.java
│   │   │   │   ├── DoctorSlot.java
│   │   │   │   ├── DoctorScheduleTemplate.java
│   │   │   │   ├── Appointment.java
│   │   │   │   ├── MedicalRecord.java
│   │   │   │   ├── Prescription.java
│   │   │   │   ├── PrescriptionItem.java
│   │   │   │   ├── BloodBankInventory.java
│   │   │   │   ├── BloodDonor.java
│   │   │   │   ├── BloodRequest.java
│   │   │   │   ├── OrganDonor.java
│   │   │   │   ├── OrganDonorOrgan.java
│   │   │   │   ├── OrganRequest.java
│   │   │   │   ├── Ambulance.java
│   │   │   │   ├── AmbulanceRequest.java
│   │   │   │   ├── Medicine.java
│   │   │   │   ├── PharmacyDispense.java
│   │   │   │   ├── LabTest.java
│   │   │   │   ├── LabOrder.java
│   │   │   │   ├── LabOrderItem.java
│   │   │   │   ├── Document.java
│   │   │   │   ├── Bill.java
│   │   │   │   ├── BillItem.java
│   │   │   │   ├── Payment.java
│   │   │   │   ├── Notification.java
│   │   │   │   ├── AuditLog.java
│   │   │   │   ├── DoctorReview.java
│   │   │   │   └── UserSession.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   └── [Repository interface for each entity]
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── UserService.java
│   │   │   │   ├── DoctorService.java
│   │   │   │   ├── NurseService.java
│   │   │   │   ├── PatientService.java
│   │   │   │   ├── AppointmentService.java
│   │   │   │   ├── SlotService.java
│   │   │   │   ├── BloodBankService.java
│   │   │   │   ├── OrganDonorService.java
│   │   │   │   ├── AmbulanceService.java
│   │   │   │   ├── PharmacyService.java
│   │   │   │   ├── LabService.java
│   │   │   │   ├── BillingService.java
│   │   │   │   ├── PaymentService.java
│   │   │   │   ├── NotificationService.java
│   │   │   │   ├── AuditService.java
│   │   │   │   ├── DocumentService.java
│   │   │   │   └── ReportService.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   ├── DoctorController.java
│   │   │   │   ├── NurseController.java
│   │   │   │   ├── PatientController.java
│   │   │   │   ├── AppointmentController.java
│   │   │   │   ├── SlotController.java
│   │   │   │   ├── BloodBankController.java
│   │   │   │   ├── OrganDonorController.java
│   │   │   │   ├── AmbulanceController.java
│   │   │   │   ├── PharmacyController.java
│   │   │   │   ├── LabController.java
│   │   │   │   ├── BillingController.java
│   │   │   │   ├── PaymentController.java
│   │   │   │   └── NotificationController.java
│   │   │   │
│   │   │   ├── security/
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── CustomUserDetailsService.java
│   │   │   │   └── UserPrincipal.java
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   └── [DTOs for each module]
│   │   │   │
│   │   │   ├── enums/
│   │   │   │   ├── Role.java
│   │   │   │   ├── AppointmentStatus.java
│   │   │   │   ├── BloodGroup.java
│   │   │   │   └── [other enums]
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── UnauthorizedException.java
│   │   │   │
│   │   │   └── util/
│   │   │       ├── AppConstants.java
│   │   │       ├── DateUtils.java
│   │   │       └── FileUtils.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── messages/
│   │       │   ├── messages_en.properties
│   │       │   ├── messages_hi.properties
│   │       │   └── messages_te.properties
│   │       ├── db/migration/
│   │       │   └── V1__init_schema.sql
│   │       ├── static/
│   │       │   ├── css/
│   │       │   │   ├── claymorphism.css  ← Global UI styles
│   │       │   │   └── main.css
│   │       │   ├── js/
│   │       │   │   ├── main.js
│   │       │   │   └── gps-tracker.js
│   │       │   └── images/
│   │       └── templates/
│   │           ├── layout/
│   │           │   ├── base.html
│   │           │   ├── navbar.html
│   │           │   └── sidebar.html
│   │           ├── auth/
│   │           │   ├── login.html
│   │           │   └── register.html
│   │           ├── admin/
│   │           ├── doctor/
│   │           ├── patient/
│   │           ├── blood-bank/
│   │           ├── organ-donor/
│   │           ├── ambulance/
│   │           ├── pharmacy/
│   │           ├── lab/
│   │           └── billing/
```
