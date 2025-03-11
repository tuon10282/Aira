import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Users } from '../classes/Users';

@Injectable({
  providedIn: 'root'
})
export class UserAPIService {
  constructor(private _http: HttpClient) {}

  // Method for user registration
  postUser(aUser: Users): Observable<Users> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };
    
    return this._http.post<Users>("http://localhost:3002/users", JSON.stringify(aUser), requestOptions).pipe(
      map(res => res as Users),
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Method for user login
  loginUser(loginData: {Email: string, Password: string}): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };
    
    return this._http.post<any>("http://localhost:3002/login", JSON.stringify(loginData), requestOptions).pipe(
      map(res => {
        if (typeof res === "string") {
          return JSON.parse(res);
        }
        return res;
      }),
      retry(3),
      catchError(this.handleError)
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