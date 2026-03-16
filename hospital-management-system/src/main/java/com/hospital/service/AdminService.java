package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.entity.Doctor.ApprovalStatus;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import com.hospital.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository           userRepository;
    private final DoctorRepository         doctorRepository;
    private final NurseRepository          nurseRepository;
    private final PatientRepository        patientRepository;
    private final DepartmentRepository     departmentRepository;
    private final SpecializationRepository specializationRepository;
    private final HospitalBranchRepository branchRepository;
    private final NotificationService      notificationService;
    private final AuditService             auditService;

    // ── DASHBOARD STATS ────────────────────────────────────
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalDoctors",      doctorRepository.countByApprovalStatus(ApprovalStatus.APPROVED));
        stats.put("pendingDoctors",    doctorRepository.countByApprovalStatus(ApprovalStatus.PENDING));
        stats.put("totalNurses",       nurseRepository.countByApprovalStatus(Nurse.ApprovalStatus.APPROVED));
        stats.put("pendingNurses",     nurseRepository.countByApprovalStatus(Nurse.ApprovalStatus.PENDING));
        stats.put("totalPatients",     patientRepository.count());
        stats.put("totalBranches",     branchRepository.countByIsActive(true));
        stats.put("totalDepartments",  departmentRepository.countByIsActive(true));

        // Recent pending approvals
        stats.put("pendingDoctorList",
            doctorRepository.findByApprovalStatus(ApprovalStatus.PENDING,
                PageRequest.of(0, 5, Sort.by("createdAt").descending())).getContent());
        stats.put("pendingNurseList",
            nurseRepository.findByApprovalStatus(Nurse.ApprovalStatus.PENDING,
                PageRequest.of(0, 5, Sort.by("createdAt").descending())).getContent());
        return stats;
    }

    // ── DOCTOR APPROVALS ───────────────────────────────────
    public Page<Doctor> getPendingDoctors(int page) {
        return doctorRepository.findByApprovalStatus(
            ApprovalStatus.PENDING,
            PageRequest.of(page, 10, Sort.by("createdAt").descending()));
    }

    public Page<Doctor> getAllDoctors(String search, int page) {
        if (search != null && !search.isBlank())
            return doctorRepository.search(search,
                PageRequest.of(page, 10, Sort.by("createdAt").descending()));
        return doctorRepository.findAll(
            PageRequest.of(page, 10, Sort.by("createdAt").descending()));
    }

    @Transactional
    public void approveDoctor(Long doctorId, UserPrincipal admin) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        if (doctor.getApprovalStatus() == ApprovalStatus.APPROVED)
            throw new BadRequestException("Doctor is already approved.");

        User adminUser = userRepository.findById(admin.getId()).orElseThrow();
        doctor.setApprovalStatus(ApprovalStatus.APPROVED);
        doctor.setApprovedBy(adminUser);
        doctor.setApprovedAt(LocalDateTime.now());
        doctor.setRejectionReason(null);
        doctor.getUser().setIsVerified(true);
        doctorRepository.save(doctor);

        notificationService.sendApprovalNotification(
            doctor.getUser().getEmail(),
            doctor.getUser().getFullName(),
            "Doctor");
        auditService.log(admin.getId(), admin.getUsername(),
            "APPROVE_DOCTOR", "Doctor", doctorId, null, "SUCCESS");
    }

    @Transactional
    public void rejectDoctor(Long doctorId, String reason, UserPrincipal admin) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        doctor.setApprovalStatus(ApprovalStatus.REJECTED);
        doctor.setRejectionReason(reason);
        doctorRepository.save(doctor);

        notificationService.sendRejectionNotification(
            doctor.getUser().getEmail(),
            doctor.getUser().getFullName(), reason);
        auditService.log(admin.getId(), admin.getUsername(),
            "REJECT_DOCTOR", "Doctor", doctorId, null, "SUCCESS");
    }

    @Transactional
    public void suspendDoctor(Long doctorId, String reason, UserPrincipal admin) {
        Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));
        doctor.setApprovalStatus(ApprovalStatus.SUSPENDED);
        doctor.setRejectionReason(reason);
        doctorRepository.save(doctor);
        auditService.log(admin.getId(), admin.getUsername(),
            "SUSPEND_DOCTOR", "Doctor", doctorId, null, "SUCCESS");
    }

    // ── NURSE APPROVALS ────────────────────────────────────
    public Page<Nurse> getPendingNurses(int page) {
        return nurseRepository.findByApprovalStatus(
            Nurse.ApprovalStatus.PENDING,
            PageRequest.of(page, 10, Sort.by("createdAt").descending()));
    }

    @Transactional
    public void approveNurse(Long nurseId, UserPrincipal admin) {
        Nurse nurse = nurseRepository.findById(nurseId)
            .orElseThrow(() -> new ResourceNotFoundException("Nurse", "id", nurseId));

        User adminUser = userRepository.findById(admin.getId()).orElseThrow();
        nurse.setApprovalStatus(Nurse.ApprovalStatus.APPROVED);
        nurse.setApprovedBy(adminUser);
        nurse.setApprovedAt(LocalDateTime.now());
        nurse.getUser().setIsVerified(true);
        nurseRepository.save(nurse);

        notificationService.sendApprovalNotification(
            nurse.getUser().getEmail(), nurse.getUser().getFullName(), "Nurse");
        auditService.log(admin.getId(), admin.getUsername(),
            "APPROVE_NURSE", "Nurse", nurseId, null, "SUCCESS");
    }

    @Transactional
    public void rejectNurse(Long nurseId, String reason, UserPrincipal admin) {
        Nurse nurse = nurseRepository.findById(nurseId)
            .orElseThrow(() -> new ResourceNotFoundException("Nurse", "id", nurseId));
        nurse.setApprovalStatus(Nurse.ApprovalStatus.REJECTED);
        nurse.setRejectionReason(reason);
        nurseRepository.save(nurse);
        notificationService.sendRejectionNotification(
            nurse.getUser().getEmail(), nurse.getUser().getFullName(), reason);
    }

    // ── DEPARTMENTS ────────────────────────────────────────
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll(Sort.by("name"));
    }

    @Transactional
    public Department createDepartment(Department dept) {
        return departmentRepository.save(dept);
    }

    @Transactional
    public Department updateDepartment(Long id, Department updated) {
        Department dept = departmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        dept.setName(updated.getName());
        dept.setCode(updated.getCode());
        dept.setDescription(updated.getDescription());
        dept.setFloorNumber(updated.getFloorNumber());
        dept.setIsActive(updated.getIsActive());
        return departmentRepository.save(dept);
    }

    // ── SPECIALIZATIONS ────────────────────────────────────
    public List<Specialization> getAllSpecializations() {
        return specializationRepository.findAll(Sort.by("name"));
    }

    @Transactional
    public Specialization createSpecialization(Specialization spec) {
        return specializationRepository.save(spec);
    }

    // ── BRANCHES ──────────────────────────────────────────
    public List<HospitalBranch> getAllBranches() {
        return branchRepository.findAll(Sort.by("name"));
    }

    @Transactional
    public HospitalBranch createBranch(HospitalBranch branch) {
        if (branchRepository.existsByCode(branch.getCode()))
            throw new BadRequestException("Branch code already exists.");
        return branchRepository.save(branch);
    }

    // ── USERS MANAGEMENT ──────────────────────────────────
    public Page<User> getAllUsers(int page) {
        return userRepository.findAll(
            PageRequest.of(page, 15, Sort.by("createdAt").descending()));
    }

    @Transactional
    public void toggleUserStatus(Long userId, UserPrincipal admin) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        auditService.log(admin.getId(), admin.getUsername(),
            user.getIsActive() ? "ACTIVATE_USER" : "DEACTIVATE_USER",
            "User", userId, null, "SUCCESS");
    }
}
