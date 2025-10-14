import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ComplexService {
  private apiUrl = 'http://127.0.0.1:5000/api/complex';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }


  getComplexes(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  createComplex(complexData: any): Observable<any> {
    return this.http.post(this.apiUrl, complexData, { headers: this.getHeaders() });
  }
}
