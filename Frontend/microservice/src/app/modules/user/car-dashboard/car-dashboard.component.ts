import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { BookingService } from '../../../services/booking.service';
import { Car } from '../../../model/car';
import { Booking } from '../../../model/booking';
import { Subscription } from 'rxjs';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
  selector: 'app-car-dashboard',
  templateUrl: './car-dashboard.component.html',
  styleUrls: ['./car-dashboard.component.css']
})
export class CarDashboardComponent implements OnInit{
  cars: Car | undefined;
  bookings: Booking | undefined;
  userId: string = '';
  private routeSubscription: Subscription | undefined;
  carId: number=0;

  constructor(
    private carService: CarService,
    private route: ActivatedRoute,
    private sessionStorage:SessionStorageService,
    private router:Router
  ) {}

  ngOnInit() {
    console.log('CarDashboardComponent initialized');
   
      this.carId= this.sessionStorage.getItem('carId')
      this.userId = this.sessionStorage.getItem('userId');
      console.log('User ID from session:', this.userId);

      if (this.carId) {
        this.fetchCarDetails(this.carId);
      } else {
        console.error('Missing carId or userId');
      }
    
  }

  fetchCarDetails(carId: number) {
    this.carService.getCarById(carId).subscribe(
      (data: Car) => {
        this.cars = data;
        console.log('Car fetched:', data);
      },
      (error) => {
        console.error('Error fetching car details:', error);
      }
    );
  }

 

 bookCar(carId: number, userId: string) {
   this.router.navigate(['booking'])
 }
}
