import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Users } from '../classes/Users'; // Import đúng class Users

@Injectable({
  providedIn: 'root'
})
export class UserAPIService {  // Sửa lại tên đúng chuẩn (UserAPIService)
  
  constructor(private _http: HttpClient) {}  // Inject HttpClient vào service

  postUser(aUser: Users): Observable<Users> { // Kiểu dữ liệu đúng
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"  // Sửa responseType để tránh lỗi TypeScript
    };

    return this._http.post<Users>("http://localhost:3002/users", JSON.stringify(aUser), requestOptions).pipe(
      map(res => res as Users),  // Chuyển đổi dữ liệu nhận về thành Users
      retry(3),  // Thử lại 3 lần nếu có lỗi mạng
      catchError(this.handleError) // Xử lý lỗi
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error!";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
