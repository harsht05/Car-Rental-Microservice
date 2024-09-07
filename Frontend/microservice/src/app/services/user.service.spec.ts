import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';



describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request to login endpoint', () => {
    const mockHeaders = new HttpHeaders().set('Authorization', 'Bearer token');

    service.login(mockHeaders).subscribe(response => {
      expect(response).toBe('expected_response'); 
    });

    const mockRequest = httpMock.expectOne('http://localhost:8080/api/users/login');
    expect(mockRequest.request.method).toBe('GET');
    expect(mockRequest.request.headers.get('Authorization')).toBe('Bearer token');

    mockRequest.flush('expected_response'); 
  });
});
