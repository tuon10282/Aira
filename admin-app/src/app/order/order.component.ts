import { Component } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orders: any;
  errMessage: string = '';
  
  constructor(private _service: OrdersService, private router: Router) {}

  ngOnInit() {  
    this.loadOrders();
  }
  
  loadOrders() {
    this._service.getOrders().subscribe({
      next: (data) => { this.orders = data; },
      error: (err) => { this.errMessage = err; }
    });
  }
  
  viewDetail(order: any) {
    console.log("Product:", order);
    console.log("Navigating to:", `/view-order-detail/${order._id}`);
    this.router.navigate(['/view-order-detail', order._id]);
  }
  
}
