import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api';
  //create data stream to store user infor and make it available across the app
  private currentUserSubject = new BehaviorSubject<any>(null);
  // expose the stream safely
  public cuurentUser$ = this.currentUserSubject.asObservable();

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
        localStorage.setItem('user', JSON.stringify(response.admin));
        this.currentUserSubject.next(response.admin);
      })
    )
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  //Helper Methods
  getToken(): string | null {
    console.log(' token:', localStorage.getItem('token'));
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    // returns true if token exists
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isSuperAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Super Admin';
  }
}
