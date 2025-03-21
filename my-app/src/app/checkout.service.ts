// checkout.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:3002';

  constructor(private http: HttpClient) { }

  createCheckout(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.post(`${this.apiUrl}/checkout`, {}, { headers })
      .pipe(
        tap(response => console.log('Checkout created:', response))
      );
  }

  getCheckoutDetails(checkoutId: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.apiUrl}/checkout/${checkoutId}`, { headers })
      .pipe(
        tap(response => console.log('Checkout details received:', response))
      );
  }
}