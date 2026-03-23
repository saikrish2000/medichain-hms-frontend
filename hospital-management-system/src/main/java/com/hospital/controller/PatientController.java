package com.hospital.controller;

import com.hospital.entity.*;
import com.hospital.repository.*;
import com.hospital.security.UserPrincipal;
import com.hospital.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.concurrent.atomic.AtomicLong;

@Controller
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository    patientRepo;
    private final UserRepository       userRepo;
    private final AppointmentService   appointmentService;
    private final MedicalRecordService recordService;

    private static final AtomicLong PATIENT_SEQ = new AtomicLong(10000);

    // ── DASHBOARD ──────────────────────────────────────────
    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal UserPrincipal user, Model model) {
        Patient patient = patientRepo.findByUserId(user.getId()).orElse(null);
        if (patient == null) return "redirect:/patient/complete-profile";

        model.addAttribute("patient",      patient);
        model.addAttribute("appointments", appointmentService.getPatientAppointments(patient.getId(), 0));
        model.addAttribute("recentRecords", recordService.getPatientRecords(patient.getId(), 0).getContent());
        model.addAttribute("nextAppointment", appointmentService.getNextAppointment(patient.getId()));
        return "patient/dashboard";
    }

    // ── COMPLETE PROFILE ───────────────────────────────────
    @GetMapping("/complete-profile")
    public String completeProfile(Model model) {
        model.addAttribute("patient", new Patient());
        return "patient/complete-profile";
    }

    @PostMapping("/profile/save")
    public String saveProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                              @RequestParam(required = false) String address,
                              @RequestParam(required = false) String city,
                              @RequestParam(required = false) String state,
                              @RequestParam(required = false) String pincode,
                              @RequestParam(required = false) String emergencyContactName,
                              @RequestParam(required = false) String emergencyContactPhone,
                              @RequestParam(required = false) String emergencyContactRelation,
                              @RequestParam(required = false) String allergies,
                              @RequestParam(required = false) String chronicConditions,
                              @RequestParam(required = false) String insuranceProvider,
                              @RequestParam(required = false) String insurancePolicyNumber,
                              RedirectAttributes ra) {
        User user = userRepo.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if profile already exists, else create
        Patient patient = patientRepo.findByUserId(userPrincipal.getId()).orElseGet(() -> {
            Patient p = new Patient();
            p.setUser(user);
            p.setPatientIdNumber("PAT-" + String.format("%06d", PATIENT_SEQ.getAndIncrement()));
            return p;
        });

        patient.setAddress(address);
        patient.setCity(city);
        patient.setState(state);
        patient.setPincode(pincode);
        patient.setEmergencyContactName(emergencyContactName);
        patient.setEmergencyContactPhone(emergencyContactPhone);
        patient.setEmergencyContactRelation(emergencyContactRelation);
        patient.setAllergies(allergies);
        patient.setChronicConditions(chronicConditions);
        patient.setInsuranceProvider(insuranceProvider);
        patient.setInsurancePolicyNumber(insurancePolicyNumber);

        patientRepo.save(patient);
        ra.addFlashAttribute("success", "Profile saved successfully!");
        return "redirect:/patient/dashboard";
    }

    // ── PROFILE VIEW ───────────────────────────────────────
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal UserPrincipal user, Model model) {
        Patient patient = patientRepo.findByUserId(user.getId())
            .orElse(null);
        if (patient == null) return "redirect:/patient/complete-profile";
        model.addAttribute("patient", patient);
        return "patient/profile";
    }

    // ── MEDICAL RECORDS ────────────────────────────────────
    @GetMapping("/records")
    public String records(@AuthenticationPrincipal UserPrincipal user,
                          @RequestParam(defaultValue = "0") int page, Model model) {
        Patient patient = patientRepo.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        model.addAttribute("records", recordService.getPatientRecords(patient.getId(), page));
        model.addAttribute("patient", patient);
        return "patient/records";
    }

    @GetMapping("/records/{id}")
    public String recordDetail(@PathVariable Long id, Model model) {
        model.addAttribute("record", recordService.getRecord(id));
        return "patient/record-detail";
    }

    // ── VITALS ─────────────────────────────────────────────
    @GetMapping("/vitals")
    public String vitals(@AuthenticationPrincipal UserPrincipal user, Model model) {
        Patient patient = patientRepo.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        model.addAttribute("records", recordService.getPatientRecords(patient.getId(), 0).getContent());
        return "patient/vitals";
    }

    // ── OTHER STUBS ────────────────────────────────────────
    @GetMapping("/labs")     public String labs(Model m)      { return "patient/labs"; }
    @GetMapping("/adherence") public String adherence(Model m) { return "patient/adherence"; }
    @GetMapping("/wearables") public String wearables(Model m) { return "patient/wearables"; }
}
