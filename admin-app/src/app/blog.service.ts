import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Blog } from './classes/Blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private _http: HttpClient) { }
  getBlogs(): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("http://localhost:3002/blogs", requestOptions).pipe(
      map(res => JSON.parse(res) as Array<Blog>),
      retry(3),
      catchError(this.handleError))
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message))
  }

  getBlog(blogId: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.get<any>("http://localhost:3002/blogs/" + blogId, requestOptions).pipe(
      map(res => JSON.parse(res) as Blog),
      retry(3),
      catchError(this.handleError))
  }

  //130
  postBlog(aBlog: any): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.post<any>("http://localhost:3002/blogs", JSON.stringify(aBlog), requestOptions).pipe(
      map(res => JSON.parse(res) as Blog),
      retry(3),
      catchError(this.handleError))
  }
  //131
  putBlog(aBlog: any): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.put<any>("http://localhost:3002/blogs/", JSON.stringify(aBlog), requestOptions).pipe(
      map(res => JSON.parse(res) as Blog),
      retry(3),
      catchError(this.handleError))
  }

  //132
  // Rename this method from deleteFashion to deleteBlog
  deleteBlog(blogId: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "application/json;charset=utf-8")
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    }
    return this._http.delete<any>("http://localhost:3002/blogs/" + blogId, requestOptions).pipe(
      map(res => JSON.parse(res) as Blog),
      retry(3),
      catchError(this.handleError)
    )
  }
  // Filter Style
  getBlogsByCategory(category: string): Observable<any> {
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=utf-8");
    const requestOptions: Object = {
      headers: headers,
      responseType: "text"
    };
    return this._http.get<any>(`http://localhost:3002/blogs/Category/${category}`, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<Blog>),
      retry(3),
      catchError(this.handleError)
    );
  }
}