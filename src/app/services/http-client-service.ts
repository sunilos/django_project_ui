import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, onSuccess: (data: T) => void, onError: (error: unknown) => void, params?: Record<string, string>): void {
    const httpParams = params ? new HttpParams({ fromObject: params }) : undefined;
    this.http.get<T>(url, { params: httpParams }).subscribe({ next: onSuccess, error: onError });
  }

  post<T>(url: string, body: unknown, onSuccess: (data: T) => void, onError: (error: unknown) => void): void {
    this.http.post<T>(url, body).subscribe({ next: onSuccess, error: onError });
  }

  put<T>(url: string, body: unknown, onSuccess: (data: T) => void, onError: (error: unknown) => void): void {
    this.http.put<T>(url, body).subscribe({ next: onSuccess, error: onError });
  }

  delete<T>(url: string, onSuccess: (data: T) => void, onError: (error: unknown) => void): void {
    this.http.delete<T>(url).subscribe({ next: onSuccess, error: onError });
  }

  search<T>(url: string, params: Record<string, string>, onSuccess: (data: T) => void, onError: (error: unknown) => void): void {
    const httpParams = new HttpParams({ fromObject: params });
    this.http.get<T>(url, { params: httpParams }).subscribe({ next: onSuccess, error: onError });
  }
}
