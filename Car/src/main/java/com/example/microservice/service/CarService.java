package com.example.microservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.microservice.entity.CarEntity;
import com.example.microservice.exception.CarException;
import com.example.microservice.repository.CarRepository;

@Service
public class CarService {
	

    @Autowired
    private CarRepository carRepository;

    public List<CarEntity> getAllCars() {
        return carRepository.findAll();
    }

    public CarEntity getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new CarException("Car not found with ID: " + id));
    }

    public CarEntity createCar(CarEntity car) {
        try {
            return carRepository.save(car);
        } catch (Exception e) {
            throw new CarException("Failed to create car: " + e.getMessage());
        }
    }

    public CarEntity updateCar(Long id, CarEntity carDetails) {
        CarEntity car = carRepository.findById(id)
                .orElseThrow(() -> new CarException("Car not found with ID: " + id));

        car.setName(carDetails.getName());
        car.setMileage(carDetails.getMileage());
        car.setPrice(carDetails.getPrice());
        car.setAddress(carDetails.getAddress());

        return carRepository.save(car);
    }

    public boolean deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new CarException("Car not found with ID: " + id);
        }
        carRepository.deleteById(id);
        return true; 
    }
}
