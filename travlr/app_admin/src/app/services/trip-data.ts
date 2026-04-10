import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripDataService {
  private apiUrl = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

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
}
