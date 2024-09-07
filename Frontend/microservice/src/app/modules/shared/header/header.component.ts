import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Car } from '../../../model/car';
import {jwtDecode} from 'jwt-decode'; 
import { SearchService } from '../../../services/search.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;
  cars: Car[] = [];
  filteredCars: Car[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthGuardService,
    private sessionStorage: SessionStorageService,
    private searchService:SearchService
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      selectedFilter: ['name']
    });
  }

  ngOnInit() {
    this.searchForm.valueChanges.subscribe(() => {
      this.onSearch();
    });
  }

  onSearch() {
    const { searchTerm, selectedFilter } = this.searchForm.value;
    this.searchService.sendSearchData(searchTerm, selectedFilter);
  }


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
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'viewBooking':
        this.router.navigate(['/viewBooking']);
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
    Swal.fire('Thank you for visiting our site please visit again!!','Logout successful!','success');
    this.sessionStorage.removeItem('userId');
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
