import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  standalone: true, 
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  quantity: number = 2; // Số lượng ban đầu
  readonly pricePerItem: number = 230000; // Giá sản phẩm (readonly vì không thay đổi)
  readonly taxRate: number = 0.1; // 10% thuế
  shippingFee: number = 0; // Phí vận chuyển mặc định
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;

  constructor() {}

  ngOnInit() {
    this.updateTotals();
  }

  // Cập nhật tổng giá trị đơn hàng
  updateTotals() {
    this.subtotal = this.quantity * this.pricePerItem;
    this.tax = this.subtotal * this.taxRate;
    this.total = this.subtotal + this.tax + this.shippingFee;
  }

  // Giảm số lượng
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
      this.updateTotals();
    }
  }

  // Tăng số lượng
  increaseQuantity() {
    this.quantity += 1;
    this.updateTotals();
  }

  // Cập nhật phí ship khi người dùng chọn
  updateShippingFee(option: string) {
    const shippingOptions: { [key: string]: number } = {
      'Standard': 30000,
      'Express': 25000,
      'Ninja': 20000
    };
    
    this.shippingFee = shippingOptions[option] || 0;
    this.updateTotals();
  }

  // Format tiền tệ chuẩn VND
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
}
