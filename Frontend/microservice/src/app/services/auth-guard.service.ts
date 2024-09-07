import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const hasValidAccessToken = this.oauthService.hasValidAccessToken();
    console.log('AuthGuard canActivate check:', hasValidAccessToken);
    console.log('Route:', route);
    console.log('State:', state);

    if (hasValidAccessToken) {
      return true;
    } else {
      if (state.url !== '/login') {
        console.log('Redirecting to login from:', state.url);
        this.router.navigate(['/login']);
      } else {
        console.log('Initiating code flow for login');
        this.oauthService.loadDiscoveryDocumentAndLogin();
      }
      return false;
    }
  }

  getAccessToken(): string | null {
    return this.oauthService.getAccessToken();
  }
}
