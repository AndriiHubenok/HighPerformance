import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { scaleAnimation } from '../../animations';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  animations: [scaleAnimation],
  template: `
    <div class="confirm-dialog" @scale>
      <div class="dialog-header" [class]="'header-' + (data.type || 'info')">
        <div class="icon-wrapper">
          @switch (data.type) {
            @case ('danger') { <span class="icon">🗑️</span> }
            @case ('warning') { <span class="icon">⚠️</span> }
            @default { <span class="icon">ℹ️</span> }
          }
        </div>
        <h2>{{ data.title }}</h2>
      </div>

      <div class="dialog-content">
        <p>{{ data.message }}</p>
      </div>

      <div class="dialog-actions">
        <button mat-stroked-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-flat-button
          [color]="data.type === 'danger' ? 'warn' : 'primary'"
          (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 0;
      min-width: 350px;
    }

    .dialog-header {
      padding: 24px 24px 16px;
      display: flex;
      align-items: center;
      gap: 16px;

      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .header-danger .icon-wrapper {
      background: rgba(239, 68, 68, 0.1);
    }

    .header-warning .icon-wrapper {
      background: rgba(245, 158, 11, 0.1);
    }

    .header-info .icon-wrapper {
      background: rgba(59, 130, 246, 0.1);
    }

    .dialog-content {
      padding: 0 24px 24px;

      p {
        margin: 0;
        color: var(--text-secondary, #666);
        line-height: 1.6;
      }
    }

    .dialog-actions {
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: var(--surface-variant, #f5f5f5);
      border-radius: 0 0 16px 16px;
    }

    :host-context(.dark-theme) {
      .dialog-content p {
        color: #aaa;
      }

      .dialog-actions {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  `]
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

