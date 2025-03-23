import { Component, OnInit } from '@angular/core';
import { Order } from '../classes/Order';
import { OrdersService } from '../orders.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-order',
  standalone: false,
  templateUrl: './update-order.component.html',
  styleUrl: './update-order.component.css'
})
export class UpdateOrderComponent implements OnInit {
  order = new Order('', '', '', {}, '', {}, '', '');
  errMessage: string = '';
  orderId: string = '';
  orders: Order[] = [];

  constructor(
    private service: OrdersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(
      (param) => {
        let id = param.get('id');
        if (id != null) {
          this.orderId = id;
          this.searchOrder(id);
        }
      }
    );
  }

  searchOrder(orderId: string) {
    this.service.getOrder(orderId).subscribe({
      next: (data) => {
        this.order = data;
        // If orders not already loaded, load them
        if (!this.orders || this.orders.length === 0) {
          this.loadOrders();
        }
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  loadOrders() {
    this.service.getOrders().subscribe({
      next: (ordersData) => {
        this.orders = ordersData;
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  // Set order data (can be called from parent component if needed)
  public setOrder(o: Order): void {
    this.order = o;
  }

  // Update order status
  updateOrder(): void {
    console.log("Updating order status:", this.order._id, "to", this.order.status);
    
    this.service.updateOrderStatus(this.order._id, this.order.status).subscribe({
      next: (data) => {
        console.log("Response from API:", data);
        this.order = data;
        alert("Order status updated successfully! ✅");
        this.router.navigate(['/order']); // Navigate back to order list
      },
      error: (err) => {
        console.error("Error from API:", err);
        this.errMessage = "Error updating order status! 😢";
      }
    });
  }
}