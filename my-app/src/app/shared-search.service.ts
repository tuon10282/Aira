import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../classes/Products';

@Injectable({
  providedIn: 'root'
})
export class SharedSearchService {
  // BehaviorSubject lưu trữ kết quả tìm kiếm hiện tại
  private searchResultsSubject = new BehaviorSubject<Product[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  
  // Observable mà các component khác có thể subscribe
  searchResults$ = this.searchResultsSubject.asObservable();
  searchTerm$ = this.searchTermSubject.asObservable();
  
  constructor() {}
  
  // Cập nhật kết quả tìm kiếm
  updateSearchResults(results: Product[]): void {
    this.searchResultsSubject.next(results);
  }
  
  // Cập nhật từ khóa tìm kiếm
  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
  
  // Xóa kết quả tìm kiếm
  clearSearchResults(): void {
    this.searchResultsSubject.next([]);
    this.searchTermSubject.next('');
  }
}