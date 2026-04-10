import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TripCardComponent } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-trip-listing',
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListingComponent implements OnInit {
  trips = signal<any[]>([]);
  message = signal('');

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getTrips();
  }

  private getTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (foundTrips: any) => {
        this.trips.set(foundTrips);
        console.log('Trips loaded from API:', foundTrips);
      },
      error: (error: any) => {
        console.error('Error loading trips:', error);
        this.message.set('Error loading trips from server');
      },
    });
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }
}
