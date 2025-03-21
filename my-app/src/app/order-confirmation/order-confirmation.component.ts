import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';
  orderDetails: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Get order ID from route params
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      if (this.orderId) {
        this.loadOrderDetails();
      } else {
        this.error = 'No order ID provided';
        this.loading = false;
      }
    });
  }

  loadOrderDetails() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      this.error = 'Authentication required';
      this.loading = false;
      return;
    }
    
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    this.http.get(`http://localhost:3002/orders/${this.orderId}`, { headers })
      .subscribe({
        next: (data: any) => {
          console.log('Order details received:', data);
          this.orderDetails = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching order details:', err);
          this.error = 'Failed to load order details. Please try again.';
          this.loading = false;
        }
      });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
}