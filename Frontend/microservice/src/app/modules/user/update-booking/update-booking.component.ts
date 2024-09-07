import { Component } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../model/booking';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Car } from '../../../model/car';
import { CarService } from '../../../services/car.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrl: './update-booking.component.css'
})
export class UpdateBookingComponent {
  bookingForm: FormGroup;
  userId: string = '';
  carId: number = 0;
  car: Car | undefined;
  pricePerDay: number = 0;
  currentBooking: Booking;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private carService: CarService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      bookingId: [0, Validators.required],
      userId: ['', Validators.required],
      carId: [0, Validators.required],
      amount: [{ value: 0, disabled: true }, Validators.required],
      pickUpDate: [null, Validators.required],
      dropOffDate: [null, Validators.required],
      pickUpLocation: ['', Validators.required],
      dropOffLocation: ['', Validators.required],
      pickUpTime:[null,Validators.required],
      dropOffTime:[null,Validators.required],
    });

    this.currentBooking = new Booking(0, '', 0, 0, new Date() , new Date(), '', '',{ hours: 0, minutes: 0 }, { hours: 0, minutes: 0 } );
  }

  ngOnInit(): void {
    this.userId = this.sessionStorage.getItem('userId') || '';
    const storedBooking = this.sessionStorage.getItem('currentBooking');
    if (storedBooking) {
      this.currentBooking = JSON.parse(storedBooking);
      console.log(this.currentBooking,"CURRRENT BOOKING")
      this.bookingForm.patchValue(this.currentBooking);
    } else {
      console.error('No booking found in session storage.');
      return;
    }

    this.carId = this.currentBooking.carId;
    this.carService.getCarById(this.carId).subscribe(
      (car: Car) => {
        this.car = car;
        this.pricePerDay = car.price;
        this.updateAmount();
        this.bookingForm.patchValue({
          userId: this.userId,
          carId: this.carId
        });
      },
      (error: any) => {
        console.error('Error fetching car details:', error);
      }
    );

    this.bookingForm.get('pickUpDate')?.valueChanges.subscribe(() => this.updateAmount());
    this.bookingForm.get('dropOffDate')?.valueChanges.subscribe(() => this.updateAmount());
  }

  updateAmount(): void {
    const pickUpDateValue = this.bookingForm.get('pickUpDate')?.value;
    const dropOffDateValue = this.bookingForm.get('dropOffDate')?.value;

    const pickUpDate = pickUpDateValue instanceof Date ? pickUpDateValue : new Date(pickUpDateValue);
    const dropOffDate = dropOffDateValue instanceof Date ? dropOffDateValue : new Date(dropOffDateValue);

    if (!isNaN(pickUpDate.getTime()) && !isNaN(dropOffDate.getTime()) && dropOffDate > pickUpDate) {
      const diffTime = Math.abs(dropOffDate.getTime() - pickUpDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const amount = diffDays * this.pricePerDay;

      this.bookingForm.patchValue({ amount }, { emitEvent: false });
    } 
    else if(!isNaN(pickUpDate.getTime()) && !isNaN(dropOffDate.getTime()) && dropOffDate.getTime() == pickUpDate.getTime()){
      const diffTime = Math.abs(dropOffDate.getTime() - pickUpDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const amount = diffDays * this.pricePerDay;

      this.bookingForm.patchValue({ amount }, { emitEvent: false });
    }
    else {
      this.bookingForm.patchValue({ amount: 0 }, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const booking: Booking = { ...this.bookingForm.value, amount: this.bookingForm.get('amount')?.value };
      this.bookingService.updateBooking(booking).subscribe(
        (data: Booking) => {
          console.log('Booking updated', data);
          Swal.fire({
            title: 'Are you sure?',
            text: "You want to Update!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel!',
          }).then((result) => {
            if (result.value) {
              Swal.fire(
                'Updated!',
                'Your Booking has been Updated.',
                'success'
              );
              this.bookingForm.reset();
               this.router.navigate(['/user']);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire('Cancelled', 'Your Booking is safe :)', 'error');
            }
          });          
        },
        (error: any) => {
          console.error('Error updating booking:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  cancel(): void {
    this.router.navigate(['/user']);
  }

  updateBooking(booking:number){
    this.bookingForm.addControl.apply

  }
}