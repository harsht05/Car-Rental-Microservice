import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './modules/user/user-dashboard/user-dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthCallbackComponent } from './services/auth-callback.component';
import { CarDashboardComponent } from './modules/user/car-dashboard/car-dashboard.component';
import { LoginComponent } from './modules/user/login/login.component';
import { BookingComponent } from './modules/user/booking/booking.component';
import { ViewBookingComponent } from './modules/user/view-booking/view-booking.component';
import { ProfileComponent } from './modules/user/profile/profile.component';
import { UpdateBookingComponent } from './modules/user/update-booking/update-booking.component';
import { AllBookingsComponent } from './modules/admin/all-bookings/all-bookings.component';
import { AddCarComponent } from './modules/admin/add-car/add-car.component';
import { SearchComponent } from './modules/shared/search/search.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'login',
    component: LoginComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent , canActivate: [AuthGuardService]
  },
 
  {
    path: 'user',
    component: UserDashboardComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'car',
    component: CarDashboardComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'booking',
    component: BookingComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'viewBooking',
    component: ViewBookingComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'update-booking',
    component: UpdateBookingComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'allBookings',
    component: AllBookingsComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'addCars',
    component: AddCarComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'search',
    component: SearchComponent , canActivate: [AuthGuardService]
  },
  {
    path: 'login/oauth2/code/okta',
    component: AuthCallbackComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent 
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
