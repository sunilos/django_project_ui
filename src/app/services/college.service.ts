import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface College {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class CollegeService {

  private readonly collegesUrl = 'http://127.0.0.1:8000/ORSAPI/api/College/';

  constructor(private http: HttpClient) { }

  getColleges(_form: any, callback?: (response: any) => void): void {
    this.http.get(this.collegesUrl).subscribe({
      next: (response: any) => {
        console.log('College response:', response);
        _form.listdata = response.data;
        _form.error = response.error;
        _form.message = response.message;
        if (callback) callback(response);
      },
      error: (err) => {
        console.error('College failed:', err);
      }
    });
  }
}
