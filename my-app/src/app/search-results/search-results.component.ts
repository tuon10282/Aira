import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { Product } from '../../classes/Products';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  imports: [CommonModule, RouterModule]
})
export class SearchResultsComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      if (this.searchTerm) {
        this.performSearch();
      }
    });
  }

  performSearch(): void {
    this.loading = true;
    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (results) => {
        this.products = results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.loading = false;
      }
    });
  }

  viewDetail(product: Product): void {
    this.router.navigate(['/sanpham', product._id]);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product._id);
  }
    // Helper method to get currency format
    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
  
}