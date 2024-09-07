import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Booking } from '../../../model/booking';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent implements OnInit {

  bookings: Booking[] = [];

  constructor(private bookingService: BookingService, private sessionStorage: SessionStorageService, private router: Router) { }

  ngOnInit() {
    const userId = this.sessionStorage.getItem('userId');
    this.fetchBookingDetails(userId);
  }

  fetchBookingDetails(userId: string) {
    this.bookingService.getBookingbyUserId(userId).subscribe(
      (response: Booking[]) => {
        this.bookings = response;
        this.updateBookingStatus();
        console.log('Bookings fetched', response);
      },
      (error: HttpErrorResponse) => {
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

  deleteHandler(bookingId: number, booking: Booking) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel Booking!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookingService.deleteBooking(bookingId, !booking.isBlocked).subscribe(
          () => {
            booking.isBlocked = !booking.isBlocked;
            Swal.fire({
              title: 'Cancelled!',
              text: 'Your Booking has been Cancelled.',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
            });
          },
          (error) => {
            console.error('Error deleting booking:', error);
          }
        );
      }
    });
    
  
  }

  updateHandler(booking: Booking) {
    this.sessionStorage.setItem('currentBooking', JSON.stringify(booking));
    this.router.navigate(['/update-booking']);
  }
}
