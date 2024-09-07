package com.example.microservice.externalservice;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.microservice.entitiy.Car;

@FeignClient(name="CAR-SERVICE")
public interface CarService {

	@GetMapping("api/cars/get-single-car/{carId}")
	Car getCar(@PathVariable Long carId); 
	
	
}
