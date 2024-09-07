import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {

  constructor(private router: Router, private authService: AuthGuardService, private sessionStorage: SessionStorageService) {}

  navigateTo(page: string) {
    const userId = this.sessionStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    switch (page) {
      case 'home':
        this.home();
        break;
      case 'addCars':
        this.router.navigate(['/addCars']);
        break;
      case 'allBookings':
        this.router.navigate(['/allBookings']);
        break;
    }
  }

  home() {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      try {
        const decodedToken: any = jwtDecode(accessToken);
        const userRoles = decodedToken['myclaim'];
        if (userRoles.includes('Admin') && userRoles.includes('User')) {
          this.router.navigate(['/admin']);
        } else if (userRoles.includes('User')) {
          this.router.navigate(['/user']);
        } else {
          this.router.navigate(['/login']);
        }
      } catch (error) {
        this.router.navigate(['/login']);
      }
    }
  }

  isLoggedIn(): boolean {
    return !!this.sessionStorage.getItem('userId');
  }

  logout() {
    this.sessionStorage.removeItem('userId');
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
