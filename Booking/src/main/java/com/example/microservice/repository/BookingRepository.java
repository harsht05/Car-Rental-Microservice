package com.example.microservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.microservice.entity.BookingEntity;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

	List<BookingEntity> findByUserId(String userId);
    List<BookingEntity> findByCarId(Long carId);
}
