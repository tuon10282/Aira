import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Blog } from '../../classes/Blog';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent  implements OnInit {
  blog: Blog | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.loadFashionDetails();
  }

  loadFashionDetails(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.blogService.getBlogById(id).subscribe({
        next: (data: Blog | null) => {
          this.blog = data;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching blog details:', error);
          this.errorMessage = 'Failed to load blog details. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Invalid blog ID';
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/blog']);
  }
}
