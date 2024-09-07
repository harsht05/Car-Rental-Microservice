import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { Booking } from '../../../model/booking';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-all-bookings',
  templateUrl: './all-bookings.component.html',
  styleUrls: ['./all-bookings.component.css']
})
export class AllBookingsComponent implements OnInit {
  [x: string]: any;

  bookings: Booking[] = [];

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit() {
    this.fetchAllBookings();
  }

  fetchAllBookings() {
    this.bookingService.getAllBooking().subscribe(
      (response: Booking[]) => {
        this.bookings = response;
        this.updateBookingStatus(); 
        console.log('Bookings fetched', response);
      },
      (error: HttpErrorResponse) => {
        this['error'] = 'Error fetching bookings'; 
        console.error('Error fetching bookings:', error.message);
      }
    );
  }

  updateBookingStatus() {
    const currentDate = new Date();

    this.bookings.forEach(booking => {
        const dropOffDate = new Date(booking.dropOffDate);

        const dropOffTime: string = booking.dropOffTime.toString(); 

        const [hours, minutes, seconds] = dropOffTime.split(':').map(Number);

        dropOffDate.setHours(hours, minutes, seconds);

        console.log("Current date:", currentDate);
        console.log("Drop off date:", dropOffDate);

        if (currentDate > dropOffDate) {
            booking.status = 'Completed';
        } else if (currentDate >= new Date(booking.pickUpDate)) {
            booking.status = 'On Going';
        } else {
            booking.status = 'UpComing';
        }
    });
  }
}
