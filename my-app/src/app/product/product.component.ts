import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
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

  constructor(private _service: ProductsService, private router: Router) {}

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
    console.log("Added to cart:", product);
    // ✅ Bạn có thể thêm logic để đưa sản phẩm vào giỏ hàng ở đây
  }
}
