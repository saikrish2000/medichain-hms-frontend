package com.hospital.repository;

import com.hospital.entity.BloodInventory;
import com.hospital.enums.BloodGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    Optional<BloodInventory> findByBankIdAndBloodGroup(Long bankId, BloodGroup bloodGroup);

    @Query("SELECT COALESCE(SUM(b.availableUnits), 0) FROM BloodInventory b")
    Optional<Long> sumTotalUnits();
}
