import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ViewBookingComponent } from './view-booking.component';
import { BookingService } from '../../../services/booking.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Booking } from '../../../model/booking';
import { of, throwError } from 'rxjs';
import Swal, { SweetAlertResult, SweetAlertOptions } from 'sweetalert2';
import { Router, RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { AdminDashboardComponent } from '../../admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { CarDashboardComponent } from '../car-dashboard/car-dashboard.component';
import { BookingComponent } from '../booking/booking.component';
import { ProfileComponent } from '../profile/profile.component';
import { UpdateBookingComponent } from '../update-booking/update-booking.component';
import { AllBookingsComponent } from '../../admin/all-bookings/all-bookings.component';
import { AddCarComponent } from '../../admin/add-car/add-car.component';
import { SearchComponent } from '../../shared/search/search.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { SharedModule } from '../../shared/shared.module';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpErrorResponse } from '@angular/common/http';

describe('ViewBookingComponent', () => {
  let component: ViewBookingComponent;
  let fixture: ComponentFixture<ViewBookingComponent>;
  let bookingService: jasmine.SpyObj<BookingService>;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;
  let router: Router;
  let swalSpy: jasmine.Spy;

  const routes: Routes = [
    // Your routes configuration
  ];

  beforeEach(async () => {
    const bookingServiceSpy = jasmine.createSpyObj('BookingService', ['getBookingbyUserId', 'deleteBooking']);
    const sessionStorageSpy = jasmine.createSpyObj('SessionStorageService', ['getItem', 'setItem']);

    await TestBed.configureTestingModule({
      declarations: [ViewBookingComponent],
      imports: [
        RouterModule.forRoot(routes),
        SharedModule
      ],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: BookingService, useValue: bookingServiceSpy },
        { provide: SessionStorageService, useValue: sessionStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewBookingComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<BookingService>;
    sessionStorageService = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
    router = TestBed.inject(Router);


    // Adjusting the spy to correctly match Swal.fire's signatures
    swalSpy = spyOn(Swal, 'fire').and.callFake((...args: any[]) => {
      if (args.length === 1 && typeof args[0] === 'object') {
        const options = args[0] as SweetAlertOptions;
        
        if (options.title === 'Are you sure?') {
          return Promise.resolve({
            isConfirmed: false,
            isDenied: false,
            isDismissed: true,
            value: { dismiss: Swal.DismissReason.cancel }
          } as SweetAlertResult);
        } else if (options.title === 'Cancelled!') {
          return Promise.resolve({
            isConfirmed: true,
            isDenied: false,
            isDismissed: false,
            value: { title: 'Cancelled!', text: 'Your Booking has been Cancelled.', icon: 'success' }
          } as SweetAlertResult);
        }
      } else if (args.length === 3 && typeof args[0] === 'string') {
        const [title, text, icon] = args;
        if (title === 'Are you sure?') {
          return Promise.resolve({
            isConfirmed: false,
            isDenied: false,
            isDismissed: true,
            value: { dismiss: Swal.DismissReason.cancel }
          } as SweetAlertResult);
        } else if (title === 'Cancelled!') {
          return Promise.resolve({
            isConfirmed: true,
            isDenied: false,
            isDismissed: false,
            value: { title: 'Cancelled!', text: 'Your Booking has been Cancelled.', icon: 'success' }
          } as SweetAlertResult);
        }
      }
    
      return Promise.resolve({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true
      } as SweetAlertResult);
    });
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch booking details on initialization', fakeAsync(() => {
    const userId = 'testUserId';
    const mockBookings: Booking[] = [
      // Your mock bookings data
    ];

    sessionStorageService.getItem.and.returnValue(userId);
    bookingService.getBookingbyUserId.and.returnValue(of(mockBookings));

    component.ngOnInit();
    tick();

    expect(bookingService.getBookingbyUserId).toHaveBeenCalledWith(userId);
    expect(component.bookings).toEqual(mockBookings);
  }));
  it('should handle error when fetching booking details fails', fakeAsync(() => {
    const userId = 'testUserId';
    const errorResponse = new HttpErrorResponse({
      error: 'Error fetching bookings',
      status: 500,
      statusText: 'Server Error'
    });
  
    spyOn(console, 'error'); // Spy on console.error
    sessionStorageService.getItem.and.returnValue(userId);
    bookingService.getBookingbyUserId.and.returnValue(throwError(() => errorResponse));
  
    component.ngOnInit();
    tick(); // Simulate the passage of time
  
    // Ensure that the console.error was called with the expected error message
    expect(console.error).toHaveBeenCalledWith('Error fetching bookings:', 'Http failure response for (unknown url): 500 Server Error');
    
    // Verify that the bookings array is empty or remains unchanged
    expect(component.bookings).toEqual([]);
  }));
  

  it('should update booking status correctly', () => {
    const mockBookings: Booking[] = [
      {
        bookingId: 1,
        pickUpLocation: 'Location A',
        dropOffLocation: 'Location B',
        pickUpDate: new Date('2024-07-25'),
        dropOffDate: new Date('2024-07-31'),
        pickUpTime: { hours: 10, minutes: 0 },
        dropOffTime: { hours: 12, minutes: 0 },
        amount: 100,
        isBlocked: false,
        status: 'UpComing',
        userId: '',
        carId: 1
      },
      {
        bookingId: 2,
        pickUpLocation: 'Location C',
        dropOffLocation: 'Location D',
        pickUpDate: new Date('2024-07-20'),
        dropOffDate: new Date('2024-07-22'),
        pickUpTime: { hours: 10, minutes: 0 },
        dropOffTime: { hours: 12, minutes: 0 },
        amount: 150,
        isBlocked: false,
        status: 'UpComing',
        userId: '',
        carId: 2
      }
    ];
  
    component.bookings = mockBookings;
  
    const currentDate = new Date('2024-07-23');
    spyOn(Date, 'now').and.returnValue(currentDate.getTime());
  
    component.updateBookingStatus();
  
    expect(component.bookings[0].status).toBe('On Going'); 
    expect(component.bookings[1].status).toBe('On Going');  
  });
  
  it('should handle booking deletion and show appropriate messages', fakeAsync(() => {
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 12, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: '',
      carId: 1
    };

    component.bookings = [mockBooking];

    // Case 1: Successful deletion
    bookingService.deleteBooking.and.returnValue(of()); // Simulate successful response

    // Mock confirmation dialog to be successful
    swalSpy.and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    } as SweetAlertResult));

    component.deleteHandler(mockBooking.bookingId, mockBooking);
    tick(); // Simulate passage of time for asynchronous operations

    expect(bookingService.deleteBooking).toHaveBeenCalledWith(mockBooking.bookingId, !mockBooking.isBlocked);

    const updatedBooking = component.bookings.find(b => b.bookingId === mockBooking.bookingId);
    expect(updatedBooking?.isBlocked).toBeTrue(); // Expect isBlocked to be toggled to true

    expect(swalSpy).toHaveBeenCalledWith({
      title: 'Cancelled!',
      text: 'Your Booking has been Cancelled.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK'
    });
  }));

  it('should handle booking deletion and show appropriate messages on failure', fakeAsync(() => {
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 12, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: '',
      carId: 1
    };

    // Case 2: Deletion fails
    const errorResponse = new HttpErrorResponse({
      error: 'Error deleting booking',
      status: 500,
      statusText: 'Server Error'
    });
    bookingService.deleteBooking.and.returnValue(throwError(() => errorResponse));

    // Mock confirmation dialog to be successful
    swalSpy.and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    } as SweetAlertResult));

    component.deleteHandler(mockBooking.bookingId, mockBooking);
    tick(); // Simulate passage of time for asynchronous operations

    expect(console.error).toHaveBeenCalledWith('Error deleting booking:', 'Http failure response for (unknown url): 500 Server Error');
  }));


  

  it('should update session storage and navigate on updateHandler call', fakeAsync(() => {
    const mockBooking: Booking = {
      bookingId: 1,
      pickUpLocation: 'Location A',
      dropOffLocation: 'Location B',
      pickUpDate: new Date('2024-07-25'),
      dropOffDate: new Date('2024-07-27'),
      pickUpTime: { hours: 10, minutes: 0 },
      dropOffTime: { hours: 12, minutes: 0 },
      amount: 100,
      isBlocked: false,
      status: 'UpComing',
      userId: '',
      carId: 1
    };

    const navigateSpy = spyOn(router, 'navigate');

    component.updateHandler(mockBooking);
    tick();

    expect(sessionStorageService.setItem).toHaveBeenCalledWith('currentBooking', JSON.stringify(mockBooking));
    expect(navigateSpy).toHaveBeenCalledWith(['/update-booking']);
  }));
});
