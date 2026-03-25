package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.enums.BloodGroup;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BloodBankService {

    private final BloodBankRepository     bankRepo;
    private final BloodInventoryRepository inventoryRepo;
    private final BloodRequestRepository  requestRepo;
    private final BloodDonationRepository donationRepo;
    private final UserRepository          userRepo;

    @Transactional
    public BloodInventory updateStock(Long bankId, BloodGroup group, int units) {
        BloodInventory inv = inventoryRepo.findByBankIdAndBloodGroup(bankId, group)
            .orElseGet(() -> {
                BloodInventory i = new BloodInventory();
                BloodBank bank = bankRepo.findById(bankId)
                    .orElseThrow(() -> new ResourceNotFoundException("BloodBank","id",bankId));
                i.setBank(bank);
                i.setBloodGroup(group);
                i.setAvailableUnits(0);
                return i;
            });
        inv.setAvailableUnits(inv.getAvailableUnits() + units);
        return inventoryRepo.save(inv);
    }

    @Transactional
    public BloodInventory setStock(Long bankId, BloodGroup group, int units, int threshold) {
        BloodInventory inv = inventoryRepo.findByBankIdAndBloodGroup(bankId, group)
            .orElseGet(() -> {
                BloodInventory i = new BloodInventory();
                BloodBank bank = bankRepo.findById(bankId)
                    .orElseThrow(() -> new ResourceNotFoundException("BloodBank","id",bankId));
                i.setBank(bank);
                i.setBloodGroup(group);
                return i;
            });
        inv.setAvailableUnits(units);
        inv.setMinimumThreshold(threshold);
        return inventoryRepo.save(inv);
    }

    @Transactional
    public BloodRequest createRequest(Long bankId, Long userId, BloodGroup group,
                                      int units, String urgency, String reason) {
        BloodBank bank = bankRepo.findById(bankId)
            .orElseThrow(() -> new ResourceNotFoundException("BloodBank","id",bankId));
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));

        BloodRequest req = new BloodRequest();
        req.setBank(bank);
        req.setRequestedBy(user);
        req.setBloodGroup(group);
        req.setUnitsRequested(units);
        req.setUrgencyLevel(urgency);
        req.setReason(reason);
        req.setStatus(BloodRequest.RequestStatus.PENDING);
        req.setCreatedAt(LocalDateTime.now());
        return requestRepo.save(req);
    }

    @Transactional
    public void approveRequest(Long requestId, int unitsApproved, Long reviewerUserId) {
        BloodRequest req = requestRepo.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException("BloodRequest","id",requestId));
        User reviewer = userRepo.findById(reviewerUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User","id",reviewerUserId));

        BloodInventory inv = inventoryRepo.findByBankIdAndBloodGroup(
            req.getBank().getId(), req.getBloodGroup())
            .orElseThrow(() -> new BadRequestException("No inventory record found"));
        if (inv.getAvailableUnits() < unitsApproved)
            throw new BadRequestException("Insufficient stock: only "+inv.getAvailableUnits()+" units available");

        inv.setAvailableUnits(inv.getAvailableUnits() - unitsApproved);
        inventoryRepo.save(inv);

        req.setStatus(BloodRequest.RequestStatus.APPROVED);
        req.setUnitsApproved(unitsApproved);
        req.setReviewedBy(reviewer);
        req.setReviewedAt(LocalDateTime.now());
        requestRepo.save(req);
    }

    @Transactional
    public void rejectRequest(Long requestId, String reason, Long reviewerUserId) {
        BloodRequest req = requestRepo.findById(requestId)
            .orElseThrow(() -> new ResourceNotFoundException("BloodRequest","id",requestId));
        User reviewer = userRepo.findById(reviewerUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User","id",reviewerUserId));
        req.setStatus(BloodRequest.RequestStatus.REJECTED);
        req.setRejectionReason(reason);
        req.setReviewedBy(reviewer);
        req.setReviewedAt(LocalDateTime.now());
        requestRepo.save(req);
    }

    @Transactional
    public BloodDonation registerDonation(Long bankId, Long donorUserId,
                                          BloodGroup group, int units) {
        BloodBank bank = bankRepo.findById(bankId)
            .orElseThrow(() -> new ResourceNotFoundException("BloodBank","id",bankId));
        User donor = userRepo.findById(donorUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User","id",donorUserId));
        BloodDonation donation = new BloodDonation();
        donation.setBank(bank);
        donation.setDonor(donor);
        donation.setBloodGroup(group);
        donation.setUnitsCollected(units);
        donation.setStatus(BloodDonation.DonationStatus.PENDING);
        donation.setDonationDate(LocalDateTime.now());
        return donationRepo.save(donation);
    }

    @Transactional
    public void acceptDonation(Long donationId, Long screenerId) {
        BloodDonation donation = donationRepo.findById(donationId)
            .orElseThrow(() -> new ResourceNotFoundException("BloodDonation","id",donationId));
        donation.setStatus(BloodDonation.DonationStatus.ACCEPTED);
        donationRepo.save(donation);
        updateStock(donation.getBank().getId(), donation.getBloodGroup(),
            donation.getUnitsCollected());
    }

    public BloodRequest getRequest(Long id) {
        return requestRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("BloodRequest","id",id));
    }
}
