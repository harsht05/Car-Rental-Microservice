import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule for mocking HTTP requests
import { of, throwError } from 'rxjs'; // Import of and throwError from RxJS
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CarService } from '../../../services/car.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { LoginComponent } from '../../user/login/login.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { UserDashboardComponent } from '../../user/user-dashboard/user-dashboard.component';
import { CarDashboardComponent } from '../../user/car-dashboard/car-dashboard.component';
import { BookingComponent } from '../../user/booking/booking.component';
import { ViewBookingComponent } from '../../user/view-booking/view-booking.component';
import { ProfileComponent } from '../../user/profile/profile.component';
import { UpdateBookingComponent } from '../../user/update-booking/update-booking.component';
import { AllBookingsComponent } from '../all-bookings/all-bookings.component';
import { AddCarComponent } from '../add-car/add-car.component';
import { SearchComponent } from '../../shared/search/search.component';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { OAuthService } from 'angular-oauth2-oidc';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockCarService: jasmine.SpyObj<CarService>;
  const routes: Routes = [
    {
      path: '',
      component: HomepageComponent
    },
    {
      path: 'login',
      component: LoginComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'admin',
      component: AdminDashboardComponent, canActivate: [AuthGuardService]
    },

    {
      path: 'user',
      component: UserDashboardComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'car',
      component: CarDashboardComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'booking',
      component: BookingComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'viewBooking',
      component: ViewBookingComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'profile',
      component: ProfileComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'update-booking',
      component: UpdateBookingComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'allBookings',
      component: AllBookingsComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'addCars',
      component: AddCarComponent, canActivate: [AuthGuardService]
    },
    {
      path: 'search',
      component: SearchComponent, canActivate: [AuthGuardService]
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
    mockCarService = jasmine.createSpyObj('CarService', ['getAllCars']);

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [
        RouterModule.forRoot(routes),
        SharedModule
      ],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: CarService, useValue: mockCarService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cars on ngOnInit', () => {
    const mockCars = [
      { id: 1, name: 'Car A', mileage: 10, address: 'Address A', price: 2000, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg' },
      { id: 2, name: 'Car B', mileage: 12, address: 'Address B', price: 2500, capacity: 7, type: 'Sedan', gear: 'Automatic', carImg: 'car2.jpg' }
    ];
    mockCarService.getAllCars.and.returnValue(of(mockCars));

    fixture.detectChanges();

    expect(component.cars).toEqual(mockCars);
  });

  it('should handle error when fetching cars', () => {
    const errorMessage = 'Error fetching cars';
    mockCarService.getAllCars.and.returnValue(throwError(new HttpErrorResponse({ error: errorMessage })));

    fixture.detectChanges();

    expect(component.cars.length).toBe(0);
    expect(component['error']).toBe(errorMessage);
  });

});
