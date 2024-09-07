package com.example.microservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.microservice.entity.CarEntity;

public interface CarRepository extends JpaRepository<CarEntity, Long> {

}
