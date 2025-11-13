import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";


export type Role = 'Super Admin' | 'Complex Admin' | 'Building Admin';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api';
  //create data stream to store user infor and make it available across the app
  private currentUserSubject = new BehaviorSubject<any>(null);
  // expose the stream safely
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    //It checks if user was already logged in,
    // so it loads them into memory (BehaviorSubject).

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.admin));
        this.currentUserSubject.next(response.admin);
      })
    )
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return throwError(() => new Error('No refresh token available'));

    return this.http.post(`${this.apiUrl}/refresh`, {}, {
      headers: { 'Authorization': `Bearer ${refreshToken}` }
    }).pipe(
      tap((res: any) => localStorage.setItem('token', res.token)),
      catchError(err => {
        this.logout();
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }
  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify`);
  }

  //Helper Methods
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isLoggedIn(): boolean {
    // returns true if token exists
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }


  hasRole(...roles: Role[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  //permissions 
  can(permission: string): boolean {
    switch (permission) {
      case 'create_admin':
      case 'create_complex':
      case 'delete_building':
      case 'view_all_buildings':
        return this.hasRole('Super Admin');

      case 'create_building':
        return this.hasRole('Super Admin', 'Complex Admin');

      case 'view_all_complexes':
        return this.hasRole('Super Admin', 'Complex Admin');

      default:
        return false;
    }
  }
}
