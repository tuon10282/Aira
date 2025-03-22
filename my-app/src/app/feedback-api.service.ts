import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Feedback } from '../classes/Feedback';
@Injectable({
  providedIn: 'root'
})
export class FeedbackAPIService {
  private apiUrl = 'http://localhost:3002/feedbacks'; // Cập nhật API URL đúng

  constructor(private _http: HttpClient) { }

  // 📌 Lấy danh sách feedback từ API
  getFeedbacks(): Observable<Feedback[]> {
    return this._http.get<Feedback[]>(this.apiUrl).pipe(
      retry(3),  // Thử lại 3 lần nếu lỗi
      catchError(this.handleError)
    );
  }

  // 📌 Gửi feedback mới lên server
  postFeedback(feedback: Feedback): Observable<Feedback> {
    return this._http.post<Feedback>(this.apiUrl, feedback).pipe(
      catchError(this.handleError)
    );
  }

  // 🛑 Xử lý lỗi
  private handleError(error: HttpErrorResponse) {
    console.error('API error:', error);
    return throwError(() => new Error(error.message));
  }
}
