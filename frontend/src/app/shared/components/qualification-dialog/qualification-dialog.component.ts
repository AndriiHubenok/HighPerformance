import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { scaleAnimation } from '../../animations';

export interface QualificationDialogData {
  title: string;
  message: string;
  salesmanName?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface QualificationDialogResult {
  confirmed: boolean;
  qualification?: string;
}

@Component({
  selector: 'app-qualification-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  animations: [scaleAnimation],
  template: `
    <div class="qualification-dialog" @scale>
      <div class="dialog-header">
        <div class="icon-wrapper">
          <span class="icon">🏆</span>
        </div>
        <h2>{{ data.title }}</h2>
      </div>

      <div class="dialog-content">
        <p>{{ data.message }}</p>
        @if (data.salesmanName) {
          <p class="salesman-name"><strong>Salesman:</strong> {{ data.salesmanName }}</p>
        }

        <mat-form-field appearance="outline" class="qualification-field">
          <mat-label>Qualification</mat-label>
          <textarea
            matInput
            [(ngModel)]="qualification"
            placeholder="Enter qualification for this salesman..."
            rows="3">
          </textarea>
          <mat-hint>This qualification will be stored in OrangeHRM</mat-hint>
        </mat-form-field>
      </div>

      <div class="dialog-actions">
        <button mat-stroked-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="onConfirm()">
          {{ data.confirmText || 'Approve' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .qualification-dialog {
      padding: 0;
      min-width: 400px;
    }

    .dialog-header {
      padding: 24px 24px 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%);

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
      background: rgba(245, 158, 11, 0.2);
    }

    .dialog-content {
      padding: 16px 24px 24px;

      p {
        margin: 0 0 12px;
        color: var(--text-secondary, #666);
        line-height: 1.6;
      }

      .salesman-name {
        color: var(--text-primary, #333);
        font-size: 0.95rem;
        margin-bottom: 16px;
      }
    }

    .qualification-field {
      width: 100%;
      margin-top: 8px;
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

      .dialog-content .salesman-name {
        color: #eee;
      }

      .dialog-actions {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  `]
})
export class QualificationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<QualificationDialogComponent>);
  readonly data: QualificationDialogData = inject(MAT_DIALOG_DATA);

  qualification: string = '';

  onConfirm(): void {
    this.dialogRef.close({
      confirmed: true,
      qualification: this.qualification
    } as QualificationDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({
      confirmed: false
    } as QualificationDialogResult);
  }
}

