import { Component, OnInit } from '@angular/core';
import { Blog } from '../classes/Blog';
import { BlogService } from '../blog.service';
import { NgIf } from '@angular/common'; // Import NgIf
import { RouterModule } from '@angular/router'; // Import RouterModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';


@Component({
  selector: 'app-blog',
  standalone: false,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  currentStatus: string = 'All';
  searchTerm: string = '';
  
  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs() {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    });
  }
  viewDetail(blog: any) {
    console.log("Blog:", blog);
    console.log("Navigating to:", `/view-blog-detail/${blog._id}`);
    this.router.navigate(['/view-blog-detail', blog._id]);
  }

  applyFilters() {
    this.filteredBlogs = this.blogs.filter(blog => {
      // Apply status filter
      if (this.currentStatus !== 'All' && blog.Status !== this.currentStatus) {
        return false;
      }
      
      // Apply search filter
      if (this.searchTerm && !this.matchesSearch(blog)) {
        return false;
      }
      
      return true;
    });
  }

  matchesSearch(blog: Blog): boolean {
    const term = this.searchTerm.toLowerCase();
    return (
      blog.Title.toLowerCase().includes(term) ||
      blog.Author.toLowerCase().includes(term) ||
      blog.Category.toLowerCase().includes(term)
    );
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  filterByStatus(status: string) {
    this.currentStatus = status;
    this.applyFilters();
  }

  deleteBlog(blogId: string) {
    if (confirm('Are you sure you want to delete this blog?')) {
      // Update this line to use deleteBlog instead of deleteFashion
      this.blogService.deleteBlog(blogId).subscribe({
        next: () => {
          // This will update the local array after successful deletion
          this.blogs = this.blogs.filter(blog => blog._id !== blogId);
          this.applyFilters(); // Re-apply filters to update filteredBlogs as well
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
        }
      });
    }
  }

}