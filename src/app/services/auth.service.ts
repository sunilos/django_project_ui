import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access?: string;
  refresh?: string;
  key?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = 'http://127.0.0.1:8000/ORSAPI/api/User/login/';

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials);
  }

  signin(credentials: LoginCredentials, callback?: (response: any) => void): void {
    this.http.post(this.loginUrl, credentials).subscribe({
      next: (response:any) => {
        console.log('Login response:', response);
        const token = response['data']['access'] as string;
        const refresh_token = response['data']['refresh'] as string;
        console.log('Extracted token:', token);
        console.log('Extracted refresh token:', refresh_token);
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refresh_token);
          if (callback) callback(response);
        } else {
          console.error('Login succeeded but no token was returned. Check the console for the API response.');
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  } 

  /** Extract token from any common DRF / JWT / dj-rest-auth response shape. */
  extractToken(response: LoginResponse): string {
    return (response.token ?? response.access ?? response.key ?? '') as string;
  }

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /** Returns 'Bearer' for JWT tokens (start with eyJ), 'Token' for DRF tokens. */
  getAuthPrefix(): string {
    const token = this.getToken() ?? '';
    return token.startsWith('eyJ') ? 'Bearer' : 'Token';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
