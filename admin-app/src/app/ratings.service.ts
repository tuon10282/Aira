import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Reviews } from './classes/Review';

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
  private apiUrl = 'http://localhost:3002/reviews'; // Đổi port nếu cần

  constructor(private http: HttpClient) {}

  // Lấy tất cả reviews
  getAllReviews(): Observable<Reviews[]> {
    return this.http.get<Reviews[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  // Xử lý lỗi
  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching reviews:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

}
