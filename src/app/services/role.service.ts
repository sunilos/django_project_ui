import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Role {
  id: number;
  name: string;
  description?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly rolesUrl = 'http://127.0.0.1:8000/ORSAPI/api/Role/';

  constructor(private http: HttpClient) { }

  getRoles(form: any, callback?: (response: any) => void): void {
    let _self = this;
    this.http.get(this.rolesUrl).subscribe({
      next: (response: any) => {
        console.log('Role response:', response);
        if (callback) callback(response);
      },
      error: (err) => {
        console.error('Role failed:', err);
      }
    });
  }
}
