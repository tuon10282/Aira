import { Component } from '@angular/core';
import { BlogService } from '../blog.service';
import { Blog } from '../classes/Blog';

@Component({
  selector: 'app-add-blog',
  standalone: false,
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent {
  // Initialize blog without _id field to avoid MongoDB duplicate key error
  blog: Partial<Blog> = {
    Title: "",
    Content: "",
    Author: "",
    Category: "",
    Tags: [],
    Images: "",
    Status: "draft",
    Views: 0,
    Likes: 0,
    Comments: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    tagsInput: ""
  };
  
  errMessage: string = '';

  constructor(private _service: BlogService) { }

  public setBlog(b: Blog) {
    this.blog = b;
  }

  // Handle tags input
  onTagsInputChange(): void {
    if (this.blog.tagsInput) {
      // Split the input by commas and trim whitespace
      this.blog.Tags = this.blog.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    } else {
      this.blog.Tags = [];
    }
  }

  // Updated file selection method
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const file = input.files[0];
      if (file) {
        // Convert file to data URL for storage
        this.convertFileToDataUrl(file);
        // Show a preview of the selected image
        this.previewImage(file);
      }
    }
  }

  // Convert the selected file into a data URL and store it in the Images field
  convertFileToDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (this.blog) {
        this.blog.Images = reader.result as string;  // Store the data URL as string
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

  postBlog() {
    // Ensure _id is removed before submitting the blog to avoid duplicate key error
    delete this.blog._id;  // Remove _id if it exists
  
    // Set timestamps right before submitting
    this.blog.CreatedAt = new Date().toISOString();
    this.blog.UpdatedAt = new Date().toISOString();
  
    // Remove the tagsInput property before sending to the server
    const blogToSubmit = { ...this.blog };
    delete (blogToSubmit as any).tagsInput;

    this._service.postBlog(blogToSubmit).subscribe({
      next: (data) => {
        this.blog = data;
        // Optional: Clear form or show success message
        this.errMessage = 'Blog post added successfully!';
  
        // Optional: Reset form after successful submission
        this.resetForm();
      },
      error: (err) => {
        this.errMessage = err;
        console.error('Error posting blog:', err);
      }
    });
  }

  // Optional: Add method to reset the form
  resetForm() {
    this.blog = {
      Title: "",
      Content: "",
      Author: "",
      Category: "",
      Tags: [],
      Images: "",
      Status: "draft",
      Views: 0,
      Likes: 0,
      Comments: [],
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      tagsInput: ""
    };
  }
}