import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  private get storage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

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
        const token = response?.['data']?.['access'] as string;
        const refresh_token = response?.['data']?.['refresh'] as string;
        if (token) {
          this.storage?.setItem('auth_token', token);
          this.storage?.setItem('refresh_token', refresh_token);
          if (callback) callback(response);
        } else if (errorCallback) {
          errorCallback(response);
        }
      },
      error: (err) => {
        console.log('3- Login error response:', err);
        const body = err?.error;
        console.log('4- Parsed error body:', body);
        const message =
          body?.message ?? body?.detail ?? body?.non_field_errors?.[0] ?? 'Invalid credentials.';
        if (errorCallback) errorCallback(body);
      }
    });
  }

  /** Extract token from any common DRF / JWT / dj-rest-auth response shape. */
  extractToken(response: LoginResponse): string {
    return (response.token ?? response.access ?? response.key ?? '') as string;
  }

  saveToken(token: string): void {
    this.storage?.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.storage?.getItem('auth_token') ?? null;
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
    const refresh = this.storage?.getItem('refresh_token') ?? '';
    return this.http.post<{ access: string }>(this.refreshUrl, { refresh });
  }

  getRefreshToken(): string | null {
    return this.storage?.getItem('refresh_token') ?? null;
  }

  logout(): void {
    this.storage?.removeItem('auth_token');
    this.storage?.removeItem('refresh_token');
  }
}
