import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserDashboardComponent } from './user-dashboard.component';
import { CarService } from '../../../services/car.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { of } from 'rxjs';
import { Car } from '../../../model/car';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from '../../admin/admin-dashboard/admin-dashboard.component';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { CarDashboardComponent } from '../car-dashboard/car-dashboard.component';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let carService: jasmine.SpyObj<CarService>;
  let router: Router;
  let sessionStorage: jasmine.SpyObj<SessionStorageService>;

  const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'car', component: CarDashboardComponent, canActivate: [AuthGuardService] }
  ];

  beforeEach(async () => {
    const carServiceSpy = jasmine.createSpyObj('CarService', ['getAllCars']);
    const sessionStorageSpy = jasmine.createSpyObj('SessionStorageService', ['setItem', 'getItem']);
  
    await TestBed.configureTestingModule({
      declarations: [UserDashboardComponent],
      imports: [
        RouterModule.forRoot(routes),
        SharedModule 
      ],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: CarService, useValue: carServiceSpy },
        { provide: SessionStorageService, useValue: sessionStorageSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  
    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    carService = TestBed.inject(CarService) as jasmine.SpyObj<CarService>;
    router = TestBed.inject(Router);
    sessionStorage = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cars on initialization', fakeAsync(() => {
    const mockCars: Car[] = [
      { id: 1, name: 'Car 1', carImg: 'car1.jpg', mileage: 10, price: 10000, address: 'Some Address', capacity: 5, type: 'SUV', gear: 'Automatic' }
    ];
    carService.getAllCars.and.returnValue(of(mockCars));

    fixture.detectChanges();
    tick();

    expect(component.cars).toEqual(mockCars);
  }));

  it('should navigate to /car and store carId in sessionStorage when viewCar is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const carId = 1;
    const expectedRoute = ['/car'];

    component.viewCar(carId);

    expect(sessionStorage.setItem).toHaveBeenCalledWith('carId', carId);
    expect(navigateSpy).toHaveBeenCalledWith(expectedRoute);
  });
});
