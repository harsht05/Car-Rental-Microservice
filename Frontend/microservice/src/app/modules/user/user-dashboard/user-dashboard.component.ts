import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { Router } from '@angular/router';
import { Car } from '../../../model/car';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService, private router: Router,private sessionStorage:SessionStorageService) {}

  ngOnInit() {
    console.log('UserDashboardComponent initialized');
   
    this.carService.getAllCars().subscribe(
      (response: Car[]) => {
        this.cars = response;
        console.log('Cars fetched', response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching cars:', error.message);
      }
    );
  }

  viewCar(carId:number) {
    console.log('Navigating to car dashboard with car ID:', carId);

    this.sessionStorage.setItem("carId", carId)
    this.router.navigate(['/car']);
  }
}
