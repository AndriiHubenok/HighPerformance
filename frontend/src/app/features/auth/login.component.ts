import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { fadeInAnimation, slideInAnimation } from '../../shared/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  animations: [fadeInAnimation, slideInAnimation],
  template: `
    <div class="login-container" @fadeIn>
      <div class="login-background">
        <div class="gradient-circle circle-1"></div>
        <div class="gradient-circle circle-2"></div>
        <div class="gradient-circle circle-3"></div>
      </div>

      <div class="login-card" @slideIn>
        <div class="login-header">
          <div class="logo">
            <mat-icon class="logo-icon">analytics</mat-icon>
          </div>
          <h1>HighPerformance</h1>
          <p class="subtitle">Sales Management System</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Enter your username">
            <mat-icon matPrefix>person</mat-icon>
            @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
              <mat-error>Username is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput
                   [type]="hidePassword() ? 'password' : 'text'"
                   formControlName="password"
                   placeholder="Enter your password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
              <mat-error>Password is required</mat-error>
            }
          </mat-form-field>

          <div class="form-options">
            <mat-checkbox formControlName="rememberMe" color="primary">
              Remember me
            </mat-checkbox>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <button mat-flat-button
                  color="primary"
                  type="submit"
                  class="login-button"
                  [disabled]="isLoading() || loginForm.invalid">
            @if (isLoading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Signing in...</span>
            } @else {
              <mat-icon>login</mat-icon>
              <span>Sign In</span>
            }
          </button>
        </form>

        <div class="register-link">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>
      </div>

      <div class="footer">
        <p>© 2024 HighPerformance. All rights reserved.</p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
      background: var(--background-color, #f5f5f5);
    }

    .login-background {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .gradient-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
    }

    .circle-1 {
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      top: -200px;
      right: -200px;
    }

    .circle-2 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      bottom: -100px;
      left: -100px;
    }

    .circle-3 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .login-card {
      background: var(--card-background, white);
      border-radius: 24px;
      padding: 48px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      z-index: 1;
      backdrop-filter: blur(10px);
    }

    :host-context(.dark-theme) .login-card {
      background: rgba(30, 30, 30, 0.95);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .logo-icon {
      color: white;
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-secondary, #666);
      margin: 0;
      font-size: 14px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      ::ng-deep .mat-mdc-text-field-wrapper {
        background: var(--input-background, #f5f5f5);
        border-radius: 12px;
      }

      ::ng-deep .mat-mdc-form-field-outline {
        color: var(--border-color, #e0e0e0);
      }

      ::ng-deep .mdc-notched-outline__leading,
      ::ng-deep .mdc-notched-outline__notch,
      ::ng-deep .mdc-notched-outline__trailing {
        border-color: var(--border-color, #e0e0e0) !important;
      }

      ::ng-deep .mat-mdc-form-field-icon-prefix {
        color: var(--text-secondary, #666);
        padding-right: 8px;
      }
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
    }

    .forgot-link {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;

      &:hover {
        text-decoration: underline;
      }
    }

    .login-button {
      height: 52px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-top: 8px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      }

      &:disabled {
        background: #ccc;
      }

      ::ng-deep .mdc-button__label {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      mat-spinner {
        display: inline-block;
      }
    }

    .register-link {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color, #e0e0e0);
      text-align: center;

      p {
        margin: 0;
        color: var(--text-secondary, #666);
        font-size: 14px;
      }

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .footer {
      position: absolute;
      bottom: 20px;
      text-align: center;
      color: var(--text-secondary, #666);
      font-size: 12px;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 32px 24px;
        border-radius: 20px;
      }

      h1 {
        font-size: 24px;
      }

      .demo-users {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  loginForm: FormGroup;
  isLoading = signal(false);
  hidePassword = signal(true);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.notificationService.success(`Welcome back, ${user.username}!`);

        // Перенаправляємо на збережений URL або dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || 'Invalid username or password';
        this.notificationService.error(message);
      }
    });
  }
}

