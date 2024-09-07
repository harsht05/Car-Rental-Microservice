import { TestBed } from '@angular/core/testing';

import { CarService } from './car.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthGuardService } from './auth-guard.service';

describe('CarService', () => {
  let service: CarService;
  let httpMock: HttpTestingController;
  let authServiceStub: Partial<AuthGuardService>;

  beforeEach(() => {
    authServiceStub = {
      getAccessToken: () => 'mock_access_token'
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CarService,
        { provide: AuthGuardService, useValue: authServiceStub }
      ]
    });

    service = TestBed.inject(CarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all cars', () => {
    const mockCars = [{ id: 1, name: 'Car A', mileage: 10, address: 'Address A', price: 200, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg' },
      { id: 2, name: 'Car B', mileage: 12, address: 'Address B', price: 250, capacity: 7, type: 'Sedan', gear: 'Automatic', carImg: 'car2.jpg' }];

    service.getAllCars().subscribe(cars => {
      expect(cars.length).toBe(2);
      expect(cars).toEqual(mockCars);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/cars/get-all-cars');
    expect(req.request.method).toBe('GET');
    req.flush(mockCars);
  });

  it('should retrieve a single car by ID', () => {
    const mockCar = { id: 1, name: 'Car A', mileage: 10, address: 'Address A', price: 200, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg' };
    
    const carId = 1;

    service.getCarById(carId).subscribe(car => {
      expect(car).toEqual(mockCar);
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/cars/get-single-car/${carId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCar);
  });

  it('should save a new car', () => {
    const newCar = { id: 3, name: 'Car C', mileage: 10, address: 'Address A', price: 200, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg' };

    service.saveCar(newCar).subscribe(savedCar => {
      expect(savedCar).toEqual(newCar);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/cars/save-car');
    expect(req.request.method).toBe('POST');
    req.flush(newCar);
  });

  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };

    service.getAllCars().subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/cars/get-all-cars');
    req.error(new ErrorEvent('network error'), errorResponse);
  });
  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const carId = 1;
    service.getCarById(carId).subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(`http://localhost:8080/api/cars/get-single-car/${carId}`);
    req.error(new ErrorEvent('network error'), errorResponse);
  });
  it('should handle errors appropriately', () => {
    const errorResponse = { status: 404, statusText: 'Not Found' };
    const newCar = { id: 3, name: 'Car C', mileage: 10, address: 'Address A', price: 200, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg' };
    service.saveCar(newCar).subscribe(
      () => {},
      error => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }   
    );

    const req = httpMock.expectOne('http://localhost:8080/api/cars/save-car');
    req.error(new ErrorEvent('network error'), errorResponse);
  });
});