import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateBookingComponent } from './update-booking.component';
import { BookingService } from '../../../services/booking.service';
import { CarService } from '../../../services/car.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Booking } from '../../../model/booking';
import { SharedModule } from '../../shared/shared.module';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { AdminDashboardComponent } from '../../admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { CarDashboardComponent } from '../car-dashboard/car-dashboard.component';
import { BookingComponent } from '../booking/booking.component';
import { ProfileComponent } from '../profile/profile.component';
import { AllBookingsComponent } from '../../admin/all-bookings/all-bookings.component';
import { AddCarComponent } from '../../admin/add-car/add-car.component';
import { SearchComponent } from '../../shared/search/search.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { ViewBookingComponent } from '../view-booking/view-booking.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { Car } from '../../../model/car';

describe('UpdateBookingComponent', () => {
  let component: UpdateBookingComponent;
  let fixture: ComponentFixture<UpdateBookingComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let carService: jasmine.SpyObj<CarService>;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;
  let router: Router;

  const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'car', component: CarDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'booking', component: BookingComponent, canActivate: [AuthGuardService] },
    { path: 'viewBooking', component: ViewBookingComponent, canActivate: [AuthGuardService] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
    { path: 'update-booking', component: UpdateBookingComponent, canActivate: [AuthGuardService] },
    { path: 'allBookings', component: AllBookingsComponent, canActivate: [AuthGuardService] },
    { path: 'addCars', component: AddCarComponent, canActivate: [AuthGuardService] },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuardService] },
    { path: 'login/oauth2/code/okta', component: AuthCallbackComponent },
    { path: '**', component: PageNotFoundComponent }
  ];

  beforeEach(waitForAsync(() => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', ['getBookingbyUserId', 'updateBooking']);
    const carServiceSpy = jasmine.createSpyObj('CarService', ['getCarById']);
    const sessionStorageSpy = jasmine.createSpyObj('SessionStorageService', ['getItem', 'setItem']);
  
    TestBed.configureTestingModule({
      declarations: [UpdateBookingComponent],
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        SharedModule
      ],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: CarService, useValue: carServiceSpy },
        { provide: SessionStorageService, useValue: sessionStorageSpy }
      ]
    }).compileComponents();
  
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    carService = TestBed.inject(CarService) as jasmine.SpyObj<CarService>;
    sessionStorageService = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
    router = TestBed.inject(Router);
  
    fixture = TestBed.createComponent(UpdateBookingComponent);
    component = fixture.componentInstance;
  
    fixture.detectChanges();
  }));
  

  afterEach(() => {
    sessionStorageService.getItem.calls.reset();
    sessionStorageService.setItem.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values and then patch with data from session storage', fakeAsync(() => {
    // Mock data
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25T10:00:00Z'),
      dropOffDate: new Date('2024-07-27T15:00:00Z'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: 'user123',
      carId: 1
    };

    const mockCar: Car = {
      id: 1,
      name: 'Car A',
      mileage: 10,
      address: 'Address A',
      price: 2000,
      capacity: 5,
      type: 'SUV',
      gear: 'Manual',
      carImg: 'car1.jpg'
    };

    // Mock sessionStorageService
    sessionStorageService.getItem.and.callFake((key: string) => {
      if (key === 'currentBooking') {
        return JSON.stringify(mockBooking);
      }
      if (key === 'userId') {
        return 'user123';
      }
      return null;
    });

    // Mock carService
    carService.getCarById.and.returnValue(of(mockCar));

    fixture.detectChanges(); // Triggers ngOnInit

    tick(); // Simulates the passage of time for async operations
    fixture.detectChanges(); // Updates the DOM

    // Check initial default values
    expect(component.bookingForm.get('bookingId')?.value).toBe(0);
    expect(component.bookingForm.get('userId')?.value).toBe('');
    expect(component.bookingForm.get('carId')?.value).toBe(0);
    expect(component.bookingForm.get('amount')?.value).toBe(0);
    expect(component.bookingForm.get('pickUpDate')?.value).toBeNull();
    expect(component.bookingForm.get('dropOffDate')?.value).toBeNull();
    expect(component.bookingForm.get('pickUpLocation')?.value).toBe('');
    expect(component.bookingForm.get('dropOffLocation')?.value).toBe('');
    expect(component.bookingForm.get('pickUpTime')?.value).toBeNull();
    expect(component.bookingForm.get('dropOffTime')?.value).toBeNull();

    // Check patched values
    expect(component.bookingForm.get('bookingId')?.value).toBe(mockBooking.bookingId);
    expect(component.bookingForm.get('userId')?.value).toBe(mockBooking.userId);
    expect(component.bookingForm.get('carId')?.value).toBe(mockBooking.carId);
    expect(component.bookingForm.get('amount')?.value).toBe(mockBooking.amount);
    expect(component.bookingForm.get('pickUpDate')?.value).toEqual(mockBooking.pickUpDate);
    expect(component.bookingForm.get('dropOffDate')?.value).toEqual(mockBooking.dropOffDate);
    expect(component.bookingForm.get('pickUpLocation')?.value).toBe(mockBooking.pickUpLocation);
    expect(component.bookingForm.get('dropOffLocation')?.value).toBe(mockBooking.dropOffLocation);
    expect(component.bookingForm.get('pickUpTime')?.value).toEqual(mockBooking.pickUpTime);
    expect(component.bookingForm.get('dropOffTime')?.value).toEqual(mockBooking.dropOffTime);

    // Check car details
    expect(component.car).toEqual(mockCar);
    expect(component.pricePerDay).toBe(mockCar.price);
  }));

  it('should handle errors when fetching car details', fakeAsync(() => {
    // Mock data
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25T10:00:00Z'),
      dropOffDate: new Date('2024-07-27T15:00:00Z'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: 'user123',
      carId: 1
    };

    // Mock sessionStorageService
    sessionStorageService.getItem.and.callFake((key: string) => {
      if (key === 'currentBooking') {
        return JSON.stringify(mockBooking);
      }
      if (key === 'userId') {
        return 'user123';
      }
      return null;
    });

    // Mock carService to throw error
    carService.getCarById.and.returnValue(throwError(() => new Error('Error fetching car details')));

    fixture.detectChanges(); // Triggers ngOnInit

    tick(); // Simulates the passage of time for async operations
    fixture.detectChanges(); // Updates the DOM

    // Check if the error is handled and logged correctly
    expect(component.car).toBeUndefined();
    expect(component.pricePerDay).toBe(0); // Ensure that pricePerDay is set to its default value
  }));
  it('should update amount based on date changes', fakeAsync(() => {
    component.pricePerDay = 50;

    component.bookingForm.patchValue({
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27')
    });

    component.updateAmount();
    tick(); // Simulate passage of time for async operations
    fixture.detectChanges(); // Update the DOM

    expect(component.bookingForm.get('amount')?.value).toBe(150);

    component.bookingForm.patchValue({
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-25')
    });

    component.updateAmount();
    tick(); // Simulate passage of time for async operations
    fixture.detectChanges(); // Update the DOM

    expect(component.bookingForm.get('amount')?.value).toBe(50);
  }));

  it('should set amount to 0 when dates are invalid', fakeAsync(() => {
    component.pricePerDay = 50;

    component.bookingForm.patchValue({
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-20') // Invalid drop-off date
    });

    component.updateAmount();
    tick(); // Simulate passage of time for async operations
    fixture.detectChanges(); // Update the DOM

    expect(component.bookingForm.get('amount')?.value).toBe(0);
  }));

  it('should call onSubmit when form is submitted', () => {
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: '',
      carId: 1
    };

    bookingService.updateBooking.and.returnValue(of(mockBooking));

    component.bookingForm.setValue({
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      amount: 100,
      userId: '',
      carId: 1
    });

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(bookingService.updateBooking).toHaveBeenCalled();
  });

  
  it('should navigate to view booking page on successful update', fakeAsync(() => {
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: '',
      carId: 1
    };

    bookingService.updateBooking.and.returnValue(of(mockBooking));

    component.bookingForm.setValue({
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      amount: 100,
      userId: '',
      carId: 1
    });

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    tick(); // Simulate passage of time for async operations
    fixture.detectChanges(); // Update the DOM

    expect(router.url).toBe('/viewBooking');
  }));
});
