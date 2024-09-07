import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { SessionStorageService } from '../../../services/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private oauthService: OAuthService, private router: Router, private sessionStorage: SessionStorageService) { }

  ngOnInit() {
    this.initiateLogin();
  }

  initiateLogin() {
    if (!this.oauthService.hasValidAccessToken()) {

      console.log('No valid access token found, initiating code flow');
      this.oauthService.initCodeFlow();
    } else {
      console.log('User is already logged in');
      this.redirectUser();
    }
  }

  private redirectUser() {
    const identityClaims = this.oauthService.getIdentityClaims();
  
    if (!identityClaims || Object.keys(identityClaims).length === 0) {
      this.router.navigate(['/login']);
      return;
    }
  
    const roles = identityClaims['roles'];
  
    if (roles && roles.includes('Admin')) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/user']);
    }
  }
  
  
}
