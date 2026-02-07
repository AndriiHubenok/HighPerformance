import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { fadeInAnimation, slideInAnimation } from '../../shared/animations';

@Component({
  selector: 'app-register',
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
    MatSelectModule
  ],
  animations: [fadeInAnimation, slideInAnimation],
  template: `
    <div class="register-container" @fadeIn>
      <div class="register-background">
        <div class="gradient-circle circle-1"></div>
        <div class="gradient-circle circle-2"></div>
        <div class="gradient-circle circle-3"></div>
      </div>

      <div class="register-card" @slideIn>
        <div class="register-header">
          <div class="logo">
            <mat-icon class="logo-icon">analytics</mat-icon>
          </div>
          <h1>Create Account</h1>
          <p class="subtitle">Join HighPerformance System</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Username</mat-label>
            <input matInput formControlName="username" placeholder="Choose a username">
            <mat-icon matPrefix>person</mat-icon>
            @if (registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched) {
              <mat-error>Username is required</mat-error>
            }
            @if (registerForm.get('username')?.hasError('minlength')) {
              <mat-error>Username must be at least 3 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput
                   [type]="hidePassword() ? 'password' : 'text'"
                   formControlName="password"
                   placeholder="Create a password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
              <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
              <mat-error>Password is required</mat-error>
            }
            @if (registerForm.get('password')?.hasError('minlength')) {
              <mat-error>Password must be at least 6 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput
                   [type]="hideConfirmPassword() ? 'password' : 'text'"
                   formControlName="confirmPassword"
                   placeholder="Confirm your password">
            <mat-icon matPrefix>lock_outline</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="toggleConfirmPasswordVisibility()">
              <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
              <mat-error>Please confirm your password</mat-error>
            }
            @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
              <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="SALESMAN">
                <mat-icon>person</mat-icon>
                Salesman
              </mat-option>
              <mat-option value="HR">
                <mat-icon>people</mat-icon>
                HR Manager
              </mat-option>
              <mat-option value="CEO">
                <mat-icon>business</mat-icon>
                CEO
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>badge</mat-icon>
            @if (registerForm.get('role')?.hasError('required') && registerForm.get('role')?.touched) {
              <mat-error>Please select a role</mat-error>
            }
          </mat-form-field>

          @if (registerForm.get('role')?.value === 'SALESMAN') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Salesman ID</mat-label>
              <input matInput type="number" formControlName="linkedSalesmanId" placeholder="Enter your Salesman ID">
              <mat-icon matPrefix>tag</mat-icon>
              <mat-hint>Link to your salesman profile</mat-hint>
            </mat-form-field>
          }

          <button mat-flat-button
                  color="primary"
                  type="submit"
                  class="register-button"
                  [disabled]="isLoading() || registerForm.invalid">
            @if (isLoading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Creating account...</span>
            } @else {
              <mat-icon>person_add</mat-icon>
              <span>Create Account</span>
            }
          </button>
        </form>

        <div class="login-link">
          <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
        </div>
      </div>

      <div class="footer">
        <p>© 2024 HighPerformance. All rights reserved.</p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
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

    .register-background {
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

    .register-card {
      background: var(--card-background, white);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      z-index: 1;
      backdrop-filter: blur(10px);
    }

    :host-context(.dark-theme) .register-card {
      background: rgba(30, 30, 30, 0.95);
    }

    .register-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .logo {
      width: 70px;
      height: 70px;
      margin: 0 auto 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .logo-icon {
      color: white;
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    h1 {
      font-size: 24px;
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      ::ng-deep .mat-mdc-text-field-wrapper {
        background: var(--input-background, #f5f5f5);
        border-radius: 12px;
      }

      ::ng-deep .mat-mdc-form-field-icon-prefix {
        color: var(--text-secondary, #666);
        padding-right: 8px;
      }
    }

    .register-button {
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

    .login-link {
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
      .register-card {
        padding: 32px 24px;
        border-radius: 20px;
      }

      h1 {
        font-size: 22px;
      }
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registerForm: FormGroup;
  isLoading = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]],
      linkedSalesmanId: [null]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const { username, password, role, linkedSalesmanId } = this.registerForm.value;

    const credentials = {
      username,
      password,
      role,
      ...(role === 'SALESMAN' && linkedSalesmanId ? { linkedSalesmanId } : {})
    };

    this.authService.register(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notificationService.success('Account created successfully! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading.set(false);
        const message = error?.error?.message || error?.error?.error || 'Registration failed';
        this.notificationService.error(message);
      }
    });
  }
}

