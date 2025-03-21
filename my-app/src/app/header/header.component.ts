// header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Users } from '../../classes/Users';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: Users | null = null;
  
  // Properties for search functionality
  searchTerm: string = '';
  loading: boolean = false;
  products: any[] = [];
  
  private authSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  
  constructor(
    private authService: AuthService,
    private productService: ProductsService
  ) {}
  
  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      }
    );
    
    this.userSubscription = this.authService.currentUser$.subscribe(
      user => {
        this.currentUser = user as Users;
      }
    );
  }
  
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  search(): void {
    if (!this.searchTerm.trim()) return;
    
    this.loading = true;
    this.productService.searchProducts(this.searchTerm)
      .subscribe(
        data => {
          this.products = data;
          this.loading = false;
        },
        error => {
          console.error('Lỗi khi tìm kiếm:', error);
          this.loading = false;
        }
      );
  }

  logout() {
    this.authService.logout();
  }
}