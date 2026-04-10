import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-card',
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCardComponent {
  @Input() trip: any;

  constructor(private router: Router) {}

  public editTrip(trip: any): void {
    console.log('Inside TripCardComponent::editTrip for ' + trip.code);
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }
}
