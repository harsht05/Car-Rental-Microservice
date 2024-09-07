import { TestBed } from '@angular/core/testing';
import { SessionStorageService } from './session-storage.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('SessionStorageService', () => {
  let service: SessionStorageService;
  let platformId: Object;

  // Common setup for tests
  beforeEach(() => {
    // Default to browser platform
    platformId = 'browser';
    
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        SessionStorageService
      ]
    });

    service = TestBed.inject(SessionStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setItem', () => {
    it('should set item in sessionStorage if in browser', () => {
      const key = 'testKey';
      const value = { test: 'value' };
      spyOn(sessionStorage, 'setItem');

      service.setItem(key, value);
      
      expect(sessionStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });
    
    it('should not set item if not in browser', () => {
      platformId = 'server';
      TestBed.resetTestingModule(); // Reset and reconfigure
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: platformId },
          SessionStorageService
        ]
      });
      service = TestBed.inject(SessionStorageService);
      
      const key = 'testKey';
      const value = { test: 'value' };
      spyOn(sessionStorage, 'setItem');

      service.setItem(key, value);

      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getItem', () => {
    it('should get item from sessionStorage if in browser', () => {
      const key = 'testKey';
      const value = { test: 'value' };
      spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(value));

      const result = service.getItem(key);

      expect(result).toEqual(value);
      expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should return null if item is not in sessionStorage', () => {
      const key = 'testKey';
      spyOn(sessionStorage, 'getItem').and.returnValue(null);

      const result = service.getItem(key);

      expect(result).toBeNull();
      expect(sessionStorage.getItem).toHaveBeenCalledWith(key);
    });

    it('should not get item if not in browser', () => {
      platformId = 'server';
      TestBed.resetTestingModule(); // Reset and reconfigure
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: platformId },
          SessionStorageService
        ]
      });
      service = TestBed.inject(SessionStorageService);

      const key = 'testKey';
      spyOn(sessionStorage, 'getItem');

      const result = service.getItem(key);

      expect(result).toBeNull();
      expect(sessionStorage.getItem).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should remove item from sessionStorage if in browser', () => {
      const key = 'testKey';
      spyOn(sessionStorage, 'removeItem');

      service.removeItem(key);

      expect(sessionStorage.removeItem).toHaveBeenCalledWith(key);
    });
    
    it('should not remove item if not in browser', () => {
      platformId = 'server';
      TestBed.resetTestingModule(); // Reset and reconfigure
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: platformId },
          SessionStorageService
        ]
      });
      service = TestBed.inject(SessionStorageService);

      const key = 'testKey';
      spyOn(sessionStorage, 'removeItem');

      service.removeItem(key);

      expect(sessionStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('clearStorage', () => {
    it('should clear sessionStorage if in browser', () => {
      spyOn(sessionStorage, 'clear');

      service.clearStorage();

      expect(sessionStorage.clear).toHaveBeenCalled();
    });

    it('should not clear sessionStorage if not in browser', () => {
      platformId = 'server';
      TestBed.resetTestingModule(); 
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: platformId },
          SessionStorageService
        ]
      });
      service = TestBed.inject(SessionStorageService);

      spyOn(sessionStorage, 'clear');

      service.clearStorage();

      expect(sessionStorage.clear).not.toHaveBeenCalled();
    });
  });
});
