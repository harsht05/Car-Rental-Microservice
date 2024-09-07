package com.example.microservice.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.microservice.entitiy.Booking;
import com.example.microservice.entitiy.Car;
import com.example.microservice.entitiy.UserEntity;
import com.example.microservice.exception.UserException;
import com.example.microservice.externalservice.CarService;
import com.example.microservice.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RestTemplate restTemplate;
	@Autowired
	private CarService carService;

	private Logger logger = LoggerFactory.getLogger(UserService.class);

	public List<UserEntity> getAllUsers() {

		return userRepository.findAll();
	}

	public UserEntity getUserById(String id) {
		UserEntity user = userRepository.findByuserId(id)
				.orElseThrow(() -> new UserException("User not found with ID: " + id));

		Booking[] userBooking = restTemplate.getForObject(
				"http://BOOKING-SERVICE/api/bookings/users/get-bookings-by-user/" + user.getUserId(), Booking[].class);
		if (userBooking != null) {
			logger.info("Bookings for user {}: {}", user.getUserId(), Arrays.toString(userBooking));

			List<Booking> bookingList = Arrays.stream(userBooking).map(bookings -> {
				Car car = carService.getCar(bookings.getCarId());
				bookings.setCar(car);
				return bookings;
			}).collect(Collectors.toList());
			user.setBooking(bookingList);
		} else {
			logger.warn("No bookings found for user {}", user.getUserId());
		}

		return user;
	}

	

	public UserEntity updateUser(String id, UserEntity userDetails) {
		UserEntity user = userRepository.findByuserId(id)
				.orElseThrow(() -> new UserException("User not found with ID: " + id));
		user.setUsername(userDetails.getUsername());
		user.setEmail(userDetails.getEmail());
		user.setAddress(userDetails.getAddress());
		return userRepository.save(user);
	}

	public void deleteUser(String userId) {
		if (!userRepository.existsByuserId(userId)) {
			throw new UserException("Car not found with ID: " + userId);
		}
		userRepository.deleteByuserId(userId);
	}
	

    public boolean isNewUser(String userId) {
        return !userRepository.existsByuserId(userId);
    }

    public void createUser(String userId, String username, String address, String email, List<String> roles) {
        UserEntity newUser = new UserEntity();
        newUser.setUserId(userId);
        newUser.setUsername(username);
        newUser.setAddress(address);
        newUser.setEmail(email);
        newUser.setRoles(String.join(",", roles)); 
        userRepository.save(newUser);
    }


	
}
