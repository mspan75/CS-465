import { Routes } from '@angular/router';
import { TripListingComponent } from './trip-listing/trip-listing';
import { AddTrip } from './add-trip/add-trip';
import { EditTrip } from './edit-trip/edit-trip';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  { path: 'add-trip', component: AddTrip },
  { path: 'edit-trip', component: EditTrip },
  { path: 'login', component: LoginComponent },
  { path: '', component: TripListingComponent, pathMatch: 'full' },
];
