import { TestBed } from '@angular/core/testing';

import { BookingService } from './booking.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthGuardService } from './auth-guard.service';
import { Booking } from '../model/booking';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;
  let authServiceStub: Partial<AuthGuardService>;

  beforeEach(() => {
    authServiceStub = {
      getAccessToken: () => 'mock_access_token'
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BookingService,
        { provide: AuthGuardService, useValue: authServiceStub }
      ]
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a booking', () => {
    const mockBooking: Booking ={ bookingId: 1,
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
      status: 'UpComing' };

    service.saveBooking(mockBooking).subscribe(savedBooking => {
      expect(savedBooking).toEqual(mockBooking);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/bookings/save-booking');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_access_token');
    req.flush(mockBooking);
  });

  it('should get bookings by user ID', () => {
    const userId = 'user1';
    const mockBookings: Booking[] = [
      { bookingId: 1,
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
        status: 'UpComing' },
      {bookingId: 2,
        userId: 'mockUserId',
        carId: 1,
        amount: 1000,
        pickUpDate: new Date('2024-07-25'),
        dropOffDate: new Date('2024-07-27'),
        pickUpLocation: 'Location C',
        dropOffLocation: 'Location B',
        pickUpTime: { hours: 10, minutes: 0 },
        dropOffTime: { hours: 15, minutes: 0 },
        isBlocked: false,
        status: 'UpComing' }
    ];

    service.getBookingbyUserId(userId).subscribe(bookings => {
      expect(bookings.length).toBe(2);
      expect(bookings).toEqual(mockBookings);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/bookings/users/get-bookings-by-user/${userId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_access_token');
    req.flush(mockBookings);
  });

  it('should delete a booking', () => {
    const bookingId = 1;
    const block = true;

    service.deleteBooking(bookingId, block).subscribe(response => {
      expect(response).toBeTruthy(); // Replace with appropriate expectation based on your API response
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/bookings/cancel-booking/${bookingId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_access_token');
    req.flush([]);
  });

  it('should update a booking', () => {
    const mockBooking: Booking = { bookingId: 1,
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
      status: 'UpComing' };

    service.updateBooking(mockBooking).subscribe(updatedBooking => {
      expect(updatedBooking).toEqual(mockBooking);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/bookings/update-booking/${mockBooking.bookingId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_access_token');
    req.flush(mockBooking);
  });

  it('should get all bookings', () => {
    const mockBookings: Booking[] = [
      { bookingId: 1,
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
        status: 'UpComing' },
      {bookingId: 2,
        userId: 'mockUserId',
        carId: 1,
        amount: 1000,
        pickUpDate: new Date('2024-07-25'),
        dropOffDate: new Date('2024-07-27'),
        pickUpLocation: 'Location C',
        dropOffLocation: 'Location B',
        pickUpTime: { hours: 10, minutes: 0 },
        dropOffTime: { hours: 15, minutes: 0 },
        isBlocked: false,
        status: 'UpComing' }
    ];

    service.getAllBooking().subscribe(bookings => {
      expect(bookings.length).toBe(2);
      expect(bookings).toEqual(mockBookings);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/bookings/get-all-bookings');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock_access_token');
    req.flush(mockBookings);
  });

  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };

    service.getAllBooking().subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/bookings/get-all-bookings');
    req.error(new ErrorEvent('network error'), errorResponse);
  });
  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const mockBooking: Booking ={ bookingId: 1,
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
      status: 'UpComing' };
    service.saveBooking(mockBooking).subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/bookings/save-booking');
    req.error(new ErrorEvent('network error'), errorResponse);
  });
  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const userId = '';
    service.getBookingbyUserId(userId).subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(`http://localhost:8080/api/bookings/users/get-bookings-by-user/${userId}`);
    req.error(new ErrorEvent('network error'), errorResponse);
  });
  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const bookingId = 1;
    const block = true;    
    service.deleteBooking(bookingId,block).subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(`http://localhost:8080/api/bookings/cancel-booking/${bookingId}`);
    req.error(new ErrorEvent('network error'), errorResponse);
  });
  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const mockBooking: Booking ={ bookingId: 1,
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
      status: 'UpComing' };    
      service.updateBooking(mockBooking).subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }   
    );

    const req = httpMock.expectOne(`http://localhost:8080/api/bookings/update-booking/${mockBooking.bookingId}`);
    req.error(new ErrorEvent('network error'), errorResponse);
  });
});
