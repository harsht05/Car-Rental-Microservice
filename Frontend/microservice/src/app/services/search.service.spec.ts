import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchService } from './search.service';
import { take } from 'rxjs/operators';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    });
    service = TestBed.inject(SearchService);
  });

  it('should not emit data before sendSearchData is called', fakeAsync(() => {
    let emitted = false;

    service.searchData$.pipe(take(1)).subscribe({
      next: data => {
        emitted = true;
      }
    });

    // No data should be emitted yet
    expect(emitted).toBeFalse();

    // Call sendSearchData after a short delay
    setTimeout(() => {
      service.sendSearchData('test', 'filter1');
    }, 50);

    // Advance the clock to ensure timeout executes
    tick(50);

    // Verify that data was emitted after sendSearchData was called
    expect(emitted).toBeTrue();
  }));
});
