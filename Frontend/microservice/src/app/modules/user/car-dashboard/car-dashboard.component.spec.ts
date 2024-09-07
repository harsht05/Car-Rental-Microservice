import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { CarDashboardComponent } from './car-dashboard.component';
import { CarService } from '../../../services/car.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Car } from '../../../model/car';
import { of } from 'rxjs';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { LoginComponent } from '../login/login.component';
import { AdminDashboardComponent } from '../../admin/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { OAuthService } from 'angular-oauth2-oidc';

describe('CarDashboardComponent', () => {
  let component: CarDashboardComponent;
  let fixture: ComponentFixture<CarDashboardComponent>;
  let carService: jasmine.SpyObj<CarService>;
  let sessionStorageService: jasmine.SpyObj<SessionStorageService>;
  let router: Router;

  const mockCar: Car = {
    id: 1,
    name: 'Car 1',
    carImg: 'car1.jpg',
    mileage: 10,
    price: 10000,
    address: 'Some Address',
    capacity: 5,
    type: 'SUV',
    gear: 'Automatic'
  };
  const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'car', component: CarDashboardComponent, canActivate: [AuthGuardService] }
  ];

  beforeEach(async () => {
    const carServiceSpy = jasmine.createSpyObj('CarService', ['getCarById']);
    const sessionStorageSpy = jasmine.createSpyObj('SessionStorageService', ['getItem', 'setItem']);

    await TestBed.configureTestingModule({
      declarations: [CarDashboardComponent],
      imports: [
        RouterModule.forRoot(routes),
        SharedModule 
      ],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: CarService, useValue: carServiceSpy },
        { provide: SessionStorageService, useValue: sessionStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarDashboardComponent);
    component = fixture.componentInstance;
    carService = TestBed.inject(CarService) as jasmine.SpyObj<CarService>;
    sessionStorageService = TestBed.inject(SessionStorageService) as jasmine.SpyObj<SessionStorageService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch car details on initialization', fakeAsync(() => {
    const carId = 1;
    const userId = 'testUserId';

    sessionStorageService.getItem.and.returnValue(userId);
    sessionStorageService.getItem.and.returnValue(carId);
    if(carId){
      carService.getCarById.and.returnValue(of(mockCar));
    }
    else{
      console.error('Missing carId or userId')
    }
  
    component.ngOnInit();
    tick();

    expect(carService.getCarById).toHaveBeenCalledWith(carId);
    expect(component.cars).toEqual(mockCar);
  }));

  it('should navigate to booking when bookCar is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const carId = 1;
    const userId = 'testUserId';

    sessionStorageService.getItem.and.returnValue(userId);
    sessionStorageService.getItem.and.returnValue(carId);

    component.bookCar(carId, userId);

    expect(navigateSpy).toHaveBeenCalledWith(['booking']);
  });

});
