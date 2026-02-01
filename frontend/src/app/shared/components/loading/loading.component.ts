import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { fadeInAnimation } from '../../animations';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  animations: [fadeInAnimation],
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay" @fadeIn>
        <div class="loading-spinner">
          <div class="spinner"></div>
          <span class="loading-text">Loading...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;
      background: var(--surface-card, white);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--surface-border, #e0e0e0);
      border-top-color: var(--primary-color, #3b82f6);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      font-weight: 500;
      color: var(--text-secondary, #666);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    :host-context(.dark-theme) {
      .loading-spinner {
        background: #1e1e1e;
      }

      .spinner {
        border-color: #333;
        border-top-color: #60a5fa;
      }

      .loading-text {
        color: #aaa;
      }
    }
  `]
})
export class LoadingComponent {
  readonly loadingService = inject(LoadingService);
}

