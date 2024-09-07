package com.example.microservice.controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.microservice.entity.BookingEntity;
import com.example.microservice.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    private Logger logger = LoggerFactory.getLogger(BookingController.class);

    
	@PreAuthorize("hasAuthority('Admin')")
    @GetMapping("/get-all-bookings")
    public List<BookingEntity> getAllBookings() {
        return bookingService.getAllBookings();
    }
	
	@PreAuthorize("hasAuthority('Admin') || hasAuthority('User') || hasAuthority('internal')")
    @GetMapping("/users/get-bookings-by-user/{userId}")
    public List<BookingEntity> getBookingsByUserId(@PathVariable String userId) {
		 logger.info("In getBookingsByUserId for user id: {}", userId);

        return bookingService.getBookingsByUserId(userId);
    }

	@PreAuthorize("hasAuthority('Admin') || hasAuthority('User') || hasAuthority('internal')")
    @GetMapping("/cars/get-bookings-by-car/{carId}")
    public List<BookingEntity> getBookingsByCarId(@PathVariable Long carId) {
        return bookingService.getBookingsByCarId(carId);
    }
	@PreAuthorize("hasAuthority('Admin') || hasAuthority('User')")
    @GetMapping("/get-single-booking/{id}")
    public ResponseEntity<BookingEntity> getBookingById(@PathVariable Long id) {
        Optional<BookingEntity> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

	@PreAuthorize("hasAuthority('User')")
    @PostMapping("/save-booking")
    public BookingEntity createBooking(@RequestBody BookingEntity booking) {
        return bookingService.createBooking(booking);
    }

	@PreAuthorize("hasAuthority('User')")
    @PutMapping("/update-booking/{id}")
    public ResponseEntity<BookingEntity> updateBooking(@PathVariable Long id, @RequestBody BookingEntity bookingDetails) {
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDetails));
    }

	@PreAuthorize("hasAuthority('User')")
    @PutMapping("/cancel-booking/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id,@RequestBody Boolean blockValue) {
        try {
   		 logger.info("In cancelbooking for user id: {}", id);

			bookingService.deleteBooking(id,blockValue);
		} catch (Exception e) {
			e.printStackTrace();
		}
        return ResponseEntity.noContent().build();
    }
}
