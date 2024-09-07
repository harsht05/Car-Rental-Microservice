import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../model/booking';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Car } from '../../../model/car';
import { CarService } from '../../../services/car.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  userId: string = '';
  carId: number = 0;
  car: Car | undefined;
  pricePerDay: number = 0;
  currDate: Date = new Date();
  futureDate: string = ''; 

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private carService: CarService,
    private sessionStorage: SessionStorageService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      bookingId: [0],
      userId: ['', Validators.required],
      carId: [0, Validators.required],
      amount: [{ value: 0, disabled: true }, Validators.required],
      pickUpDate: [null, Validators.required],
      dropOffDate: [null, Validators.required],
      pickUpLocation: ['', Validators.required],
      dropOffLocation: ['', Validators.required],
      pickUpTime:[null,Validators.required],
      dropOffTime:[null,Validators.required],
      dropOffAtDifferentLocation: [false],
      isBlocked: [false],
      status:[''],
    });
  }

  ngOnInit(): void {
    // Initialize userId and carId
    this.userId = this.sessionStorage.getItem('userId') || '';
    this.carId = Number(this.sessionStorage.getItem('carId')) || 0;
  
    // Set futureDate
    const futureDateObj = new Date();
    futureDateObj.setMonth(futureDateObj.getMonth() + 3);
    this.futureDate = futureDateObj.toISOString().split('T')[0];
  
    // Fetch car details
    if (this.carId !== 0) {
      this.carService.getCarById(this.carId).subscribe(
        (car: Car) => {
          this.car = car;
          this.pricePerDay = car.price;
          console.log('Car address:', car.address);
          this.updateAmount();
          this.bookingForm.patchValue({
            userId: this.userId,
            carId: this.carId,
            pickUpLocation: car.address,
            dropOffLocation: car.address
          });
        },
        (error: any) => {
          console.error('Error fetching car details:', error);
          // Handle error here, e.g., show an error message or set default values
        }
      );
    } else {
      console.error('Invalid carId:', this.carId);
      // Handle the case where carId is not valid
    }
  
    // Subscribe to form value changes
    this.bookingForm.get('pickUpDate')?.valueChanges.subscribe(() => this.updateAmount());
    this.bookingForm.get('dropOffDate')?.valueChanges.subscribe(() => this.updateAmount());
  }
  

  onDifferentLocationChange(): void {
    const dropOffAtDifferentLocation = this.bookingForm.get('dropOffAtDifferentLocation')?.value;
    const dropOffLocationControl = this.bookingForm.get('dropOffLocation');
    
    console.log('Checkbox state:', dropOffAtDifferentLocation); 
    if (dropOffAtDifferentLocation) {
      dropOffLocationControl?.enable();
      dropOffLocationControl?.setValue('');
      console.log('Drop-off location enabled and set to empty'); 
    } else {
      dropOffLocationControl?.disable();
      dropOffLocationControl?.setValue(this.car?.address || '');
      console.log('Drop-off location disabled and reset to:', this.car?.address || ''); // Log reset value
    }
  }

  updateAmount(): void {
    const pickUpDateValue = this.bookingForm.get('pickUpDate')?.value;
    const dropOffDateValue = this.bookingForm.get('dropOffDate')?.value;

    const pickUpDate = pickUpDateValue instanceof Date ? pickUpDateValue : new Date(pickUpDateValue);
    const dropOffDate = dropOffDateValue instanceof Date ? dropOffDateValue : new Date(dropOffDateValue);

    if (!isNaN(pickUpDate.getTime()) && !isNaN(dropOffDate.getTime()) && dropOffDate >= pickUpDate) {
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
      this.bookingService.saveBooking(booking).subscribe(
        (data: Booking) => {
          console.log('Booking saved', data);
          Swal.fire('Thank you...', 'Booking successfully!', 'success');
          this.bookingForm.reset({
            bookingId: 0,
            userId: '',
            carId: 0,
            amount: 0,
            pickUpDate: null,
            dropOffDate: null,
            pickUpLocation: '',
            dropOffLocation: '',
            pickUpTime: null,
            dropOffTime: null,
            dropOffAtDifferentLocation: false
          });
    
          this.router.navigate(['/user']);
        },
        (error: any) => {
          console.error('Error saving booking:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
