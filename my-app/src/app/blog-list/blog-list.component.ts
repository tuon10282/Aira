import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from '../../classes/Blog';
import { BlogService } from '../blog.service';

interface StyleGroup {
  name: string;
  blogs: Blog[];
}

@Component({
  selector: 'app-blog-list',
  standalone: false,
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  blogByCategory: StyleGroup[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // New properties for e-commerce blog features
  featuredCategories: string[] = ['AROMA & ATMOSPHERE', 'THE CANDLE CHRONICLES', 'SCENTS & SERENITY', 'SCENTED'];
  popularTags: string[] = ['summer', 'trending', 'new', 'luxury',  'casual'];
  
  constructor(
    private blogService: BlogService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loadBlogs();
  }
  
  loadBlogs(): void {
    this.isLoading = true;
    this.blogService.getBlogs().subscribe({
      next: (data: Blog[]) => {
        this.blogs = this.enhanceBlogData(data);
        this.groupBlogByCategory();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching blogs:', error);
        this.errorMessage = 'Failed to load blog items. Please try again later.';
        this.isLoading = false;
      }
    });
  }
  
  // Helper method to ensure all blogs have necessary data
  enhanceBlogData(blogs: Blog[]): Blog[] {
    return blogs.map(blog => {
      // Set default image if not available
      if (!blog.Images) {
        blog.Images = 'https://via.placeholder.com/400x300';
      }
      // Ensure dates are in the correct format
      if (!blog.Created_at) {
        blog.Created_at = new Date().toISOString();
      }
      // Ensure other properties are properly initialized
      if (!blog.Comments) blog.Comments = [];
      if (!blog.Tags) blog.Tags = [];
      
      return blog;
    });
  }
  
  groupBlogByCategory(): void {
    // Group blogs by category
    const categoryMap = new Map<string, Blog[]>();
    
    this.blogs.forEach(blog => {
      if (!categoryMap.has(blog.Category)) {
        categoryMap.set(blog.Category, []);
      }
      categoryMap.get(blog.Category)?.push(blog);
    });
    
    // Convert map to array of blog groups
    this.blogByCategory = Array.from(categoryMap.entries()).map(([name, blogs]) => ({
      name,
      blogs
    }));
    
    // Extract popular tags
    this.extractPopularTags();
  }
  
  // Extract most popular tags from blogs
  extractPopularTags(): void {
    const tagCount = new Map<string, number>();
    
    this.blogs.forEach(blog => {
      blog.Tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    // Sort tags by frequency and get the top ones
    this.popularTags = Array.from(tagCount.entries())
.sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(entry => entry[0]);
      
    // If we have fewer than 8 tags, use the default ones
    if (this.popularTags.length < 8) {
      this.popularTags = ['summer', 'trending', 'new', 'luxury', 'casual'];
    }
  }
  
  search(): void {
    if (!this.searchQuery.trim()) {
      this.loadBlogs();
      return;
    }
    
    this.isLoading = true;
    this.blogService.getBlogsByCategory(this.searchQuery).subscribe({
      next: (blogs: any) => {
        // Add enhanced blog data
        blogs = this.enhanceBlogData(blogs);
        
        this.blogByCategory = [{
          name: this.searchQuery,
          blogs: blogs
        }];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'No blog items found matching your search.';
        this.isLoading = false;
        console.error('Error searching blogs:', error);
      }
    });
  }
  
  viewDetails(id: string): void {
    this.router.navigate(['/blog-detail', id]);
  }
  
  // Format date for display
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Unknown date';
    }
  }
}
