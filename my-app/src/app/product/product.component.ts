import { Component, OnInit, Input } from '@angular/core';
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule], // ✅ Thêm CommonModule để sử dụng *ngFor, *ngIf
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'] // ✅ Đổi styleUrl thành styleUrls (dạng mảng)
})
export class ProductComponent implements OnInit {
  products: any;
  errMessage: string = '';

  constructor(private _service: ProductsService, private router: Router, private cartService: CartService) {}

  ngOnInit() {  
    this._service.getProducts().subscribe({
      next: (data) => { this.products = data; },
      error: (err) => { this.errMessage = err; }
    });
  }

  viewDetail(product: any) {
    console.log("Product:", product);  // Kiểm tra product có _id không
    console.log("Navigating to:", `/view-product-detail/${product._id}`);
    this.router.navigate(['/view-product-detail', product._id]);
  }
   
  addToCart(product: any) {
    if (!this.cartService.isLoggedIn()) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      this.router.navigate(['/login']);
      return;
    }

    if (!product || !product._id) {
      console.error('Lỗi: Không tìm thấy sản phẩm để thêm vào giỏ hàng.');
      return;
    }

  // Tính giá cuối cùng sau khi giảm giá
  const originalPrice = product.oldPrice > 0 ? product.oldPrice : product.Price; // Chỉ lấy oldPrice nếu lớn hơn 0
  const finalPrice = product.Price; // Giá cuối cùng đã giảm
  
  const discountValue = originalPrice > finalPrice && originalPrice > 0 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) 
    : 0;
  
  

  // Tạo item phù hợp với cấu trúc MongoDB
  const cartItem = {
    product_id: product._id,
    name: product.ProductName, // Đổi từ 'Name' -> 'ProductName'
    price: originalPrice, // Giá gốc
    final_price: finalPrice, // Giá sau giảm
    discount: discountValue, // Phần trăm giảm giá (giữ 2 số thập phân)
    image: product.Images?.[0] || "", // Lấy ảnh đầu tiên nếu có
    quantity: 1 // Mặc định số lượng khi thêm vào giỏ hàng
  };

    // Gọi CartService để thêm vào giỏ hàng
    this.cartService.addToCart(cartItem).subscribe({
      next: (response: any) => {
        console.log("Thêm vào giỏ hàng thành công:", response);
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      },
      error: (error: any) => {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        if (error.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          this.cartService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Có lỗi xảy ra: ' + error);
        }
      }
    });
  }
}
