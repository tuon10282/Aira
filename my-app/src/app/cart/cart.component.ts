import { Component, OnInit } from '@angular/core';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] // Đúng cú pháp
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [
    { name: 'LAVENDER CANDLE', price: 9.2, quantity: 2, image: 'candle1.jpg' },
    { name: 'LAVENDER CANDLE', price: 9.2, quantity: 2, image: 'candle2.jpg' },
    { name: 'LAVENDER CANDLE', price: 9.2, quantity: 2, image: 'candle3.jpg' }
  ];

  subtotal: number = 0;
  total: number = 0;
  shippingFee: number = 13;

  updateCart(): void {
    this.updateSummary();
  }

  changeQuantity(index: number, change: number): void {
    if (this.cart[index]) {
      this.cart[index].quantity += change;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
      this.updateCart();
    }
  }

  removeItem(index: number): void {
    if (this.cart[index]) {
      this.cart.splice(index, 1);
      this.updateCart();
    }
  }

  updateSummary(): void {
    this.subtotal = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.total = this.subtotal + this.shippingFee;
  }

  redeemVoucher(): void {
    alert('Voucher redeemed!');
  }

  ngOnInit(): void {
    this.updateCart();
  }
}
