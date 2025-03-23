import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../classes/Products';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  // Initialize product without _id field to avoid MongoDB duplicate key error
  product: Partial<Product> = {
    ProductName: "",
    Description: "",
    CategoryName: "",
    Fragrance: "",
    Weight: 0,
    BurningTime: 0,
    Color: "",
    Price: 0,
    oldPrice: 0,
    StockQuantity: 0,
    SKU: "",
    Discount: "",
    Images: [],  // Store the image URL(s) as strings in an array
    Rating: 0,
    ReviewCount: 0,
    CreatedAt: new Date(),
    UpdatedAt: new Date(),
    Sold: 0
  };
  
  errMessage: string = '';

  constructor(private _service: ProductService) { }

  public setProduct(p: Product) {
    this.product = p;
  }

  // Updated file selection method
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        // Store the file as a data URL (string) in the Images array
        this.convertFileToDataUrl(file); // Convert file to data URL for storage
        this.previewImage(file); // Show a preview of the selected image
      }
    }
  }

  // Convert the selected file into a data URL and store it in the Images array
  convertFileToDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (this.product.Images && Array.isArray(this.product.Images)) {
        this.product.Images[0] = reader.result as string;  // Store the data URL (string)
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.errMessage = 'Failed to load image';
    };
    reader.readAsDataURL(file);  // Convert the file to a data URL
  }

  // Optional: Method to show image preview in the DOM
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Assuming you want to display a preview image
      const imagePreviewContainer = document.querySelector('.image-preview-container');
      if (imagePreviewContainer) {
        const img = document.createElement('img');
        img.src = e.target?.result as string;  // Set the image source as data URL
        imagePreviewContainer.innerHTML = '';  // Clear previous preview
        imagePreviewContainer.appendChild(img);  // Add the new preview
      }
    };
    reader.readAsDataURL(file);  // Read the file as a data URL for the preview
  }

  postProduct() {
    // Ensure _id is removed before submitting the product to avoid duplicate key error
    delete this.product._id;  // Remove _id if it exists
  
    // Set timestamps right before submitting
    this.product.CreatedAt = new Date();
    this.product.UpdatedAt = new Date();
  
    this._service.postProduct(this.product).subscribe({
      next: (data) => {
        this.product = data;
        // Optional: Clear form or show success message
        this.errMessage = 'Product added successfully!';
  
        // Optional: Reset form after successful submission
        this.resetForm();
      },
      error: (err) => {
        this.errMessage = err;
        console.error('Error posting product:', err);
      }
    });
  }

  // Optional: Add method to reset the form
  resetForm() {
    this.product = {
      ProductName: "",
      Description: "",
      CategoryName: "",
      Fragrance: "",
      Weight: 0,
      BurningTime: 0,
      Color: "",
      Price: 0,
      oldPrice: 0,
      StockQuantity: 0,
      SKU: "",
      Discount: "",
      Images: [],  // Reset images
      Rating: 0,
      ReviewCount: 0,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      Sold: 0
    };
  }
}
