import { ChangeDetectorRef, Component, inject } from '@angular/core';
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

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    const { loginId, password } = this.loginForm.value;
    this.authService.signin(
      { loginId, password },
      (res) => {
        //keep response.data.user object in the local storage for later use
        localStorage.setItem('user', res.data.user);
        console.log('Login successful:',JSON.stringify(localStorage.getItem('user')));
        this.router.navigate(['/welcome']);
      },
      (res: any) => {
        this.loading = false;
        this.errorMessage = res?.['message'] || 'Login failed. Please check your credentials and try again.';
        this.cdr.markForCheck();
      }
    );
  }
}
