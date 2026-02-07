import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { debounceTime, Subject } from 'rxjs';
import { SalesmanService, NotificationService, AuthService } from '../../core/services';
import { Salesman, SalesmanInput } from '../../core/models';
import { slideInAnimation, listAnimation } from '../../shared/animations';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-salesmen-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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
    SkeletonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation, listAnimation],
  template: `
    <div class="salesmen-page" @slideIn>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h2>Salesmen Management</h2>
          <p class="subtitle">Manage your sales team members</p>
        </div>
        @if (canManageSalesmen()) {
          <button mat-flat-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon>
            Add Salesman
          </button>
        }
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <div class="filters">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput
              [formControl]="searchControl"
              placeholder="Search by name, ID...">
            @if (searchControl.value) {
              <button matSuffix mat-icon-button (click)="searchControl.reset()">
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Year</mat-label>
            <mat-select [(value)]="selectedYear" (selectionChange)="applyFilters()">
              <mat-option [value]="null">All Years</mat-option>
              @for (year of years; track year) {
                <mat-option [value]="year">{{ year }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select [(value)]="selectedDepartment" (selectionChange)="applyFilters()">
              <mat-option [value]="null">All Departments</mat-option>
              @for (dept of departments(); track dept) {
                <mat-option [value]="dept">{{ dept }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <!-- Table -->
      <mat-card class="table-card">
        @if (loading()) {
          <div class="skeleton-table">
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <div class="skeleton-row">
                <app-skeleton width="60px" height="20px"></app-skeleton>
                <app-skeleton width="120px" height="20px"></app-skeleton>
                <app-skeleton width="120px" height="20px"></app-skeleton>
                <app-skeleton width="100px" height="20px"></app-skeleton>
                <app-skeleton width="80px" height="20px"></app-skeleton>
                <app-skeleton width="100px" height="32px"></app-skeleton>
              </div>
            }
          </div>
        } @else {
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort>
              <!-- SID Column -->
              <ng-container matColumnDef="sid">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let salesman">
                  <span class="id-badge">{{ salesman.sid }}</span>
                </td>
              </ng-container>

              <!-- First Name Column -->
              <ng-container matColumnDef="firstname">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>First Name</th>
                <td mat-cell *matCellDef="let salesman">
                  <div class="name-cell">
                    <div class="avatar">{{ salesman.firstname[0] }}{{ salesman.lastname[0] }}</div>
                    {{ salesman.firstname }}
                  </div>
                </td>
              </ng-container>

              <!-- Last Name Column -->
              <ng-container matColumnDef="lastname">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Name</th>
                <td mat-cell *matCellDef="let salesman">{{ salesman.lastname }}</td>
              </ng-container>

              <!-- Department Column -->
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
                <td mat-cell *matCellDef="let salesman">
                  <mat-chip>{{ salesman.department }}</mat-chip>
                </td>
              </ng-container>

              <!-- Year Column -->
              <ng-container matColumnDef="yearOfPerformance">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Year</th>
                <td mat-cell *matCellDef="let salesman">{{ salesman.yearOfPerformance }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let salesman">
                  <div class="action-buttons">
                    @if (canManageSalesmen()) {
                      <button mat-icon-button color="primary"
                        matTooltip="Edit"
                        (click)="openEditDialog(salesman)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn"
                        matTooltip="Delete"
                        (click)="confirmDelete(salesman)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    }
                    <button mat-icon-button
                      matTooltip="View Performance"
                      [routerLink]="['/social-performance', salesman.sid]">
                      <mat-icon>assessment</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                class="table-row"></tr>
            </table>
          </div>

          @if (dataSource.data.length === 0) {
            <div class="empty-state">
              <mat-icon>person_off</mat-icon>
              <h3>No salesmen found</h3>
              <p>Try adjusting your search or add a new salesman</p>
            </div>
          }

          <mat-paginator
            [pageSizeOptions]="[5, 10, 25, 50]"
            [pageSize]="10"
            showFirstLastButtons>
          </mat-paginator>
        }
      </mat-card>

      <!-- Create/Edit Dialog Template -->
      <ng-template #formDialog let-data>
        <div class="form-dialog">
          <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Salesman' : 'Add New Salesman' }}</h2>
          <mat-dialog-content>
            <form [formGroup]="salesmanForm" class="salesman-form">
              <mat-form-field appearance="outline">
                <mat-label>Salesman ID</mat-label>
                <input matInput formControlName="sid" type="number" [readonly]="data.isEdit">
                @if (salesmanForm.get('sid')?.hasError('required')) {
                  <mat-error>ID is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstname">
                @if (salesmanForm.get('firstname')?.hasError('required')) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastname">
                @if (salesmanForm.get('lastname')?.hasError('required')) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Department</mat-label>
                <input matInput formControlName="department">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Year of Performance</mat-label>
                <input matInput formControlName="yearOfPerformance" type="number">
              </mat-form-field>
            </form>
          </mat-dialog-content>
          <mat-dialog-actions align="end">
            <button mat-button mat-dialog-close>Cancel</button>
            <button mat-flat-button color="primary"
              [disabled]="salesmanForm.invalid"
              (click)="onSave(data.isEdit)">
              {{ data.isEdit ? 'Update' : 'Create' }}
            </button>
          </mat-dialog-actions>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .salesmen-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

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

    .filters-card {
      padding: 24px;
      border-radius: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .search-field {
        flex: 1;
        min-width: 300px;
      }
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

    .id-badge {
      background: var(--primary-light, rgba(96, 165, 250, 0.1));
      color: var(--primary-color, #60a5fa);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .table-row {
      transition: background 0.2s ease;

      &:hover {
        background: var(--hover-bg, rgba(0, 0, 0, 0.02));
      }
    }

    .action-buttons {
      display: flex;
      gap: 4px;
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

    .empty-state {
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

    .form-dialog {
      min-width: 400px;
    }

    .salesman-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 16px;
    }

    :host-context(.dark-theme) {
      .page-header h2 {
        color: white;
      }

      .page-header .subtitle {
        color: #94a3b8;
      }

      .filters-card, .table-card {
        background: #1e1e2d;
      }

      .table-row:hover {
        background: rgba(255, 255, 255, 0.05);
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
export class SalesmenListComponent implements OnInit {
  private readonly salesmanService = inject(SalesmanService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('formDialog') formDialogTemplate: any;

  readonly loading = signal(true);
  readonly salesmen = signal<Salesman[]>([]);
  readonly departments = computed(() =>
    [...new Set(this.salesmen().map(s => s.department))]
  );

  dataSource = new MatTableDataSource<Salesman>([]);
  displayedColumns = ['sid', 'firstname', 'lastname', 'department', 'yearOfPerformance', 'actions'];

  searchControl = this.fb.control('');
  selectedYear: number | null = null;
  selectedDepartment: string | null = null;

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  salesmanForm!: FormGroup;
  private editingSalesman: Salesman | null = null;
  private searchSubject = new Subject<string>();

  // Перевірка прав доступу
  canManageSalesmen(): boolean {
    return this.authService.hasRole(['HR', 'CEO']);
  }

  ngOnInit(): void {
    this.initForm();
    this.loadSalesmen();
    this.setupSearch();
  }

  private initForm(): void {
    this.salesmanForm = this.fb.group({
      sid: [null, [Validators.required, Validators.min(1)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      department: ['Sales'],
      yearOfPerformance: [new Date().getFullYear()]
    });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.applyFilters();
      });
  }

  private loadSalesmen(): void {
    this.loading.set(true);
    this.salesmanService.clearCache();

    this.salesmanService.getSalesmen().subscribe({
      next: (data) => {
        this.salesmen.set(data);
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

  applyFilters(): void {
    let filtered = this.salesmen();

    const search = this.searchControl.value?.toLowerCase() || '';
    if (search) {
      filtered = filtered.filter(s =>
        s.firstname.toLowerCase().includes(search) ||
        s.lastname.toLowerCase().includes(search) ||
        s.sid.toString().includes(search)
      );
    }

    if (this.selectedYear) {
      filtered = filtered.filter(s => s.yearOfPerformance === this.selectedYear);
    }

    if (this.selectedDepartment) {
      filtered = filtered.filter(s => s.department === this.selectedDepartment);
    }

    this.dataSource.data = filtered;
  }

  openCreateDialog(): void {
    this.editingSalesman = null;
    this.salesmanForm.reset({
      department: 'Sales',
      yearOfPerformance: new Date().getFullYear()
    });
    this.salesmanForm.get('sid')?.enable();

    this.dialog.open(this.formDialogTemplate, {
      data: { isEdit: false },
      panelClass: 'custom-dialog'
    });
  }

  openEditDialog(salesman: Salesman): void {
    this.editingSalesman = salesman;
    this.salesmanForm.patchValue(salesman);
    this.salesmanForm.get('sid')?.disable();

    this.dialog.open(this.formDialogTemplate, {
      data: { isEdit: true },
      panelClass: 'custom-dialog'
    });
  }

  onSave(isEdit: boolean): void {
    if (this.salesmanForm.invalid) return;

    const formValue = this.salesmanForm.getRawValue();

    if (isEdit && this.editingSalesman) {
      this.salesmanService.updateSalesman(this.editingSalesman.sid, formValue).subscribe({
        next: () => {
          this.notificationService.success('Salesman updated successfully');
          this.dialog.closeAll();
          this.loadSalesmen();
        }
      });
    } else {
      this.salesmanService.createSalesman(formValue).subscribe({
        next: () => {
          this.notificationService.success('Salesman created successfully');
          this.dialog.closeAll();
          this.loadSalesmen();
        }
      });
    }
  }

  confirmDelete(salesman: Salesman): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Salesman',
        message: `Are you sure you want to delete ${salesman.firstname} ${salesman.lastname}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.salesmanService.deleteSalesman(salesman.sid).subscribe({
          next: () => {
            this.notificationService.success('Salesman deleted successfully');
            this.loadSalesmen();
          }
        });
      }
    });
  }
}

