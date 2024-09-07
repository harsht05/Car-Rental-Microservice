import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode'; 
import { UserService } from './user.service';
import { SessionStorageService } from './session-storage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-auth-callback',
  template: '<p>Logging in...</p>',
})
export class AuthCallbackComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router, private userService: UserService,private sessionStorage:SessionStorageService) {}

  ngOnInit(): void {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const accessToken = this.oauthService.getAccessToken();
        if (accessToken) {
          try {
            const decodedToken: any = jwtDecode(accessToken);
            const userRoles = decodedToken['myclaim'];
            const userId = decodedToken['uid'];
            const username=decodedToken['sub'].split("@")[0];

            this.sessionStorage.setItem("userId", userId);
            this.sessionStorage.setItem("username",username);

            const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
            this.userService.login(headers).subscribe(
              
              (response) => {
                const username= this.sessionStorage.getItem('username')
                Swal.fire(`<h3>Hi,${username} Welcome to our Car Renting Site hope you have a Good Day!!</h3>`,'Login successful!','success');
                
                if (userRoles.includes('Admin') && userRoles.includes('User')) {
                  this.router.navigate(['/admin']);
                } else if (userRoles.includes('User')) {
                  this.router.navigate(['/user']);
                } else {
                  this.router.navigate(['/login']);
                }   
              },
              (error) => {
                this.router.navigate(['/login']);
              }
            );

          } catch (error) {
            this.router.navigate(['/login']);
          }
        }
      } else {
        this.oauthService.initCodeFlow();
      }
    }).catch(() => {
      this.router.navigate(['/login']);
    });
  }
}
