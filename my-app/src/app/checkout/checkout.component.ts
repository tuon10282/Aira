import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Users } from '../../classes/Users';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  shippingFee: number = 0;
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  
  // User data from AuthService
  userData: any = null;
  
  // Checkout data from MongoDB
  checkoutData: any = null;
  checkoutId: string = '';
  
  // Discount code
  discountCode: string = '';
  discountAmount: number = 0;
  
  // Form group for checkout
  checkoutForm: FormGroup;
  
  // Selected options
  selectedShipping: string = '';
  selectedPayment: string = '';
  discountForm!: FormGroup<any>;
  
  // Subscription tracking
  private userSubscription: Subscription | undefined;
  
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize form
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      deliveryAddress: ['', Validators.required],
      discountCode: ['']
    });
    
    // Initialize discount form separately
    this.discountForm = this.fb.group({
      discountCode: ['']
    });
    
    // Get checkoutId from localStorage
    this.checkoutId = localStorage.getItem('checkoutId') || '';
  }
  
  ngOnInit() {
    console.log('Initializing checkout component');
  
    this.checkoutId = localStorage.getItem('checkoutId') || '';
    console.log('Checkout ID from localStorage:', this.checkoutId);
    
    if (!this.checkoutId) {
      console.error('No checkout ID found in localStorage!');
      alert('Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.');
      this.router.navigate(['/cart']);
      return;
    }
    
    // Use AuthService to get user data
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user) => {
        if (user) {
          this.userData = user as Users;
          // Update form with user data - make sure to use correct property names
          this.checkoutForm.patchValue({
            fullName: this.userData.Name || '',  // Change to match your User model property names
            email: this.userData.Email || ''
          });
        }
      }
    );
    
    this.loadCheckoutData();
  }
  
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  // Load checkout data from MongoDB
  loadCheckoutData() {
    console.log('Loading checkout data with ID:', this.checkoutId);
    
    if (!this.checkoutId) {
      console.error('No checkout ID found!');
      return;
    }
  
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('User not logged in');
      return;
    }
  
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  
    this.http.get(`http://localhost:3002/checkout/${this.checkoutId}`, { headers })
      .subscribe({
        next: (data: any) => {
          console.log('Checkout Data received:', data);
          this.checkoutData = data;
          this.subtotal = parseFloat(data.subtotal);
          this.total = parseFloat(data.total);
          this.updateTotals();
        },
        error: (err) => {
          console.error('Error fetching checkout data:', err);
          if (err.status === 404) {
            alert('Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.');
            this.router.navigate(['/cart']);
          }
        }
      });
  }
  
  // Update totals calculation
  updateTotals() {
    // Start with subtotal from checkout data
    if (this.checkoutData) {
      this.subtotal = parseFloat(this.checkoutData.subtotal);
      
      // Apply discount if any
      if (this.discountAmount > 0) {
        this.subtotal = this.subtotal - this.discountAmount;
        if (this.subtotal < 0) this.subtotal = 0;
      }
      
      // Calculate total with shipping fee
      this.total = this.subtotal + this.shippingFee;
    }
  }
  
  // Apply discount code
  applyDiscount() {
    const code = this.discountForm.get('discountCode')?.value;
    console.log('Entered discount code:', code);
    
    if (!code) {
      console.log('No discount code entered');
      return;
    }
    
    const discounts: {[key: string]: number} = {
      'WELCOME10': 10000,
      'AIRA20': 20000,
      'FREESHIP': this.shippingFee
    };
    
    console.log('Available discounts:', discounts);
    console.log('Is code valid?', code in discounts);
    
    if (discounts[code]) {
      this.discountAmount = discounts[code];
      this.discountCode = code;
      this.updateTotals();
      console.log('Discount applied:', this.discountAmount);
    } else {
      alert('Invalid discount code');
    }
  }
  
  // Update shipping fee
  updateShippingFee(option: string) {
    this.selectedShipping = option;
    
    const shippingOptions: { [key: string]: number } = {
      'Standard': 30000,
      'Express': 50000,
      'Ninja': 40000
    };
    
    this.shippingFee = shippingOptions[option] || 0;
    this.updateTotals();
  }
  
  // Set payment method
  setPaymentMethod(method: string) {
    this.selectedPayment = method;
  }
  
  // Submit order
  submitOrder() {
    if (this.checkoutForm.invalid) {
      // Mark all fields as touched to trigger validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    if (!this.selectedShipping) {
      alert('Please select a shipping method');
      return;
    }
    
    if (!this.selectedPayment) {
      alert('Please select a payment method');
      return;
    }
    
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      alert('You must be logged in to place an order');
      return;
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    // Prepare order data - make sure all fields match your backend expectations
    const orderData = {
      checkoutId: this.checkoutId,
      shippingInfo: {
        fullName: this.checkoutForm.get('fullName')?.value,
        email: this.checkoutForm.get('email')?.value,
        phoneNumber: this.checkoutForm.get('phoneNumber')?.value,
        deliveryAddress: this.checkoutForm.get('deliveryAddress')?.value,
        shippingMethod: this.selectedShipping,
        shippingFee: this.shippingFee
      },
      paymentMethod: this.selectedPayment,
      orderSummary: {
        subtotal: this.subtotal,
        discountCode: this.discountCode,
        discountAmount: this.discountAmount,
        shippingFee: this.shippingFee,
        total: this.total,
        products: this.checkoutData.products
      }
    };
    
    console.log('Sending order data:', orderData);
    
    // Submit order to backend
    this.http.post('http://localhost:3002/orders', orderData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Order placed successfully:', response);
          alert('Order placed successfully!');
          
          // Clear checkout ID from localStorage
          localStorage.removeItem('checkoutId');
          
          // Redirect to confirmation page with order ID
          this.router.navigate(['/order-confirmation', response.orderId]);
        },
        error: (err) => {
          console.error('Error submitting order:', err);
          alert('Failed to place order. Please try again.');
        }
      });
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
}