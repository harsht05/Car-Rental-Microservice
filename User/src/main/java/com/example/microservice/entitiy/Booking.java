package com.example.microservice.entitiy;

import java.time.LocalTime;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

	private Long bookingId;
	private String userId;
	private Long carId;
	private Double amount;
	private Car car;
	private Date pickUpDate;
	private Date dropOffDate;
	private String pickUpLocation;
	private String dropOffLocation;
	private LocalTime pickUpTime;
    private LocalTime dropOffTime;
	private Boolean isBlocked = false;


}
