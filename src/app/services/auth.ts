import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5167/api/Auth/login';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
  register(credentials: any): Observable<any> {
    return this.http.post('http://localhost:5167/api/Auth/register', credentials);
  }

  saveToken(token: string) {
    
    localStorage.setItem('scout_token', token);
  }

  getToken() {
    return localStorage.getItem('scout_token');
  }
}