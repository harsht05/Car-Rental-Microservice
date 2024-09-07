
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchData = new Subject<{ searchTerm: string, selectedFilter: string }>();

  searchData$ = this.searchData.asObservable();

  sendSearchData(searchTerm: string, selectedFilter: string) {
    this.searchData.next({ searchTerm, selectedFilter });
  }
}