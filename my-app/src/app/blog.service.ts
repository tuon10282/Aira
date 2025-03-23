import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Blog } from '../classes/Blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3002/blogs';
  private cachedBlogs: Blog[] = [];
  private lastFetchTime = 0;
  private cacheTimeout = 60000; // 1 minute cache

  constructor(private http: HttpClient) { }

  // Get all blogs
  getBlogs(): Observable<Blog[]> {
    // Check if we have recent cached data
    const now = Date.now();
    if (this.cachedBlogs.length > 0 && (now - this.lastFetchTime) < this.cacheTimeout) {
      console.log('Using cached blogs data');
      return of(this.cachedBlogs);
    }
    
    console.log('Fetching fresh blogs data from API');
    return this.http.get<Blog[]>(this.apiUrl).pipe(
      tap(blogs => {
        // Update cache
        this.cachedBlogs = blogs;
        this.lastFetchTime = now;
        console.log('Updated blogs cache with', blogs.length, 'items');
      }),
      catchError(error => {
        console.error('Error fetching blogs:', error);
        return of([]);
      })
    );
  }

  // Get a single blog by ID 
  getBlogById(id: string): Observable<Blog> {
    console.log(`Requesting blog with ID: ${id}`);
    
    // First check if the blog is in our cache
    const cachedBlog = this.cachedBlogs.find(blog => 
      (blog.id === id || blog._id === id)
    );
    
    if (cachedBlog) {
      console.log('Found blog in cache:', cachedBlog);
      return of(cachedBlog);
    }
    
    // If not in cache, get from API
    console.log('Blog not in cache, fetching from API');
    return this.http.get<Blog>(`${this.apiUrl}/${id}`).pipe(
      tap(blog => console.log('Blog received from API:', blog)),
      catchError(error => {
        console.error(`Error fetching blog with ID ${id}:`, error);
        
        // As a fallback, re-fetch all blogs to see if we can find it
        return this.getBlogs().pipe(
          map(blogs => {
            const foundBlog = blogs.find(blog => 
              (blog.id === id || blog._id === id)
            );
            
            if (foundBlog) {
              console.log('Found blog in refreshed cache:', foundBlog);
              return foundBlog;
            }
            
            console.error('Blog not found even after refreshing cache');
            throw new Error('Blog not found');
          })
        );
      })
    );
  }

  // Get blogs by category (search query as category)
  getBlogsByCategory(category: string): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/category/${category}`).pipe(
      tap(blogs => console.log(`Found ${blogs.length} blogs in category "${category}"`)),
      catchError(error => {
        console.error(`Error fetching blogs in category ${category}:`, error);
        return of([]);
      })
    );
  }
  // Clear cache (useful when testing)
  clearCache(): void {
    this.cachedBlogs = [];
    this.lastFetchTime = 0;
    console.log('Blog service cache cleared');
  }

}