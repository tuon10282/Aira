// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Users } from '../classes/Users'; // Import Users from your classes directory

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<Users | null>(this.getUserData());
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private router: Router) {}
  
  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  private getUserData(): Users | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
  
  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
  
  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  
  public getCurrentUser(): Users | null {
    return this.currentUserSubject.value;
  }
  
  public setAuthState(isAuth: boolean): void {
    this.isAuthenticatedSubject.next(isAuth);
  }
  
  public setUserData(user: Users): void {
    localStorage.setItem('user_data', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  public login(token: string, user: Users): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }
  
  public logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/register']);
  }
}