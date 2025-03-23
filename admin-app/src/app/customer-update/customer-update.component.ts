import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../classes/Users';

@Component({
  selector: 'app-customer-update',
  standalone: false,
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.css'
})
export class CustomerUpdateComponent implements OnInit {
  user = new User('', '', '', '', '', '');
  errMessage: string = '';
  userId: string = '';
  users: User[] = [];
  showPassword: boolean = false;
  
  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(
      (param) => {
        let id = param.get('id');
        if (id != null) {
          this.userId = id;
          this.searchUser(id);
        }
      }
    );
  }
  
  ngOnInit() {
    this.loadUsers();
  }
  
  searchUser(userId: string) {
    this.service.getUserById(userId).subscribe({
      next: (data) => {
        // Store original data but clear password for security
        this.user = {...data, Password: ''};
        if (!this.users || this.users.length === 0) {
          this.loadUsers();
        }
      },
      error: (err) => { this.errMessage = err; }
    });
  }
  
  loadUsers() {
    this.service.getUsers().subscribe({
      next: (userData) => {
        this.users = userData;
      },
      error: (err) => { this.errMessage = err; }
    });
  }
  
  // Set user data (can be called from parent component if needed)
  public setUser(u: User): void {
    this.user = u;
  }
  
  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const icon = document.querySelector('.password-toggle-btn i');
    
    if (this.showPassword && icon) {
      icon.className = 'fas fa-eye-slash';
    } else if (icon) {
      icon.className = 'fas fa-eye';
    }
  }
  
  // Update user information
  updateUser(): void {
    console.log("Updating user information:", this.user._id);
    
    // If password is empty, don't update it
    const userToUpdate = {...this.user};
    if (!userToUpdate.Password) {
      // Instead of using delete, set to undefined
      userToUpdate.Password = undefined;
    }
    
    this.service.updateUser(userToUpdate).subscribe({
      next: (data) => {
        console.log("Response from API:", data);
        alert("Customer information updated successfully! ✅");
        this.router.navigate(['/user']); // Navigate back to user list
      },
      error: (err) => {
        console.error("Error from API:", err);
        this.errMessage = "Error updating customer information! 😢";
      }
    });
  }
}