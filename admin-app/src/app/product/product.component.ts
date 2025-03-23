import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: any;
  errMessage: string = '';
  
  constructor(private _service: ProductService, public router: Router) {}

  ngOnInit() {  
    this.loadProducts();
  }
  
  loadProducts() {
    this._service.getProducts().subscribe({
      next: (data) => { this.products = data; },
      error: (err) => { this.errMessage = err; }
    });
  }
  
  viewDetail(product: any) {
    console.log("Product:", product);
    console.log("Navigating to:", `/view-product-detail/${product._id}`);
    this.router.navigate(['/view-product-detail', product._id]);
  }
  
  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this._service.deleteProduct(productId).subscribe({
        next: (data) => {
          console.log("Deleted product:", data);
          // Refresh the product list after deletion
          this.loadProducts();
          // Optionally show a success message
          alert('Product deleted successfully');
        },
        error: (err) => {
          this.errMessage = err;
          console.error("Error deleting product:", err);
          alert('Failed to delete product');
        }
      });
    }
  }
  // Add this property
activeDropdown: string | null = null;

// Add this method
toggleDropdown(event: Event, productId: string): void {
  event.stopPropagation();
  this.activeDropdown = this.activeDropdown === productId ? null : productId;
}
}