import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of ,  throwError} from 'rxjs';
import { AllBookingsComponent } from './all-bookings.component';
import { BookingService } from '../../../services/booking.service';
import { HttpErrorResponse } from '@angular/common/http';

import { SharedModule } from '../../shared/shared.module';
import { OAuthService } from 'angular-oauth2-oidc';
import { ViewBookingComponent } from '../../user/view-booking/view-booking.component';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { LoginComponent } from '../../user/login/login.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../../user/user-dashboard/user-dashboard.component';
import { CarDashboardComponent } from '../../user/car-dashboard/car-dashboard.component';
import { BookingComponent } from '../../user/booking/booking.component';
import { ProfileComponent } from '../../user/profile/profile.component';
import { UpdateBookingComponent } from '../../user/update-booking/update-booking.component';
import { AddCarComponent } from '../add-car/add-car.component';
import { SearchComponent } from '../../shared/search/search.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { RouterModule, Routes } from '@angular/router';

describe('AllBookingsComponent', () => {
  let component: AllBookingsComponent;
  let fixture: ComponentFixture<AllBookingsComponent>;
  let mockBookingService: jasmine.SpyObj<BookingService>;
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
  beforeEach(async () => {
    mockBookingService = jasmine.createSpyObj('BookingService', ['getAllBooking']);

    await TestBed.configureTestingModule({
      declarations: [AllBookingsComponent],
      imports: [
        RouterModule.forRoot(routes),
        SharedModule 
      ],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: BookingService, useValue: mockBookingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllBookingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all bookings on initialization', () => {
    const mockBookings = [
      {
        bookingId: 1, pickUpLocation: 'Location A', dropOffLocation: 'Location B',
        pickUpDate: new Date('2024-07-25'), dropOffDate: new Date('2024-07-27'),
        pickUpTime: { hours: 10, minutes: 0 }, dropOffTime: { hours: 15, minutes: 0 }, amount: 100, isBlocked: false, status: 'UpComing',
        userId: '',
        carId: 1
      },
      {
        bookingId: 2, pickUpLocation: 'Location C', dropOffLocation: 'Location D',
        pickUpDate: new Date('2024-07-26'), dropOffDate: new Date('2024-07-28'),
        pickUpTime: { hours: 10, minutes: 0 }, dropOffTime: { hours: 15, minutes: 0 }, amount: 150, isBlocked: true, status: 'Completed',
        userId: '',
        carId: 2
      }
    ];

    mockBookingService.getAllBooking.and.returnValue(of(mockBookings));

    fixture.detectChanges();

    expect(component.bookings).toEqual(mockBookings);
    expect(mockBookingService.getAllBooking).toHaveBeenCalled();
  });

  it('should update booking status correctly', () => {
    const currentDate = new Date();

    const mockBookings = [
      {
        bookingId: 1, pickUpLocation: 'Location A', dropOffLocation: 'Location B',
        pickUpDate: new Date('2024-07-25'), dropOffDate: new Date('2024-07-27'),
        pickUpTime: { hours: 10, minutes: 0 }, dropOffTime: { hours: 15, minutes: 0 }, amount: 100, isBlocked: false, status: 'UpComing',
        userId: '',
        carId: 1
      },
      {
        bookingId: 2, pickUpLocation: 'Location C', dropOffLocation: 'Location D',
        pickUpDate: new Date('2024-07-26'), dropOffDate: new Date('2024-07-28'),
        pickUpTime: { hours: 10, minutes: 0 }, dropOffTime: { hours: 15, minutes: 0 }, amount: 150, isBlocked: true, status: 'Completed',
        userId: '',
        carId: 2
      }
    ];

    mockBookingService.getAllBooking.and.returnValue(of(mockBookings));

    fixture.detectChanges();

    // Simulate updating the status
    component.updateBookingStatus();

    // Check that status has been updated correctly based on current date/time
    component.bookings.forEach(booking => {
      const dropOffDate = new Date(booking.dropOffDate);
      const dropOffTime: string = booking.dropOffTime.toString(); 
      const [hours, minutes, seconds] = dropOffTime.split(':').map(Number);
      dropOffDate.setHours(hours, minutes, seconds);

      if (currentDate > dropOffDate) {
        expect(booking.status).toEqual('Completed');
      } else if (currentDate >= new Date(booking.pickUpDate)) {
        expect(booking.status).toEqual('On Going');
      } else {
        expect(booking.status).toEqual('UpComing');
      }
    });
  });

  it('should handle error while fetching bookings', () => {
    const errorMessage = 'Error fetching bookings';
    mockBookingService.getAllBooking.and.returnValue(throwError(new HttpErrorResponse({ error: errorMessage })));

    fixture.detectChanges();

    expect(component.bookings.length).toBe(0); 
    expect(component['error']).toBe(errorMessage);
  });
});
