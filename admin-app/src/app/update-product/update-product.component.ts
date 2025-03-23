import { Component, OnInit } from '@angular/core';
import { Product } from '../classes/Products';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  standalone: false,
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  product = new Product();
  errMessage: string = '';
  productId: string = '';
  products: Product[] = []; // Add products array definition

  constructor(
    private service: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.route.paramMap.subscribe(
      (param) => {
        let id = param.get('id');
        if (id != null) {
          this.searchProduct(id);
        }
      }
    );
  }

  searchProduct(productId: string) {
    this.service.getProduct(productId).subscribe({
      next: (data) => { 
        this.product = data;
        // If product loaded, load product list if not already loaded
        if (!this.products || this.products.length === 0) {
          this.service.getProducts().subscribe({
            next: (productsData) => { 
              this.products = productsData;
            },
            error: (err) => { this.errMessage = err; }
          });
        }
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  ngOnInit() {
    this.service.getProducts().subscribe({
      next: (data) => { 
        this.products = data; 
      },
      error: (err) => { this.errMessage = err; }
    });
  }

  // Set product data (can be called from parent component if needed)
  public setProduct(p: Product): void {
    this.product = p;
  }

  // Handle file selection for product image
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        this.convertFileToDataUrl(file);
        this.previewImage(file);
      }
    }
  }

  // Convert file to data URL and store in product Images array
  convertFileToDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (!this.product.Images) {
        this.product.Images = [];
      }
      
      if (this.product.Images.length === 0) {
        this.product.Images.push(reader.result as string);
      } else {
        this.product.Images[0] = reader.result as string;
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.errMessage = 'Failed to load image';
    };
    
    reader.readAsDataURL(file);
  }

  // Show image preview
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreviewContainer = document.querySelector('.image-preview-container');
      if (imagePreviewContainer) {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        imagePreviewContainer.innerHTML = '';
        imagePreviewContainer.appendChild(img);
      }
    };
    
    reader.readAsDataURL(file);
  }

  // Update product
  putProduct(): void {
    console.log("Updating product:", this.product);
    
    this.service.putProduct(this.product).subscribe({
      next: (data) => {
        console.log("Response from API:", data);
        this.product = data;
        alert("Product updated successfully! ✅");
        this.router.navigate(['/product']); // Navigate back to product list
      },
      error: (err) => {
        console.error("Error from API:", err);
        this.errMessage = "Error updating product! 😢";
      }
    });
  }
}