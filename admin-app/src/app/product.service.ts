import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Product } from './classes/Products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3002/products';

  constructor(private _http: HttpClient) {}

  // Lấy tất cả sản phẩm
  getProducts(): Observable<Product[]> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };

    return this._http.get<string>(this.apiUrl, requestOptions).pipe(
      map(res => JSON.parse(res) as Product[]),
      retry(3),
      catchError(this.handleError)
    );
  }

  // Lọc detail sản phẩm theo ID
  getProduct(productId: string): Observable<Product> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };

    return this._http.get<string>(`${this.apiUrl}/${productId}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Product),
      retry(3),
      catchError(this.handleError)
    );
  }

  // Tìm kiếm sản phẩm
  searchProducts(query: string): Observable<Product[]> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions = {
      headers: headers,
      responseType: "text" as "json"
    };

    return this._http.get<string>(`http://localhost:3002/api/products/search?q=${query}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Product[]),
      retry(3),
      catchError(this.handleError)
    );
  }

    //130
    postProduct(aProduct:any):Observable<any>
    {
    const headers=new HttpHeaders().set("Content-Type","application/json;charset=utf-8")
    const requestOptions:Object={
    headers:headers,
    responseType:"text"
    }
    return this._http.post<any>("http://localhost:3002/products",JSON.stringify(aProduct),requestOptions).pipe(
    map(res=>JSON.parse(res) as Product),
    retry(3),
    catchError(this.handleError))
    }
  // //131
  putProduct(aProduct: any): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    };
    
    // Log the entire product object for debugging
    console.log("Sending to API:", JSON.stringify(aProduct));
    
    return this._http.put<any>(
      "http://localhost:3002/products",
      JSON.stringify(aProduct),
      requestOptions
    ).pipe(
      map(res => {
        console.log("Raw response:", res);
        return JSON.parse(res) as Product;
      }),
      retry(3),
      catchError(this.handleError)
    );
  }
  //132
  deleteProduct(productId: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    };
    
    return this._http.delete<any>(`${this.apiUrl}/${productId}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Product),
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Xử lý lỗi chung
  
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }
}
