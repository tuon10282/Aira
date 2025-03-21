import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CheckoutService } from '../checkout.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

// Định nghĩa kiểu dữ liệu
interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount: number;
  final_price: number;
}

interface CartResponse {
  userId: string;
  products: CartItem[];
  subtotal: string;
  total: string;
  updatedAt: Date;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;
  error: string | null = null;
  subtotal = 0;
  shippingFee = 5.00; // Phí vận chuyển mặc định
  total = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit(): void {
    this.loadCartDetails();
  }

  loadCartDetails(): void {
    this.loading = true;
    this.error = null;

    this.cartService.getCartDetails().subscribe({
      next: (response: CartResponse) => {
        if (response && response.products && response.products.length > 0) {
          this.cartItems = response.products;
          this.calculateTotals();
        } else {
          this.cartItems = [];
          this.subtotal = 0;
          this.total = 0;
        }
        this.loading = false;
      },
      error: (err: { error: { message: string; }; status: number; }) => {
        console.error('Error loading cart:', err);
        this.error = err.error?.message || "Không thể tải giỏ hàng. Vui lòng thử lại sau.";
        this.loading = false;

        // Chuyển hướng đến trang đăng nhập nếu lỗi xác thực
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
        }
      }
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.final_price * item.quantity);
    }, 0);

    // Tính tổng cộng với phí vận chuyển
    this.total = this.subtotal + this.shippingFee;
  }

  changeQuantity(productId: string, change: number): void {
    const item = this.cartItems.find(item => item.product_id === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.loading = true;
    this.cartService.updateQuantity(productId, newQuantity).subscribe({
      next: () => {
        this.loadCartDetails();
      },
      error: (err: { error: { message: string; }; }) => {
        console.error('Error updating quantity:', err);
        this.error = err.error?.message || "Không thể cập nhật số lượng";
        this.loading = false;
      }
    });
  }

  removeItem(productId: string): void {
    this.loading = true;
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.product_id !== productId);
        this.calculateTotals();
        this.loading = false;
      },
      error: (err: { error: { message: string; }; }) => {
        console.error('Error removing item:', err);
        this.error = err.error?.message || "Không thể xóa sản phẩm";
        this.loading = false;
      }
    });
  }

  updateCart(): void {
    const cartUpdates = this.cartItems.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }));

    this.loading = true;
    this.cartService.updateCart(cartUpdates).subscribe({
      next: () => {
        this.loadCartDetails();
      },
      error: (err: { error: { message: string; }; }) => {
        console.error('Error updating cart:', err);
        this.error = err.error?.message || "Không thể cập nhật giỏ hàng";
        this.loading = false;
      }
    });
  }

  clearCart(): void {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      this.loading = true;
      this.cartService.clearCart().subscribe({
        next: () => {
          this.loadCartDetails();
        },
        error: (err: { error: { message: string; }; }) => {
          console.error('Error clearing cart:', err);
          this.error = err.error?.message || "Không thể xóa giỏ hàng";
          this.loading = false;
        }
      });
    }
  }

  redeemVoucher(): void {
    // Triển khai chức năng voucher ở đây
    alert('Chức năng đang phát triển!');
  }

  proceedToCheckout(): void {
    // Kiểm tra có sản phẩm trong giỏ hàng không
    if (this.cartItems.length === 0) {
      this.error = 'Giỏ hàng trống, không thể thanh toán';
      return;
    }
    
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.error = 'Vui lòng đăng nhập để tiếp tục thanh toán';
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }
    
    // Sử dụng CheckoutService để tạo checkout
    this.loading = true;
    this.checkoutService.createCheckout().subscribe({
      next: (response: any) => {
        console.log('Checkout Response:', response);
        if (response.checkoutId) {
          // FIXED: Use consistent localStorage key
          localStorage.setItem('checkoutId', response.checkoutId);
          // Chuyển đến trang thanh toán
          this.router.navigate(['/thanhtoan']);
        } else {
          this.error = 'Lỗi: Không có checkoutId trong phản hồi!';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Checkout error:', err);
        this.error = err.error?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }
  // Phương thức trực tiếp sử dụng HTTP (phương án dự phòng)
  checkout(): void {
    // Kiểm tra có sản phẩm trong giỏ hàng không
    if (this.cartItems.length === 0) {
      this.error = 'Giỏ hàng trống, không thể thanh toán';
      return;
    }
  
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.error = 'Vui lòng đăng nhập để tiếp tục thanh toán';
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.loading = true;
    
    this.http.post('http://localhost:3002/checkout', {}, { headers })
    .subscribe({
      next: (response: any) => {
        console.log('Checkout Response:', response);
        if (response.checkoutId) {
          localStorage.setItem('checkoutId', response.checkoutId);
          
          this.router.navigate(['/thanhtoan']);
        } else {
          this.error = 'Lỗi: Không có checkoutId trong phản hồi!';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Checkout error:', err);
        this.error = err.error?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  // Helper methods
  getOriginalPrice(item: CartItem): number {
    if (item.discount > 0) {
      return item.price / (1 - item.discount / 100);
    }
    return item.price;
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getDiscountAmount(item: CartItem): number {
    return item.price - item.final_price;
  }

  
  
}