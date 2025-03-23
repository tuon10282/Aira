import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { User } from './classes/Users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:3002/users';
  
  constructor(private _http: HttpClient) {}
  
  // Lấy tất cả người dùng
  getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };
    
    return this._http.get<string>(this.apiUrl, requestOptions).pipe(
      map(res => JSON.parse(res) as User[]),
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Lấy thông tin một người dùng
  getUserById(id: string): Observable<User> {
    const url = `http://localhost:3002/user-admin/${id}`;
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };
    
    return this._http.get<string>(url, requestOptions).pipe(
      map(res => JSON.parse(res) as User),
      retry(3),
      catchError(this.handleError)
    );
  }
  
  
  // Cập nhật thông tin người dùng
  updateUser(user: User): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    
    return this._http.put<any>(this.apiUrl, user, { headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Xóa người dùng
  deleteUser(id: string): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    
    return this._http.delete<User>(url, { headers }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Xử lý lỗi
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}