import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';


describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let oauthService: jasmine.SpyObj<OAuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const oauthServiceSpy = jasmine.createSpyObj('OAuthService', ['hasValidAccessToken', 'getAccessToken', 'loadDiscoveryDocumentAndLogin']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: OAuthService, useValue: oauthServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthGuardService);
    oauthService = TestBed.inject(OAuthService) as jasmine.SpyObj<OAuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if access token is valid', () => {
    oauthService.hasValidAccessToken.and.returnValue(true);

    const result = service.canActivate({} as any, {} as any);
    
    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(oauthService.loadDiscoveryDocumentAndLogin).not.toHaveBeenCalled();
  });

  it('should redirect to login if access token is invalid and not already on login page', () => {
    oauthService.hasValidAccessToken.and.returnValue(false);
    const state = { url: '/some-page' } as any;

    const result = service.canActivate({} as any, state);

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(oauthService.loadDiscoveryDocumentAndLogin).not.toHaveBeenCalled();
  });

  it('should initiate login flow if access token is invalid and already on login page', () => {
    oauthService.hasValidAccessToken.and.returnValue(false);
    const state = { url: '/login' } as any;

    const result = service.canActivate({} as any, state);

    expect(result).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(oauthService.loadDiscoveryDocumentAndLogin).toHaveBeenCalled();
  });

  it('should get access token from OAuth service', () => {
    const token = 'mock_token';
    oauthService.getAccessToken.and.returnValue(token);

    const result = service.getAccessToken();
    
    expect(result).toBe(token);
    expect(oauthService.getAccessToken).toHaveBeenCalled();
  });
});
