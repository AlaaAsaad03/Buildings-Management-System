import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:5000/api/profile';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(this.apiUrl, profileData, { headers: this.getHeaders() });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/change-password`,
      { currentPassword, newPassword, new_password: newPassword },
      { headers: this.getHeaders() }
    )
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Don't include Content-Type header - browser will set it automatically with boundary
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(
      `${this.apiUrl}/upload-picture`,
      formData,
      { headers: headers }
    );
  }

}
