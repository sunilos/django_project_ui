import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    let _self= this;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    const { login, password } = this.loginForm.value;
    this.authService.signin({ login, password }, () => {
      _self.router.navigate(['/welcome']);
    });
  }

  onSubmit1(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { login, password } = this.loginForm.value;
    this.authService.login({ login, password }).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        const token = this.authService.extractToken(response);
        //const token = response['data']['access'] as string;
        if (token) {
          this.authService.saveToken(token);
          this.router.navigate(['/welcome']);
        } else {
          this.loading = false;
          this.errorMessage = 'Login succeeded but no token was returned. Check the console for the API response.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.parseError(err);
      }
    });
  }

  private parseError(err: { status?: number; error?: Record<string, unknown> }): string {
    const body = err?.error;
    if (!body) return 'Unable to connect. Please try again.';

    // DRF field-level errors: { login: [...], password: [...] }
    if (typeof body === 'object') {
      const fieldErrors = ['login', 'password']
        .map((f) => {
          const val = body[f];
          return Array.isArray(val) ? (val[0] as string) : null;
        })
        .filter(Boolean);
      if (fieldErrors.length) return fieldErrors.join(' ');

      // DRF non-field / detail errors
      const nonField = body['non_field_errors'];
      if (Array.isArray(nonField) && nonField.length) return nonField[0] as string;

      const detail = body['detail'];
      if (typeof detail === 'string') return detail;
    }

    return err.status === 400
      ? 'Invalid credentials. Please check your username and password.'
      : 'Login failed. Please try again.';
  }
}
