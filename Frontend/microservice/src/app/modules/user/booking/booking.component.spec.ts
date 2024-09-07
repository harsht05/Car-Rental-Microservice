import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { of } from 'rxjs';
import { BookingComponent } from './booking.component';
import { BookingService } from '../../../services/booking.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../model/car';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { AdminDashboardComponent } from '../../admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { CarDashboardComponent } from '../car-dashboard/car-dashboard.component';
import { ViewBookingComponent } from '../view-booking/view-booking.component';
import { ProfileComponent } from '../profile/profile.component';
import { UpdateBookingComponent } from '../update-booking/update-booking.component';
import { AllBookingsComponent } from '../../admin/all-bookings/all-bookings.component';
import { AddCarComponent } from '../../admin/add-car/add-car.component';
import { SearchComponent } from '../../shared/search/search.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { SharedModule } from '../../shared/shared.module';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../model/booking';



describe('BookingComponent', () => {
  let router: Router;
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;
  let carService: jasmine.SpyObj<CarService>;

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

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', ['saveBooking']);
    const sessionStorageSpy = jasmine.createSpyObj('SessionStorageService', ['getItem', 'setItem']);
    const carServiceSpy = jasmine.createSpyObj('CarService', ['getCarById']);

    await TestBed.configureTestingModule({
      declarations: [BookingComponent],
      imports: [
        RouterModule.forRoot(routes),
        SharedModule,
        CommonModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: OAuthService, useValue: {} },
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: SessionStorageService, useValue: sessionStorageSpy },
        { provide: CarService, useValue: carServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    sessionStorageService = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
    carService = TestBed.inject(CarService) as jasmine.SpyObj<CarService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    bookingService.saveBooking.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component with session data and car details', () => {
    sessionStorageService.getItem.withArgs('userId').and.returnValue('mockUserId');
    sessionStorageService.getItem.withArgs('carId').and.returnValue(1); 

    const mockCar: Car = {
      id: 1,
      name: 'Test Car',
      price: 50,
      address: 'Test Address',
      type: '',
      mileage: 0,
      capacity: 0,
      gear: '',
      carImg: ''
    };
    carService.getCarById.and.returnValue(of(mockCar));

    component.ngOnInit();

    expect(component.userId).toEqual('mockUserId');
    expect(component.carId).toEqual(1);

    fixture.detectChanges();

    expect(component.bookingForm.get('userId')?.value).toEqual('mockUserId');
    expect(component.bookingForm.get('carId')?.value).toEqual(1);
    expect(component.bookingForm.get('pickUpLocation')?.value).toEqual('Test Address');
    expect(component.bookingForm.get('dropOffLocation')?.value).toEqual('Test Address');
    expect(component.pricePerDay).toEqual(50); 
  });

  it('should validate required fields', () => {
    const bookingForm = component.bookingForm;
    bookingForm.setValue({
      bookingId: 1, pickUpLocation: 'Location A', dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'), dropOffDate: new Date('2024-07-27'), dropOffAtDifferentLocation: false,
      pickUpTime: { hours: 10, minutes: 0 }, dropOffTime: { hours: 15, minutes: 0 }, amount: 100, isBlocked: false, status: 'UpComing',
      userId: '',
      carId: 1
    });

    expect(bookingForm.valid).toBe(false);

    Object.keys(bookingForm.controls).forEach(key => {
      bookingForm.get(key)?.setValue('');
      expect(bookingForm.valid).toBe(false);
    });
  });

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

  it('should handle onDifferentLocationChange', () => {
    component.car = { id: 1,
      name: 'Test Car',
      price: 50,
      address: 'Car Address',
      type: '',
      mileage: 0,
      capacity: 0,
      gear: '',
      carImg: ''}; // Mock car data
    component.bookingForm.get('dropOffAtDifferentLocation')?.setValue(true);

    component.onDifferentLocationChange();
    fixture.detectChanges();

    expect(component.bookingForm.get('dropOffLocation')?.enabled).toBeTrue();
    expect(component.bookingForm.get('dropOffLocation')?.value).toBe('');

    component.bookingForm.get('dropOffAtDifferentLocation')?.setValue(false);
    component.onDifferentLocationChange();
    fixture.detectChanges();

    expect(component.bookingForm.get('dropOffLocation')?.disabled).toBeTrue();
    expect(component.bookingForm.get('dropOffLocation')?.value).toBe('Car Address');
  });

  it('should submit booking form', fakeAsync(() => {
    component.bookingForm.patchValue({
      bookingId: 1,
      userId: 'mockUserId',
      carId: 1,
      amount: 100,
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      isBlocked: false,
      status: 'UpComing'
    });

    fixture.detectChanges();

    const saveBookingSpy = spyOn(bookingService, 'saveBooking').and.returnValue(
      of({
        bookingId: 1,
        userId: 'mockUserId', 
        carId: 1,
        amount: 1000,
        pickUpDate: new Date('2024-07-25'),
        dropOffDate: new Date('2024-07-27'),
        pickUpLocation: 'Location A',
        dropOffLocation: 'Location B',
        pickUpTime: { hours: 10, minutes: 0 },
        dropOffTime: { hours: 15, minutes: 0 },
        isBlocked: false,
        status: 'UpComing'
      } as Booking)
    );

    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));

    component.onSubmit();

    expect(saveBookingSpy).toHaveBeenCalledOnceWith({
      bookingId: 1,
      userId: 'mockUserId',
      carId: 1,
      amount: 1000,
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 15, minutes: 0 },
      isBlocked: false,
      status: 'UpComing'
    });

    tick();
    expect(navigateSpy).toHaveBeenCalledWith(['/user']);
  }));

  it('should handle form submission with invalid form', () => {
    spyOn(console, 'error');
    component.onSubmit();
    expect(console.error).toHaveBeenCalledWith('Form is invalid');
    expect(bookingService.saveBooking).not.toHaveBeenCalled();
  });
});
