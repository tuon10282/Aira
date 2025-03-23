import { Component, OnInit } from '@angular/core';
import { Blog } from '../classes/Blog';
import { BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-update',
  standalone: false,
  templateUrl: './blog-update.component.html',
  styleUrl: './blog-update.component.css'
})
export class BlogUpdateComponent implements OnInit {
  blog = new Blog();
  errMessage: string = '';
  blogId: string = '';
  blogs: Blog[] = []; // All blogs array
  
  constructor(
    private service: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(
      (param) => {
        let id = param.get('id');
        if (id != null) {
          this.getBlogById(id);
        }
      }
    );
  }
  
  getBlogById(blogId: string) {
    this.service.getBlog(blogId).subscribe({
      next: (data) => {
        this.blog = data;
        // If blog has tags but no tagsInput, initialize it
        if (this.blog.Tags && !this.blog.tagsInput) {
          this.blog.tagsInput = this.blog.Tags.join(', ');
        }
        // If blog list not already loaded, load it
        if (!this.blogs || this.blogs.length === 0) {
          this.loadAllBlogs();
        }
      },
      error: (err) => { this.errMessage = err; }
    });
  }
  
  loadAllBlogs() {
    this.service.getBlogs().subscribe({
      next: (blogsData) => {
        this.blogs = blogsData;
      },
      error: (err) => { this.errMessage = err; }
    });
  }
  
  ngOnInit() {
    this.loadAllBlogs();
  }
  
  // Set blog data (can be called from parent component if needed)
  public setBlog(p: Blog): void {
    this.blog = p;
  }
  
  // Handle file selection for blog image
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
  
  // Convert file to data URL and store in blog Image property
  convertFileToDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      // Store the image directly as a string property
      this.blog.Images = reader.result as string;
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
  
  // Process comma-separated tags into array
processTags(): void {
  if (this.blog.tagsInput) {
    // Split by comma, trim whitespace, and filter out empty strings
    this.blog.Tags = this.blog.tagsInput
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);
  } else {
    this.blog.Tags = [];
  }
}

// Remove a tag from the array
removeTag(tag: string): void {
  if (this.blog.Tags) {
    this.blog.Tags = this.blog.Tags.filter((t: string) => t !== tag);
    // Update the input field
    this.blog.tagsInput = this.blog.Tags.join(', ');
  }
}
  
  // Update blog - this matches the method name used in the HTML
  updateBlog(): void {
    // Process tags before sending to ensure they're up to date
    this.processTags();
    
    console.log("Updating blog:", this.blog);
    
    this.service.putBlog(this.blog).subscribe({
      next: (data) => {
        console.log("Response from API:", data);
        this.blog = data;
        alert("Blog updated successfully! ✅");
        this.router.navigate(['/blog']); // Navigate back to blog list
      },
      error: (err) => {
        console.error("Error from API:", err);
        this.errMessage = "Error updating blog! 😢";
      }
    });
  }
}