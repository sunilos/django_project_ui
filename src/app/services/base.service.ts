import { Injectable } from '@angular/core';
import { ServiceLocator } from './service-locator';

@Injectable()
export class BaseService {

  protected url: string = '';
  
  protected supportsPreload = true;

  constructor(protected serviceLocator: ServiceLocator) { }

  get<T>(onSuccess: (data: T) => void, onError: (error: any) => void): void {
    this.serviceLocator.http.get<T>(this.url, onSuccess, onError);
  }

  getById<T>(id: number, onSuccess: (data: T) => void, onError: (error: any) => void): void {
    this.serviceLocator.http.get<T>(`${this.url}${id}/`, onSuccess, onError);
  }

  add<T>(body: unknown, onSuccess: (data: T) => void, onError: (error: any) => void): void {
    this.serviceLocator.http.post<T>(this.url, body, onSuccess, onError);
  }

  search<T>(body: unknown, onSuccess: (data: T) => void, onError: (error: any) => void): void {
    this.serviceLocator.http.post<T>(`${this.url}search/`, body, onSuccess, onError);
  }

  update<T>(id: number, body: unknown, onSuccess: (data: T) => void, onError: (error: any) => void): void {
    this.serviceLocator.http.put<T>(`${this.url}${id}/`, body, onSuccess, onError);
  }

  delete<T>(id: number, onSuccess: (data: T) => void, onError: (error: any) => void): void {
    this.serviceLocator.http.delete<T>(`${this.url}${id}/`, onSuccess, onError);
  }

  preload<T>(onSuccess: (data: T) => void, onError: (error: any) => void): void {
    if (!this.supportsPreload) return;
    this.serviceLocator.http.get<T>(`${this.url}preload`, onSuccess, onError);
  }
}
