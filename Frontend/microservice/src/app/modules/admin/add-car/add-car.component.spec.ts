import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { AddCarComponent } from './add-car.component';
import { CarService } from '../../../services/car.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { SearchComponent } from '../../shared/search/search.component';
import { AllBookingsComponent } from '../all-bookings/all-bookings.component';
import { UpdateBookingComponent } from '../../user/update-booking/update-booking.component';
import { ProfileComponent } from '../../user/profile/profile.component';
import { ViewBookingComponent } from '../../user/view-booking/view-booking.component';
import { BookingComponent } from '../../user/booking/booking.component';
import { CarDashboardComponent } from '../../user/car-dashboard/car-dashboard.component';
import { UserDashboardComponent } from '../../user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { LoginComponent } from '../../user/login/login.component';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { CommonModule } from '@angular/common';

describe('AddCarComponent', () => {
  let component: AddCarComponent;
  let fixture: ComponentFixture<AddCarComponent>;
  let carService: jasmine.SpyObj<CarService>;
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

  beforeEach(async () => {
    carService = jasmine.createSpyObj('CarService', ['saveCar']);
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        CommonModule,
        SharedModule
      ],
      declarations: [AddCarComponent],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: CarService, useValue: carService },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Cleanup after each test if necessary
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize carForm with required fields', () => {
    expect(component.carForm).toBeDefined();
    expect(component.carForm.get('name')).toBeDefined();
    expect(component.carForm.get('mileage')).toBeDefined();
    expect(component.carForm.get('price')).toBeDefined();
    expect(component.carForm.get('address')).toBeDefined();
    expect(component.carForm.get('capacity')).toBeDefined();
    expect(component.carForm.get('type')).toBeDefined();
    expect(component.carForm.get('gear')).toBeDefined();
    expect(component.carForm.get('carImg')).toBeDefined();
  });

  it('should mark form as invalid when initialized with empty values', () => {
    expect(component.carForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all fields are filled', () => {
    component.carForm.setValue({
      id: 1, name: 'Car A', mileage: 10, address: 'Address A', price: 200, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg'
    });
    expect(component.carForm.valid).toBeTruthy();
  });

  it('should call saveCar method when form is submitted', () => {
    spyOn(component, 'saveCar');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.saveCar).toHaveBeenCalled();
  });

  it('should handle file selection and update form value', () => {
    spyOn(component.carForm, 'patchValue');
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.carForm.patchValue).toHaveBeenCalledWith({ carImg: 'test.jpg' });
  });

  it('should call carService.saveCar with correct data when saveCar is called', () => {
    const mockCarData = {
      id: 1, name: 'Car A', mileage: 10, address: 'Address A', price: 200, capacity: 5, type: 'SUV', gear: 'Manual', carImg: 'car1.jpg'
    };

    component.carForm.setValue(mockCarData);
    carService.saveCar.and.returnValue(of(mockCarData));

    component.saveCar();

    expect(carService.saveCar).toHaveBeenCalledWith(mockCarData);
    expect(component.carForm.value).toEqual(mockCarData);
  });
  it('should correctly extract the file name from the full path', () => {
    const fullPath = '/path/to/file/test-image.jpg';
    const fileName = component['getCarImgPath'](fullPath);
    expect(fileName).toBe('test-image.jpg');
  });

  it('should return the full path if no slashes are present', () => {
    const fullPath = 'test-image.jpg';
    const fileName = component['getCarImgPath'](fullPath);
    expect(fileName).toBe('test-image.jpg');
  });

  it('should return an empty string if the path is empty', () => {
    const fullPath = '';
    const fileName = component['getCarImgPath'](fullPath);
    expect(fileName).toBe('');
  });
  it('should handle error when saveCar fails', fakeAsync(() => {
    const errorMessage = 'Error saving car';
    component.carForm.setValue({
      id: 1,
      name: 'Test Car',
      mileage: 10,
      price: 100,
      address: 'Test Address',
      capacity: 5,
      type: 'Sedan',
      gear: 'Automatic',
      carImg: 'test.jpg'
    });

    const httpErrorResponse = new HttpErrorResponse({ error: errorMessage });
    carService.saveCar.and.returnValue(throwError(httpErrorResponse));

    spyOn(console, 'error');

    component.saveCar();
    tick();

    expect(carService.saveCar).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(`Error saving car: ${errorMessage}`);

    expect(component.carForm.value).toEqual({
      id: null,
      name: '',
      mileage: 0,
      price: 0,
      address: '',
      capacity: 0,
      type: '',
      gear: '',
      carImg: null
    });
  }));
});
