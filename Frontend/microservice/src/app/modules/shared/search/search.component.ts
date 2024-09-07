import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../model/car';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  cars$: any;

  constructor(private searchService: SearchService, private carService: CarService,private sessionStorage:SessionStorageService,private router:Router) {}

  ngOnInit() {
    this.carService.getAllCars().subscribe(
      (response: Car[]) => {
        this.cars = response;
        console.log('Cars fetched', response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching cars:', error.message);
      }
    );

    this.searchService.searchData$.subscribe(data => {
      this.performSearch(data.searchTerm, data.selectedFilter);
    });
  }

  performSearch(searchTerm: string, selectedFilter: string) {
    if (searchTerm.trim() === '') {
      this.filteredCars = [];
      return;
    }

    this.filteredCars = this.cars.filter(car => {
      switch (selectedFilter) {
        case 'name':
          return car.name.toLowerCase().includes(searchTerm.toLowerCase());
        case 'address':
          return car.address.toLowerCase().includes(searchTerm.toLowerCase());
        case 'price':
          return car.price <= +searchTerm;
        case 'capacity':
          return car.capacity === +searchTerm;
        case 'type':
          return car.type.toLowerCase().includes(searchTerm.toLowerCase());
        case 'gear':
          return car.gear.toLowerCase().includes(searchTerm.toLowerCase());
        case 'mileage':
          return car.mileage <= +searchTerm;
        default:
          return false;
      }
    });
  }
  viewCar(carId:number) {
    console.log('Navigating to car dashboard with car ID:', carId);

    this.sessionStorage.setItem("carId", carId)
    this.router.navigate(['/car']);
  }
}
