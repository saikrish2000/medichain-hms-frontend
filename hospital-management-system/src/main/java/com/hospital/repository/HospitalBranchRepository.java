package com.hospital.repository;

import com.hospital.entity.HospitalBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalBranchRepository extends JpaRepository<HospitalBranch, Long> {
    List<HospitalBranch> findByIsActive(Boolean isActive);
    boolean existsByCode(String code);
    long countByIsActive(Boolean isActive);
}
