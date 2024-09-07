import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHeaderComponent } from './admin-header.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthGuardService } from '../../../services/auth-guard.service';

xdescribe('AdminHeaderComponent', () => {
  let component: AdminHeaderComponent;
  let fixture: ComponentFixture<AdminHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHeaderComponent],
      providers: [
        { provide: OAuthService, useValue: {} },    
            AuthGuardService, 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
