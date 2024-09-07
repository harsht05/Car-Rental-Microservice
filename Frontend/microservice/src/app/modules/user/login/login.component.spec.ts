import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { SessionStorageService } from '../../../services/session-storage.service';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from '../../admin/admin-dashboard/admin-dashboard.component';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { CarDashboardComponent } from '../car-dashboard/car-dashboard.component';
import { AuthCallbackComponent } from '../../../services/auth-callback.component';
import { HomepageComponent } from '../../../homepage/homepage.component';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let oauthServiceSpy: jasmine.SpyObj<OAuthService>;

  const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'user', component: UserDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'car', component: CarDashboardComponent, canActivate: [AuthGuardService] },
    { path: 'login/oauth2/code/okta', component: AuthCallbackComponent }
  ];

  beforeEach(async () => {
    const oauthServiceMock = jasmine.createSpyObj('OAuthService', ['hasValidAccessToken', 'initCodeFlow', 'getIdentityClaims']);
    const sessionStorageMock = jasmine.createSpyObj('SessionStorageService', ['']);
    const loaderServiceMock = jasmine.createSpyObj('LoaderService', ['']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        CommonModule, 
        BrowserModule,
        RouterModule.forRoot(routes)
      ],
      providers: [
        { provide: OAuthService, useValue: oauthServiceMock },
        { provide: SessionStorageService, useValue: sessionStorageMock },
        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    oauthServiceSpy = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initCodeFlow if no valid access token exists', () => {
    oauthServiceSpy.hasValidAccessToken.and.returnValue(false);

    component.initiateLogin();

    expect(oauthServiceSpy.initCodeFlow).toHaveBeenCalled();
  });

  it('should redirect to /admin if user has "Admin" role', fakeAsync(() => {
    oauthServiceSpy.hasValidAccessToken.and.returnValue(true);
    oauthServiceSpy.getIdentityClaims.and.returnValue({ roles: ['Admin'] });

    spyOn(router, 'navigate');

    component.initiateLogin();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('should redirect to /user if user does not have "Admin" role', fakeAsync(() => {
    oauthServiceSpy.hasValidAccessToken.and.returnValue(true);
    oauthServiceSpy.getIdentityClaims.and.returnValue({ roles: ['User'] });

    spyOn(router, 'navigate');

    component.initiateLogin();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/user']);
  }));

  it('should redirect to /login if identity claims are not available', fakeAsync(() => {
    oauthServiceSpy.hasValidAccessToken.and.returnValue(true);
    oauthServiceSpy.getIdentityClaims.and.returnValue({});

    spyOn(router, 'navigate');

    component.initiateLogin();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
