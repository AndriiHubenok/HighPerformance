import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  // Не показуємо помилки для auth endpoints - там є власна обробка
  const isAuthRequest = req.url.includes('/api/auth/');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Invalid request data';
            break;
          case 401:
            errorMessage = error.error?.message || 'Session expired. Please login again.';
            // Автоматичний logout при невалідному токені (але не для auth запитів)
            if (!isAuthRequest) {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');
              router.navigate(['/login']);
            }
            break;
          case 403:
            errorMessage = error.error?.message || 'Access forbidden. Insufficient rights.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found';
            break;
          case 500:
            errorMessage = error.error?.error || 'Internal server error';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status}`;
        }
      }

      // Показуємо помилку тільки якщо це не auth запит
      if (!isAuthRequest) {
        notificationService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
