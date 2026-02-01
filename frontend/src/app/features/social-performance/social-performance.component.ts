import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SocialPerformanceService, SalesmanService, NotificationService, BonusService } from '../../core/services';
import { SocialPerformance, Salesman } from '../../core/models';
import { slideInAnimation, listAnimation } from '../../shared/animations';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-social-performance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatSliderModule,
    MatProgressBarModule,
    SkeletonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation, listAnimation],
  template: `
    <div class="social-performance-page" @slideIn>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h2>Social Performance Records</h2>
          <p class="subtitle">Track and manage social performance evaluations</p>
        </div>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="salesman-select">
            <mat-label>Select Salesman</mat-label>
            <mat-select [(value)]="selectedSalesmanId" (selectionChange)="onSalesmanChange($event.value)">
              @for (salesman of salesmen(); track salesman.sid) {
                <mat-option [value]="salesman.sid">
                  {{ salesman.firstname }} {{ salesman.lastname }} ({{ salesman.sid }})
                </mat-option>
              }
            </mat-select>
          </mat-form-field>
          <button mat-flat-button color="primary"
            [disabled]="!selectedSalesmanId"
            (click)="openAddDialog()">
            <mat-icon>add</mat-icon>
            Add Record
          </button>
        </div>
      </div>

      @if (selectedSalesmanId) {
        <!-- Summary Cards -->
        <section class="summary-cards" [@listAnimation]="3">
          <mat-card class="summary-card">
            <div class="summary-icon" style="background: rgba(96, 165, 250, 0.1)">
              <mat-icon style="color: #60a5fa">assessment</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ totalRecords() }}</span>
              <span class="summary-label">Total Records</span>
            </div>
          </mat-card>

          <mat-card class="summary-card">
            <div class="summary-icon" style="background: rgba(52, 211, 153, 0.1)">
              <mat-icon style="color: #34d399">paid</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">€{{ totalBonus() | number:'1.0-0' }}</span>
              <span class="summary-label">Total Bonus</span>
            </div>
          </mat-card>

          <mat-card class="summary-card">
            <div class="summary-icon" style="background: rgba(167, 139, 250, 0.1)">
              <mat-icon style="color: #a78bfa">verified</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ approvedCount() }}</span>
              <span class="summary-label">Approved</span>
            </div>
          </mat-card>
        </section>

        <!-- Performance Table -->
        <mat-card class="table-card">
          @if (loading()) {
            <div class="skeleton-table">
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <div class="skeleton-row">
                  <app-skeleton width="150px" height="20px"></app-skeleton>
                  <app-skeleton width="80px" height="20px"></app-skeleton>
                  <app-skeleton width="80px" height="20px"></app-skeleton>
                  <app-skeleton width="100px" height="20px"></app-skeleton>
                  <app-skeleton width="60px" height="20px"></app-skeleton>
                  <app-skeleton width="80px" height="24px"></app-skeleton>
                </div>
              }
            </div>
          } @else {
            <div class="table-container">
              <table mat-table [dataSource]="dataSource" matSort>
                <!-- Description Column -->
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
                  <td mat-cell *matCellDef="let record">{{ record.description }}</td>
                </ng-container>

                <!-- Supervisor Value Column -->
                <ng-container matColumnDef="valueSupervisor">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Supervisor</th>
                  <td mat-cell *matCellDef="let record">
                    <div class="rating-cell">
                      <mat-progress-bar
                        mode="determinate"
                        [value]="record.valueSupervisor * 20"
                        [color]="getRatingColor(record.valueSupervisor)">
                      </mat-progress-bar>
                      <span>{{ record.valueSupervisor }}/5</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Peer Group Value Column -->
                <ng-container matColumnDef="valuePeerGroup">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Peer Group</th>
                  <td mat-cell *matCellDef="let record">
                    <div class="rating-cell">
                      <mat-progress-bar
                        mode="determinate"
                        [value]="record.valuePeerGroup * 20"
                        [color]="getRatingColor(record.valuePeerGroup)">
                      </mat-progress-bar>
                      <span>{{ record.valuePeerGroup }}/5</span>
                    </div>
                  </td>
                </ng-container>

                <!-- Bonus Column -->
                <ng-container matColumnDef="bonusValue">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Bonus</th>
                  <td mat-cell *matCellDef="let record">
                    <span class="bonus-badge">€{{ record.bonusValue | number:'1.0-0' }}</span>
                  </td>
                </ng-container>

                <!-- Year Column -->
                <ng-container matColumnDef="year">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Year</th>
                  <td mat-cell *matCellDef="let record">{{ record.year }}</td>
                </ng-container>

                <!-- Status Column -->
                <ng-container matColumnDef="isApprovedByCEO">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                  <td mat-cell *matCellDef="let record">
                    <mat-chip [class.approved]="record.isApprovedByCEO" [class.pending]="!record.isApprovedByCEO">
                      {{ record.isApprovedByCEO ? 'Approved' : 'Pending' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let record">
                    <div class="action-buttons">
                      <button mat-icon-button color="primary"
                        matTooltip="View Details"
                        (click)="viewDetails(record)">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button mat-icon-button color="warn"
                        matTooltip="Delete"
                        (click)="confirmDelete(record)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
              </table>
            </div>

            @if (dataSource.data.length === 0) {
              <div class="empty-state">
                <mat-icon>assessment</mat-icon>
                <h3>No performance records</h3>
                <p>Add a new social performance record to get started</p>
              </div>
            }

            <mat-paginator
              [pageSizeOptions]="[5, 10, 25]"
              [pageSize]="10"
              showFirstLastButtons>
            </mat-paginator>
          }
        </mat-card>
      } @else {
        <mat-card class="select-prompt">
          <mat-icon>person_search</mat-icon>
          <h3>Select a Salesman</h3>
          <p>Choose a salesman from the dropdown above to view their performance records</p>
        </mat-card>
      }

      <!-- Add Record Dialog -->
      <ng-template #addDialog>
        <div class="add-dialog">
          <h2 mat-dialog-title>Add Social Performance Record</h2>
          <mat-dialog-content>
            <form [formGroup]="recordForm" class="record-form">
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <input matInput formControlName="description" placeholder="e.g., Leadership Skills">
                @if (recordForm.get('description')?.hasError('required')) {
                  <mat-error>Description is required</mat-error>
                }
              </mat-form-field>

              <div class="rating-inputs">
                <mat-form-field appearance="outline">
                  <mat-label>Supervisor Rating (1-5)</mat-label>
                  <input matInput type="number" formControlName="valueSupervisor" min="1" max="5">
                  @if (recordForm.get('valueSupervisor')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                  @if (recordForm.get('valueSupervisor')?.hasError('min') || recordForm.get('valueSupervisor')?.hasError('max')) {
                    <mat-error>Must be between 1 and 5</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Peer Group Rating (1-5)</mat-label>
                  <input matInput type="number" formControlName="valuePeerGroup" min="1" max="5">
                  @if (recordForm.get('valuePeerGroup')?.hasError('required')) {
                    <mat-error>Required</mat-error>
                  }
                  @if (recordForm.get('valuePeerGroup')?.hasError('min') || recordForm.get('valuePeerGroup')?.hasError('max')) {
                    <mat-error>Must be between 1 and 5</mat-error>
                  }
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline">
                <mat-label>Year</mat-label>
                <mat-select formControlName="year">
                  @for (year of years; track year) {
                    <mat-option [value]="year">{{ year }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Remarks (Optional)</mat-label>
                <textarea matInput formControlName="remarks" rows="3"></textarea>
              </mat-form-field>
            </form>
          </mat-dialog-content>
          <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button mat-flat-button color="primary"
              [disabled]="recordForm.invalid"
              (click)="onAddRecord()">
              Add Record
            </button>
          </mat-dialog-actions>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .social-performance-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 16px;

      h2 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 600;
        color: var(--text-primary, #1a1a2e);
      }

      .subtitle {
        margin: 4px 0 0;
        color: var(--text-secondary, #666);
      }
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .salesman-select {
      min-width: 250px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      border-radius: 16px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-4px);
      }
    }

    .summary-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }

    .summary-content {
      display: flex;
      flex-direction: column;
    }

    .summary-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary, #1a1a2e);
    }

    .summary-label {
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .table-card {
      border-radius: 16px;
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }

    .rating-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 120px;

      mat-progress-bar {
        flex: 1;
        border-radius: 4px;
      }

      span {
        font-size: 0.875rem;
        font-weight: 500;
        min-width: 30px;
      }
    }

    .bonus-badge {
      background: linear-gradient(135deg, #34d399, #10b981);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    .approved {
      background-color: rgba(34, 197, 94, 0.1) !important;
      color: #22c55e !important;
    }

    .pending {
      background-color: rgba(245, 158, 11, 0.1) !important;
      color: #f59e0b !important;
    }

    .table-row {
      transition: background 0.2s ease;

      &:hover {
        background: var(--hover-bg, rgba(0, 0, 0, 0.02));
      }
    }

    .skeleton-table {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .skeleton-row {
      display: flex;
      gap: 24px;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
    }

    .select-prompt, .empty-state {
      padding: 64px;
      text-align: center;
      color: var(--text-secondary, #666);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        opacity: 0.3;
      }

      h3 {
        margin: 16px 0 8px;
        font-size: 1.25rem;
      }

      p {
        margin: 0;
      }
    }

    .add-dialog {
      min-width: 450px;
    }

    .record-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 16px;
    }

    .rating-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    :host-context(.dark-theme) {
      .page-header h2 {
        color: white;
      }

      .page-header .subtitle {
        color: #94a3b8;
      }

      .summary-card, .table-card, .select-prompt {
        background: #1e1e2d;
      }

      .summary-value {
        color: white;
      }

      .summary-label {
        color: #94a3b8;
      }

      .table-row:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      .select-prompt {
        color: #94a3b8;

        h3 {
          color: #e2e8f0;
        }
      }

      .empty-state {
        color: #94a3b8;

        h3 {
          color: #e2e8f0;
        }
      }
    }
  `]
})
export class SocialPerformanceComponent implements OnInit {
  private readonly socialPerformanceService = inject(SocialPerformanceService);
  private readonly salesmanService = inject(SalesmanService);
  private readonly bonusService = inject(BonusService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('addDialog') addDialogTemplate: any;

  readonly loading = signal(false);
  readonly salesmen = signal<Salesman[]>([]);
  readonly records = signal<SocialPerformance[]>([]);

  readonly totalRecords = () => this.records().length;
  readonly totalBonus = () => this.records().reduce((sum, r) => sum + r.bonusValue, 0);
  readonly approvedCount = () => this.records().filter(r => r.isApprovedByCEO).length;

  dataSource = new MatTableDataSource<SocialPerformance>([]);
  displayedColumns = ['description', 'valueSupervisor', 'valuePeerGroup', 'bonusValue', 'year', 'isApprovedByCEO', 'actions'];

  selectedSalesmanId: number | null = null;
  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  recordForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadSalesmen();

    // Check for route parameter
    const sid = this.route.snapshot.paramMap.get('sid');
    if (sid) {
      this.selectedSalesmanId = parseInt(sid, 10);
      this.loadRecords(this.selectedSalesmanId);
    }
  }

  private initForm(): void {
    this.recordForm = this.fb.group({
      description: ['', Validators.required],
      valueSupervisor: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      valuePeerGroup: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      year: [new Date().getFullYear(), Validators.required],
      remarks: ['']
    });
  }

  private loadSalesmen(): void {
    this.salesmanService.getSalesmen().subscribe({
      next: (data) => this.salesmen.set(data)
    });
  }

  private loadRecords(sid: number): void {
    this.loading.set(true);
    this.socialPerformanceService.clearCache();

    this.socialPerformanceService.getByaSalesmanId(sid).subscribe({
      next: (data) => {
        this.records.set(data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSalesmanChange(sid: number): void {
    this.loadRecords(sid);
  }

  getRatingColor(value: number): 'primary' | 'accent' | 'warn' {
    if (value >= 4) return 'primary';
    if (value >= 3) return 'accent';
    return 'warn';
  }

  openAddDialog(): void {
    this.recordForm.reset({
      year: new Date().getFullYear()
    });

    this.dialog.open(this.addDialogTemplate, {
      panelClass: 'custom-dialog'
    });
  }

  onAddRecord(): void {
    if (this.recordForm.invalid || !this.selectedSalesmanId) return;

    const formValue = {
      ...this.recordForm.value,
      salesmanId: this.selectedSalesmanId
    };

    this.bonusService.addSocialPerformanceWithBonus(formValue).subscribe({
      next: () => {
        this.notificationService.success('Performance record added successfully');
        this.dialog.closeAll();
        this.loadRecords(this.selectedSalesmanId!);
      }
    });
  }

  viewDetails(record: SocialPerformance): void {
    // Could open a details dialog
    console.log('View details:', record);
  }

  confirmDelete(record: SocialPerformance): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Record',
        message: `Are you sure you want to delete the record "${record.description}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && record._id) {
        this.socialPerformanceService.delete(record._id).subscribe({
          next: () => {
            this.notificationService.success('Record deleted successfully');
            this.loadRecords(this.selectedSalesmanId!);
          }
        });
      }
    });
  }
}

