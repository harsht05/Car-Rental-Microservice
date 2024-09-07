import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Booking } from '../model/booking';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  
  private baseUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient, private authService: AuthGuardService) { }
  
  saveBooking(booking:Booking): Observable<Booking> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });


    
    return this.http.post<Booking>(`${this.baseUrl}/save-booking`, booking,{ headers}).pipe(
      catchError((error) => {
        console.error('Error saving booking:', error);
        return throwError(error); 
      })
    );
  }

  getBookingbyUserId(userId:string):Observable<Booking[]>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });

    return this.http.get<Booking[]>(`${this.baseUrl}/users/get-bookings-by-user/${userId}`,{headers}).pipe( catchError((error) => {
      console.error('Error getting booking:', error);
      return throwError(error); 
    }));

  }

  deleteBooking(bookingId:number,block:boolean):Observable<Booking[]>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });

    return this.http.put<Booking[]>(`${this.baseUrl}/cancel-booking/${bookingId}`,block, {headers}).pipe( catchError((error) => {
      console.error('Error cancelling booking:', error);
      return throwError(error); 
    }));
  }

  updateBooking(booking:Booking):Observable<Booking>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });

    return this.http.put<Booking>(`${this.baseUrl}/update-booking/${booking.bookingId}`, booking, { headers }).pipe( catchError((error) => {
      console.error('Error updating booking:', error);
      return throwError(error); 
    }));
  }

  getAllBooking():Observable<Booking[]>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getAccessToken()}`
    });

    return this.http.get<Booking[]>(`${this.baseUrl}/get-all-bookings`, { headers }).pipe( catchError((error) => {
      console.error('Error fetch all booking:', error);
      return throwError(error); 
    }));
  }
}
