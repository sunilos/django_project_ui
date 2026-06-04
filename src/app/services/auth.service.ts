import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ORSAPI } from './orsapi.config';

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
  private readonly loginUrl = ORSAPI.LOGIN_API;
  private readonly refreshUrl = ORSAPI.TOKEN_REFRESH_API;
  // http://127.0.0.1:8000/api/token/refresh/
  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials);
  }

  signin(
    credentials: any,
    callback?: (response: any) => void,
    errorCallback?: (message: string) => void
  ): void {
    console.log('1- Attempting to sign in with credentials:', credentials);
    this.http.post(ORSAPI.LOGIN_API, credentials).subscribe({
      next: (response: any) => {
         console.log('2- Login response:', response); 
        const token = response['data']['access'] as string;
        const refresh_token = response['data']['refresh'] as string;
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refresh_token);
          if (callback) callback(response);
        } else if (errorCallback) {
          errorCallback('Login succeeded but no token was returned.');
        }
      },
      error: (err) => {
        const body = err?.error;
        const message =
          body?.message ?? body?.detail ?? body?.non_field_errors?.[0] ?? 'Invalid credentials.';
        if (errorCallback) errorCallback(message);
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

  refreshToken(): Observable<{ access: string }> {
    const refresh = localStorage.getItem('refresh_token') ?? '';
    return this.http.post<{ access: string }>(this.refreshUrl, { refresh });
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}
