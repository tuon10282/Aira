import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Users } from '../../classes/Users';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentUser: Users | null = null;
  
  private authSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  
  constructor(private authService: AuthService) {}
  
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
    // You must implement this method when using OnDestroy interface
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  logout() {
    this.authService.logout();
  }
}