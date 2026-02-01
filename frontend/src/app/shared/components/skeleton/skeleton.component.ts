import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [style.width]="width" [style.height]="height" [class.skeleton-circle]="circle">
    </div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(
        90deg,
        var(--skeleton-base, rgba(128, 128, 128, 0.1)) 0%,
        var(--skeleton-shine, rgba(128, 128, 128, 0.2)) 50%,
        var(--skeleton-base, rgba(128, 128, 128, 0.1)) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 8px;
    }

    .skeleton-circle {
      border-radius: 50%;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    :host-context(.dark-theme) .skeleton {
      --skeleton-base: rgba(255, 255, 255, 0.1);
      --skeleton-shine: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() circle = false;
}

