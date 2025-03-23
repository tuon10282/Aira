import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../classes/Users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  searchTerm: string = '';
  loading: boolean = true;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalUsers: number = 0;
  totalPages: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;

  // Inject Router in the constructor
  constructor(
    private _service: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load all users
  loadUsers(): void {
    this.loading = true;
    this._service.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalUsers = this.users.length;
        this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
        this.applyFilter(); // Initialize filtered users
        this.loading = false;
        console.log('Users loaded:', this.users);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users: ' + err;
        this.loading = false;
        console.error(this.errorMessage);
      }
    });
  }

  // Delete a user
  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this._service.deleteUser(id).subscribe({
        next: (data) => {
          console.log('User deleted:', data);
          this.successMessage = 'Customer deleted successfully!';
          
          // Refresh the user list
          this.loadUsers();
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete customer: ' + err;
          console.error(this.errorMessage);
          
          // Clear error message after 3 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  // Filter users based on search term
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user => 
        user.Name.toLowerCase().includes(term) ||
        user.Email.toLowerCase().includes(term) ||
        (user.Phone && user.Phone.includes(term))
      );
    }
    
    this.totalUsers = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
    
    // Reset to first page if necessary
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    this.updatePageData();
  }

  // Update pagination data
  updatePageData(): void {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = Math.min(this.startIndex + this.itemsPerPage, this.totalUsers);
    
    // Create a copy of the filtered users before pagination
    const allFilteredUsers = [...this.filteredUsers];
    
    // Update filteredUsers to only show current page
    this.filteredUsers = allFilteredUsers.slice(this.startIndex, this.endIndex);
  }

  // Change page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  // Generate array of page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5; // Show up to 5 page numbers at a time
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    // Adjust start page if end page is maxed out
    if (endPage === this.totalPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  viewDetail(id: string) {
    console.log('Navigating to: /view-user-detail/' + id);
    this.router.navigate(['/view-user-detail', id]);
  }
}