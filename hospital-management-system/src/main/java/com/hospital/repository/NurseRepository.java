package com.hospital.repository;

import com.hospital.entity.Nurse;
import com.hospital.entity.Nurse.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NurseRepository extends JpaRepository<Nurse, Long> {
    Optional<Nurse> findByUserId(Long userId);
    List<Nurse>     findByApprovalStatus(ApprovalStatus status);
    Page<Nurse>     findByApprovalStatus(ApprovalStatus status, Pageable pageable);
    long            countByApprovalStatus(ApprovalStatus status);
    List<Nurse>     findByDepartmentId(Long departmentId);
}
