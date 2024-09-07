import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CarDashboardComponent } from './car-dashboard/car-dashboard.component';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './booking/booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewBookingComponent } from './view-booking/view-booking.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateBookingComponent } from './update-booking/update-booking.component';



@NgModule({
  declarations: [
    UserDashboardComponent,
    CarDashboardComponent,
    LoginComponent,
    BookingComponent,
    ViewBookingComponent,
    ProfileComponent,
    UpdateBookingComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
