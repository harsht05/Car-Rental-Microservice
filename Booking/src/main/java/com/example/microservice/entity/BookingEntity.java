package com.example.microservice.entity;


import java.time.LocalTime;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingEntity {
	 @Id
	    @GeneratedValue(strategy = GenerationType.AUTO)
	    private Long bookingId;

	    private String userId;
	    private Long carId;
	    private double amount;
	    private Date pickUpDate;
	    private Date dropOffDate;
	    private String pickUpLocation;
	    private String dropOffLocation;
	    private LocalTime pickUpTime;
	    private LocalTime dropOffTime;
		private Boolean isBlocked = false;


}
