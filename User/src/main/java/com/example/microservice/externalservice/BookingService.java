package com.example.microservice.externalservice;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.example.microservice.entitiy.Booking;
import com.example.microservice.entitiy.Car;

@FeignClient(name="BOOKING-SERVICE")
public interface BookingService {

	
	@PostMapping("api/bookings/save-booking")
	public ResponseEntity<Booking> saveBooking(Booking values);
	
	@PutMapping("api/bookings/update-booking/{bookingId}")
	public ResponseEntity<Booking> updateBooking(@PathVariable Long bookingId,Booking booking);
	
	@DeleteMapping("api/bookings/delete-booking/{bookingId}")
	public void deleteBooking(@PathVariable Long bookingId);
	
	@GetMapping("api/bookings/users/get-bookings-by-user/{userId}")
	Booking booking(@PathVariable String userId); 
}
