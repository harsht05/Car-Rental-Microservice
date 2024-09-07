package com.example.microservice.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.microservice.entity.BookingEntity;
import com.example.microservice.repository.BookingRepository;

@Service
public class BookingService {

	 @Autowired
	    private BookingRepository bookingRepository;

	    public List<BookingEntity> getAllBookings() {
	        return bookingRepository.findAll();
	    }

	    public Optional<BookingEntity> getBookingById(Long id) {
	        return bookingRepository.findById(id);
	    }

	    public List<BookingEntity> getBookingsByUserId(String userId) {
	        return bookingRepository.findByUserId(userId);
	    }

	    public List<BookingEntity> getBookingsByCarId(Long carId) {
	        return bookingRepository.findByCarId(carId);
	    }
	    public BookingEntity createBooking(BookingEntity booking) {
	        return bookingRepository.save(booking);
	    }

	    public BookingEntity updateBooking(Long id, BookingEntity bookingDetails) {
	        BookingEntity booking = bookingRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Booking not found"));

	        booking.setUserId(bookingDetails.getUserId());
	        booking.setCarId(bookingDetails.getCarId());
	        booking.setPickUpLocation(bookingDetails.getPickUpLocation());
	        booking.setDropOffLocation(bookingDetails.getDropOffLocation());
	        booking.setPickUpDate(bookingDetails.getPickUpDate());
	        booking.setDropOffDate(bookingDetails.getDropOffDate());
	        booking.setPickUpTime(bookingDetails.getPickUpTime());
	        booking.setDropOffTime(bookingDetails.getDropOffTime());
	        booking.setAmount(bookingDetails.getAmount());

	        return bookingRepository.save(booking);
	    }

	    public void deleteBooking(Long id,Boolean block) throws Exception{
	    	Optional<BookingEntity> bookingOptional=bookingRepository.findById(id);
	    	if(bookingOptional.isPresent()) {
	    		BookingEntity booking = bookingOptional.get();
	    		booking.setIsBlocked(block);
	    		
	    		bookingRepository.save(booking);
	    		
	    	}
	    	else {
	            throw new Exception("Booking not found with ID: " + id);
	        }
	    }

		
}
