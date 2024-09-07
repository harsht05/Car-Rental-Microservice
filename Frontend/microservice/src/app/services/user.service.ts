import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  
  login(headers: HttpHeaders): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/login`, { headers });
  }
  
}
