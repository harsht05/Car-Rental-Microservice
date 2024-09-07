import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { SharedModule } from '../modules/shared/shared.module';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock class for ActivatedRoute
class MockActivatedRoute {
  // Mock any necessary properties or methods here
  params = of({}); // Mock the params observable
}

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomepageComponent],
      imports: [SharedModule],
      providers: [
        { provide: OAuthService, useValue: {} },
        { provide: ActivatedRoute, useClass: MockActivatedRoute } // Provide the mock ActivatedRoute
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
