package com.example.microservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.microservice.entitiy.UserEntity;


public interface UserRepository extends JpaRepository<UserEntity, Long> {

	
    boolean existsByUsername(String username);

	boolean existsByuserId(String userId);

	void deleteByuserId(String userId);

	Optional<UserEntity> findByuserId(String id);
	

}
