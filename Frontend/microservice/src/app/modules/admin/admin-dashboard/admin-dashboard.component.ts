import { Component } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { Router } from '@angular/router';
import { Car } from '../../../model/car';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  [x: string]: any;
  cars: Car[] = [];

  constructor(private carService:CarService,private router:Router){}

  ngOnInit(){
    this.carService.getAllCars().subscribe(
      (response: Car[]) => {
        this.cars = response;
        console.log('Cars fetched', response);
      },
      (error: HttpErrorResponse) => {
        this['error'] = 'Error fetching cars'; 
        console.error('Error fetching cars:', error.message);
      }
    )
  }

}
