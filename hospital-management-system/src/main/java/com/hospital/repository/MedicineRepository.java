package com.hospital.repository;

import com.hospital.entity.Medicine;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%',:q,'%')) " +
           "OR LOWER(m.genericName) LIKE LOWER(CONCAT('%',:q,'%'))")
    Page<Medicine> search(@Param("q") String q, Pageable pageable);

    @Query("SELECT m FROM Medicine m WHERE m.currentStock <= m.reorderLevel")
    List<Medicine> findLowStock();

    @Query("SELECT COUNT(m) FROM Medicine m WHERE m.currentStock <= m.reorderLevel")
    long countLowStock();
}
