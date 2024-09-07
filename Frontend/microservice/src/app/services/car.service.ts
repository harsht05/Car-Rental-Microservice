import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Car } from '../model/car';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private baseUrl = 'http://localhost:8080/api/cars';
  static getAllCars: any;

  constructor(private http: HttpClient, private authService: AuthGuardService) { }

  getAllCars(): Observable<Car[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });

    console.log("headers for get all cars url",headers);
    
    return this.http.get<Car[]>(`${this.baseUrl}/get-all-cars`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching cars:', error);
        return throwError(error); 
      })
    );
  }
  getCarById(id:number):Observable<Car>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });
    return this.http.get<Car>(`${this.baseUrl}/get-single-car/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching cars:', error);
        return throwError(error); 
      })
    );  }

    saveCar(car:Car):Observable<Car>{
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authService.getAccessToken()}`
      });
      return this.http.post<Car>(`${this.baseUrl}/save-car`, car,{ headers }).pipe(
        catchError((error) => {
          console.error('Error saving cars:', error);
          return throwError(error); 
        })
      );

    }
}
