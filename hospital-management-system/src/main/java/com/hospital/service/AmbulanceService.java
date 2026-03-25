package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.entity.Ambulance.AmbulanceStatus;
import com.hospital.entity.AmbulanceCall.CallStatus;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmbulanceService {

    private final AmbulanceRepository     ambulanceRepo;
    private final AmbulanceCallRepository callRepo;

    @Transactional
    public Ambulance saveAmbulance(Ambulance ambulance) {
        return ambulanceRepo.save(ambulance);
    }

    @Transactional
    public void updateLocation(Long ambulanceId, Double lat, Double lng) {
        ambulanceRepo.findById(ambulanceId).ifPresent(a -> {
            a.setCurrentLatitude(lat);
            a.setCurrentLongitude(lng);
            a.setLastLocationUpdate(LocalDateTime.now());
            ambulanceRepo.save(a);
        });
    }

    @Transactional
    public AmbulanceCall requestAmbulance(String callerName, String callerPhone,
                                          String pickupAddress, String emergencyType) {
        List<Ambulance> available = ambulanceRepo.findByStatus(AmbulanceStatus.AVAILABLE);

        AmbulanceCall call = new AmbulanceCall();
        call.setCallerName(callerName);
        call.setCallerPhone(callerPhone);
        call.setPickupAddress(pickupAddress);
        call.setEmergencyType(emergencyType);
        call.setRequestTime(LocalDateTime.now());
        call.setStatus(CallStatus.REQUESTED);

        if (!available.isEmpty()) {
            Ambulance amb = available.get(0);
            amb.setStatus(AmbulanceStatus.DISPATCHED);
            ambulanceRepo.save(amb);
            call.setAmbulance(amb);
            call.setStatus(CallStatus.DISPATCHED);
            call.setDispatchedAt(LocalDateTime.now());
        }
        return callRepo.save(call);
    }

    @Transactional
    public AmbulanceCall updateCallStatus(Long callId, CallStatus newStatus) {
        AmbulanceCall call = callRepo.findById(callId)
            .orElseThrow(() -> new ResourceNotFoundException("AmbulanceCall","id",callId));
        call.setStatus(newStatus);
        if (newStatus == CallStatus.AT_SCENE)  call.setArrivedAt(LocalDateTime.now());
        if (newStatus == CallStatus.COMPLETED) {
            call.setCompletedAt(LocalDateTime.now());
            if (call.getAmbulance() != null) {
                call.getAmbulance().setStatus(AmbulanceStatus.AVAILABLE);
                ambulanceRepo.save(call.getAmbulance());
            }
        }
        return callRepo.save(call);
    }
}
