import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root',
})
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';
  baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage,
  ) {}

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getTrip(tripCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tripCode}`);
  }

  addTrip(trip: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, trip);
  }

  updateTrip(trip: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${trip.code}`, trip);
  }

  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    const formData = new URLSearchParams();
    formData.set('name', user.name);
    formData.set('email', user.email);
    formData.set('password', passwd);
    return this.http.post<AuthResponse>(this.baseUrl + '/' + endpoint, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }
}
