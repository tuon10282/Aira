import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();
  
  private apiUrl = 'http://localhost:3002';
  
  constructor(private http: HttpClient) {
    this.loadCartCount();
  }
  
  // Lấy token xác thực từ localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  // Thêm sản phẩm vào giỏ hàng
  addToCart(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return new Observable(observer => {
      if (!this.isLoggedIn()) {
        observer.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return;
      }
      
      this.http.post(`${this.apiUrl}/cart`, product, { headers }).subscribe({
        next: (response) => {
          this.loadCartCount(); // Update cart count after adding item
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          console.error('Lỗi khi thêm vào giỏ hàng:', err);
          observer.error(err);
        }
      });
    });
  }
  
  // Lấy số lượng sản phẩm trong giỏ hàng
  loadCartCount() {
    if (!this.isLoggedIn()) {
      this.cartCount.next(0);
      return;
    }
    
    const headers = this.getAuthHeaders();
    this.http.get<any>(`${this.apiUrl}/user-cart`, { headers }).subscribe({
      next: (cart) => {
        if (cart && cart.products) {
          this.cartCount.next(cart.products.length);
        } else {
          this.cartCount.next(0);
        }
      },
      error: (err) => console.error('Lỗi khi lấy giỏ hàng:', err)
    });
  }
  
  // Lấy chi tiết giỏ hàng
  getCartDetails(): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (!this.isLoggedIn()) {
      return throwError(() => new Error('Vui lòng đăng nhập để xem giỏ hàng'));
    }
    
    return this.http.get(`${this.apiUrl}/user-cart`, { headers }).pipe(
      catchError(err => {
        console.error('Lỗi khi lấy chi tiết giỏ hàng:', err);
        return throwError(() => err);
      })
    );
  }
  
  // Cập nhật số lượng sản phẩm
  updateQuantity(productId: string, quantity: number): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.put(`${this.apiUrl}/cart/update`, {
      product_id: productId,
      quantity: quantity
    }, { headers }).pipe(
      tap(() => this.loadCartCount())
    );
  }
  
  // Cập nhật nhiều sản phẩm trong giỏ hàng
  updateCart(cartUpdates: { product_id: string; quantity: number; }[]): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (!this.isLoggedIn()) {
      return throwError(() => new Error('Vui lòng đăng nhập để cập nhật giỏ hàng'));
    }
    
    return this.http.put(`${this.apiUrl}/cart/update-multiple`, { updates: cartUpdates }, { headers }).pipe(
      tap(() => this.loadCartCount()),
      catchError(err => {
        console.error('Lỗi khi cập nhật giỏ hàng:', err);
        return throwError(() => err);
      })
    );
  }
  
  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart(productId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.delete(`${this.apiUrl}/cart/remove`, {
      headers,
      body: { product_id: productId }
    }).pipe(
      tap(() => this.loadCartCount())
    );
  }
  
  // Áp dụng mã voucher
  applyVoucher(voucherCode: string): Observable<any> {
    const headers = this.getAuthHeaders();
    
    if (!this.isLoggedIn()) {
      return throwError(() => new Error('Vui lòng đăng nhập để áp dụng mã giảm giá'));
    }
    
    return this.http.post(`${this.apiUrl}/cart/apply-voucher`, { code: voucherCode }, { headers }).pipe(
      catchError(err => {
        console.error('Lỗi khi áp dụng mã giảm giá:', err);
        return throwError(() => err);
      })
    );
  }
  // Xóa toàn bộ giỏ hàng
  clearCart(): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.delete(`${this.apiUrl}/cart/clear`, { headers }).pipe(
      tap(() => this.cartCount.next(0))
    );
  }
  
  // Đăng xuất (xóa thông tin đăng nhập)
  logout(): void {
    localStorage.removeItem('auth_token');
    this.cartCount.next(0);
  }
  // Thêm vào CartService
checkout(): Observable<any> {
  const headers = this.getAuthHeaders();
  
  if (!this.isLoggedIn()) {
    return throwError(() => new Error('Vui lòng đăng nhập để tiến hành thanh toán'));
  }
  
  return this.http.post(`${this.apiUrl}/checkout`, {}, { headers }).pipe(
    catchError(err => {
      console.error('Lỗi khi tạo đơn hàng:', err);
      return throwError(() => err);
    })
  );
}

// Lấy thông tin đơn hàng theo ID
getCheckoutById(checkoutId: string): Observable<any> {
  const headers = this.getAuthHeaders();
  
  if (!this.isLoggedIn()) {
    return throwError(() => new Error('Vui lòng đăng nhập để xem thông tin đơn hàng'));
  }
  
  return this.http.get(`${this.apiUrl}/checkout/${checkoutId}`, { headers }).pipe(
    catchError(err => {
      console.error('Lỗi khi lấy thông tin đơn hàng:', err);
      return throwError(() => err);
    })
  );
}
}