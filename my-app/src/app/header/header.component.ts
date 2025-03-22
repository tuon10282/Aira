import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Users } from '../../classes/Users';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductsService } from '../products.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';

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
  cartCount = 0;
  
  // Properties for search functionality
  searchTerm: string = '';
  
  private authSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;
  
  constructor(
    private authService: AuthService,
    private productService: ProductsService,
    private cartService: CartService,
    private router: Router
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
    this.cartSubscription = this.cartService.cartCount$.subscribe(
      count => {
        this.cartCount = count;
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
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
  }
  
  search(): void {
    if (!this.searchTerm.trim()) return;
    
    // Chuyển hướng đến trang kết quả tìm kiếm với query parameter
    this.router.navigate(['/tim-kiem'], {
      queryParams: { q: this.searchTerm }
    });
    
    // Reset searchTerm sau khi chuyển hướng
    this.searchTerm = '';
  }
  
  logout() {
    this.authService.logout();
  }
}