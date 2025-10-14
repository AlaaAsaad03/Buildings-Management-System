import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = 'http://127.0.0.1:5000/api/buildings';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getBuildings(complexId?: number): Observable<any> {
    let params = new HttpParams();
    if (complexId) {
      params = params.set('complex_id', complexId.toString());
    }
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  createBuilding(buildingData: any): Observable<any> {
    return this.http.post(this.apiUrl, buildingData, { headers: this.getHeaders() });
  }

  deleteBuilding(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
