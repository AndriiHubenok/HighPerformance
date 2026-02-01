import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../../core/services/notification.service';
import { slideFromRightAnimation } from '../../animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [slideFromRightAnimation],
  template: `
    <div class="toast-container">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast-' + toast.type"
          @slideFromRight
          (click)="notificationService.remove(toast.id)">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <span class="icon">✓</span> }
              @case ('error') { <span class="icon">✕</span> }
              @case ('warning') { <span class="icon">⚠</span> }
              @case ('info') { <span class="icon">ℹ</span> }
            }
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" (click)="notificationService.remove(toast.id); $event.stopPropagation()">
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateX(-5px);
      }
    }

    .toast-success {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9));
      color: white;
    }

    .toast-error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
      color: white;
    }

    .toast-warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9));
      color: white;
    }

    .toast-info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9));
      color: white;
    }

    .toast-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      margin-right: 12px;

      .icon {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .toast-message {
      flex: 1;
      font-weight: 500;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.7;
      cursor: pointer;
      padding: 4px;
      margin-left: 8px;

      &:hover {
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);
}
