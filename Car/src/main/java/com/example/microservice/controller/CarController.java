package com.example.microservice.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.microservice.entity.CarEntity;
import com.example.microservice.exception.CarException;
import com.example.microservice.service.CarService;

@RestController
@RequestMapping("/api/cars")
public class CarController {

	@Autowired
	private CarService carService;

	@PreAuthorize("hasAuthority('Admin') || hasAuthority('User')")
	@GetMapping("/get-all-cars")
	public List<CarEntity> getAllCars() {
		return carService.getAllCars();
	}

	@PreAuthorize("hasAuthority('Admin') || hasAuthority('User')")
	@GetMapping("/get-single-car/{id}")
	public ResponseEntity<?> getCarById(@PathVariable Long id) {
		CarEntity car = carService.getCarById(id);

		if (car != null) {
			return ResponseEntity.ok(car);
			} else {
				return ResponseEntity.notFound().build();
			}
	}

	@PreAuthorize("hasAuthority('Admin')")
	@PostMapping("/save-car")
	public CarEntity createCar(@RequestBody CarEntity car) {
		return carService.createCar(car);
	}
	
	@PreAuthorize("hasAuthority('Admin')")
	@PutMapping("/update-car/{id}")
	public ResponseEntity<CarEntity> updateCar(@PathVariable Long id, @RequestBody CarEntity carDetails) {
		return ResponseEntity.ok(carService.updateCar(id, carDetails));
	}

	@PreAuthorize("hasAuthority('Admin')")
	@DeleteMapping("/delete-car/{id}")
	public ResponseEntity<String> deleteCar(@PathVariable Long id) {
		boolean deleted = carService.deleteCar(id);
		if (deleted) {
			return ResponseEntity.ok("Successfully deleted car with ID: " + id);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}