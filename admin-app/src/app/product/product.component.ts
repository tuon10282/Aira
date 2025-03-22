import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  products: any;
  errMessage: string = '';
  constructor(private _service: ProductService, private router: Router) {}

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

}
