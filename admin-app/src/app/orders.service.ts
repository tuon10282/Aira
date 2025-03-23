import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Order } from './classes/Order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  // Define the API URL for orders
  private orderApiUrl = 'http://localhost:3002/adminorders';

  constructor(private _http: HttpClient) { }
  
  // Lấy tất cả đơn hàng
  getOrders(): Observable<Order[]> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };
    
    return this._http.get<string>(this.orderApiUrl, requestOptions).pipe(
      map(res => JSON.parse(res) as Order[]),
      retry(3),
      catchError(this.handleError)
    );
  }

  // Lọc detail đơn hàng theo ID
  getOrder(orderId: string): Observable<Order> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };
    
    return this._http.get<string>(`${this.orderApiUrl}/${orderId}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Order),
      retry(3),
      catchError(this.handleError)
    );
  }

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    };
    
    // Log the status update for debugging
    console.log("Updating order status:", orderId, "to", status);
    
    return this._http.put<any>(
      `${this.orderApiUrl}/${orderId}`,
      JSON.stringify({ status }),
      requestOptions
    ).pipe(
      map(res => {
        console.log("Raw response:", res);
        return JSON.parse(res) as Order;
      }),
      retry(3),
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}