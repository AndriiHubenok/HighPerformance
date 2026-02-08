import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { BonusService, SalesmanService, NotificationService, AuthService } from '../../core/services';
import { Salesman, BonusCockpit, OrderPerformance } from '../../core/models';
import { slideInAnimation, expandAnimation } from '../../shared/animations';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bonus-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    NgxChartsModule,
    SkeletonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation, expandAnimation],
  template: `
    <div class="bonus-page" @slideIn>
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h2>Bonus Management</h2>
          <p class="subtitle">Review and approve bonus calculations</p>
        </div>
        @if (canManageBonus()) {
          <button mat-flat-button color="accent" (click)="syncFromOrangeHRM()">
            <mat-icon>sync</mat-icon>
            Sync from OrangeHRM
          </button>
        }
      </div>

      <!-- Selection Panel -->
      <mat-card class="selection-card">
        <div class="selection-form">
          <mat-form-field appearance="outline">
            <mat-label>Select Salesman</mat-label>
            <mat-select [(value)]="selectedSalesmanId" (selectionChange)="onSelectionChange()">
              @for (salesman of salesmen(); track salesman.sid) {
                <mat-option [value]="salesman.sid">
                  {{ salesman.firstname }} {{ salesman.lastname }} ({{ salesman.sid }})
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Year</mat-label>
            <mat-select [(value)]="selectedYear" (selectionChange)="onSelectionChange()">
              @for (year of years; track year) {
                <mat-option [value]="year">{{ year }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <button mat-flat-button color="primary"
            [disabled]="!selectedSalesmanId || !selectedYear"
            (click)="loadCockpit()">
            <mat-icon>search</mat-icon>
            Load Data
          </button>
        </div>
      </mat-card>

      @if (cockpitLoading()) {
        <div class="loading-cockpit">
          <mat-card class="skeleton-card">
            <app-skeleton height="200px"></app-skeleton>
          </mat-card>
          <mat-card class="skeleton-card">
            <app-skeleton height="200px"></app-skeleton>
          </mat-card>
        </div>
      } @else if (cockpit()) {
        <!-- Cockpit Summary -->
        <section class="cockpit-summary">
          <mat-card class="grand-total-card">
            <div class="total-content">
              <div class="total-icon">💰</div>
              <div class="total-info">
                <span class="total-label">Grand Total Bonus</span>
                <span class="total-value">€{{ cockpit()!.grandTotal | number:'1.2-2' }}</span>
              </div>
            </div>
            <div class="total-actions">
              @if (canManageBonus()) {
                <button mat-stroked-button color="primary" (click)="fetchOrderData()">
                  <mat-icon>download</mat-icon>
                  Fetch Orders
                </button>
              }
              @if (canApproveBonus()) {
                <button mat-flat-button color="primary" (click)="approveBonus()">
                  <mat-icon>check_circle</mat-icon>
                  Approve Bonus
                </button>
              }
              @if (canApproveBonus()) {
                <button mat-flat-button color="accent" (click)="finalApproval()">
                  <mat-icon>verified</mat-icon>
                  Final Approval
                </button>
              }
            </div>
          </mat-card>
        </section>

        <!-- Bonus Breakdown -->
        <section class="bonus-breakdown">
          <mat-card class="breakdown-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>psychology</mat-icon>
                Social Performance Bonus
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="breakdown-value">
                €{{ cockpit()!.socialBonus.total || 0 | number:'1.2-2' }}
              </div>
              <div class="breakdown-chart">
                <ngx-charts-pie-chart
                  [results]="socialBonusData()"
                  [legend]="false"
                  [labels]="true"
                  [doughnut]="true"
                  [arcWidth]="0.3"
                  [animations]="true"
                  [scheme]="colorScheme">
                </ngx-charts-pie-chart>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="breakdown-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>shopping_cart</mat-icon>
                Order Performance Bonus
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="breakdown-value">
                €{{ cockpit()!.ordersBonus.total || 0 | number:'1.2-2' }}
              </div>
              <div class="breakdown-chart">
                <ngx-charts-pie-chart
                  [results]="orderBonusData()"
                  [legend]="false"
                  [labels]="true"
                  [doughnut]="true"
                  [arcWidth]="0.3"
                  [animations]="true"
                  [scheme]="colorScheme">
                </ngx-charts-pie-chart>
              </div>
            </mat-card-content>
          </mat-card>
        </section>

        <!-- Qualifications -->
        @if (cockpit()!.qualifications.length) {
          <mat-card class="qualifications-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>workspace_premium</mat-icon>
                Qualifications
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="qualifications-list">
                @for (qual of cockpit()!.qualifications; track qual) {
                  <mat-chip class="qualification-chip">
                    <mat-icon>star</mat-icon>
                    {{ qual }}
                  </mat-chip>
                }
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Order Details -->
        @if (orders().length > 0) {
          <mat-card class="orders-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>receipt_long</mat-icon>
                Order Details
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="orders-table">
                <table mat-table [dataSource]="orders()">
                  <ng-container matColumnDef="orderId">
                    <th mat-header-cell *matHeaderCellDef>Order ID</th>
                    <td mat-cell *matCellDef="let order">{{ order.orderId }}</td>
                  </ng-container>

                  <ng-container matColumnDef="clientName">
                    <th mat-header-cell *matHeaderCellDef>Client</th>
                    <td mat-cell *matCellDef="let order">{{ order.clientName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="productName">
                    <th mat-header-cell *matHeaderCellDef>Product</th>
                    <td mat-cell *matCellDef="let order">{{ order.productName }}</td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let order">€{{ order.amount | number:'1.2-2' }}</td>
                  </ng-container>

                  <ng-container matColumnDef="computedBonus">
                    <th mat-header-cell *matHeaderCellDef>Bonus</th>
                    <td mat-cell *matCellDef="let order">
                      <span class="bonus-chip">€{{ order.computedBonus | number:'1.2-2' }}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let order">
                      <mat-chip [class.approved]="order.ceoReviewStatus">
                        {{ order.ceoReviewStatus ? 'Approved' : 'Pending' }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="orderColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: orderColumns;"></tr>
                </table>
              </div>
            </mat-card-content>
          </mat-card>
        }
      } @else {
        <mat-card class="empty-cockpit">
          <mat-icon>analytics</mat-icon>
          <h3>Select Salesman and Year</h3>
          <p>Choose a salesman and year to view their bonus cockpit</p>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .bonus-page {
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
        color: var(--text-secondary, #64748b);
      }
    }

    .selection-card {
      padding: 24px;
      border-radius: 16px;
      background: var(--surface-card, white);
    }

    .selection-form {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;

      mat-form-field {
        min-width: 200px;
      }
    }

    .loading-cockpit {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .skeleton-card {
      padding: 24px;
      border-radius: 16px;
      background: var(--surface-card, white);
    }

    .cockpit-summary {
      display: flex;
      gap: 24px;
    }

    .grand-total-card {
      flex: 1;
      padding: 32px;
      border-radius: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
      border: none !important;
      box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4) !important;
    }

    .total-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .total-icon {
      font-size: 48px;
    }

    .total-info {
      display: flex;
      flex-direction: column;
    }

    .total-label {
      font-size: 1rem;
      opacity: 0.9;
      color: rgba(255, 255, 255, 0.9) !important;
    }

    .total-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: white !important;
    }

    .total-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      button {
        color: white !important;
        border-color: rgba(255, 255, 255, 0.5) !important;

        &.mat-mdc-unelevated-button {
          background: rgba(255, 255, 255, 0.2) !important;
          backdrop-filter: blur(10px);
        }

        mat-icon {
          color: white !important;
        }
      }
    }

    .bonus-breakdown {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .breakdown-card {
      border-radius: 16px;
      padding: 24px;
      background: var(--surface-card, white);

      mat-card-header {
        margin-bottom: 16px;

        mat-card-title {
          color: var(--text-primary, #1a1a2e);
        }

        mat-icon {
          margin-right: 8px;
          vertical-align: middle;
        }
      }
    }

    .breakdown-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #1a1a2e);
      margin-bottom: 16px;
    }

    .breakdown-chart {
      height: 200px;
    }

    .qualifications-card {
      border-radius: 16px;
      padding: 24px;
      background: var(--surface-card, white);

      mat-card-header {
        margin-bottom: 16px;

        mat-card-title {
          color: var(--text-primary, #1a1a2e);
        }

        mat-icon {
          margin-right: 8px;
          vertical-align: middle;
          color: #fbbf24;
        }
      }
    }

    .qualifications-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .qualification-chip {
      background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
      color: white !important;

      mat-icon {
        font-size: 16px;
        margin-right: 4px;
      }
    }

    .orders-card {
      border-radius: 16px;
      background: var(--surface-card, white);

      mat-card-header {
        padding: 24px 24px 16px;

        mat-card-title {
          color: var(--text-primary, #1a1a2e);
        }

        mat-icon {
          margin-right: 8px;
          vertical-align: middle;
        }
      }
    }

    .orders-table {
      overflow-x: auto;

      table {
        width: 100%;

        th {
          color: var(--text-secondary, #64748b);
        }

        td {
          color: var(--text-primary, #1a1a2e);
        }
      }
    }

    .bonus-chip {
      background: linear-gradient(135deg, #34d399, #10b981);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    .approved {
      background-color: rgba(34, 197, 94, 0.1) !important;
      color: #22c55e !important;
    }

    .empty-cockpit {
      padding: 64px;
      text-align: center;
      border-radius: 16px;
      background: var(--surface-card, white);
      color: var(--text-secondary, #64748b);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        opacity: 0.3;
        color: var(--text-secondary, #64748b);
      }

      h3 {
        margin: 16px 0 8px;
        font-size: 1.25rem;
        color: var(--text-primary, #1a1a2e);
      }

      p {
        margin: 0;
        color: var(--text-secondary, #64748b);
      }
    }

    :host-context(.dark-theme) {
      .page-header h2 {
        color: white;
      }

      .page-header .subtitle {
        color: #94a3b8;
      }

      .selection-card, .breakdown-card, .qualifications-card, .orders-card, .empty-cockpit {
        background: #1e1e2d;
        color: #e2e8f0;
      }

      .breakdown-card mat-card-title,
      .qualifications-card mat-card-title,
      .orders-card mat-card-title {
        color: white;
      }

      .breakdown-value {
        color: white;
      }

      .empty-cockpit {
        color: #94a3b8;

        h3 {
          color: #e2e8f0;
        }
      }

      table {
        color: #e2e8f0;

        th {
          color: #94a3b8 !important;
        }

        td {
          color: #e2e8f0 !important;
        }
      }

      mat-form-field {
        color: #e2e8f0;
      }

      .mat-mdc-select-value {
        color: #e2e8f0 !important;
      }
    }

    @media (max-width: 768px) {
      .grand-total-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .total-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .bonus-breakdown {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BonusManagementComponent implements OnInit {
  private readonly bonusService = inject(BonusService);
  private readonly salesmanService = inject(SalesmanService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);

  readonly salesmen = signal<Salesman[]>([]);
  readonly cockpit = signal<BonusCockpit | null>(null);
  readonly cockpitLoading = signal(false);
  readonly orders = signal<OrderPerformance[]>([]);

  // Перевірка прав доступу
  canManageBonus(): boolean {
    return this.authService.hasRole(['HR', 'CEO']);
  }

  // Salesman може підтвердити свій бонус
  canApproveBonus(): boolean {
    return this.authService.hasRole(['HR', 'CEO', 'SALESMAN']);
  }

  selectedSalesmanId: number | null = null;
  selectedYear: number = new Date().getFullYear();
  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  orderColumns = ['orderId', 'clientName', 'productName', 'amount', 'computedBonus', 'status'];

  readonly colorScheme = 'cool';

  readonly socialBonusData = computed(() => {
    const records = this.cockpit()?.socialBonus?.records || [];
    return records.map((r: any) => ({
      name: r.description || 'Social',
      value: r.bonusValue || 0
    }));
  });

  readonly orderBonusData = computed(() => {
    const records = this.cockpit()?.ordersBonus?.records || [];
    return records.slice(0, 5).map((r: any) => ({
      name: r.clientName || r.orderId || 'Order',
      value: r.computedBonus || 0
    }));
  });

  ngOnInit(): void {
    this.loadSalesmen();
  }

  private loadSalesmen(): void {
    this.salesmanService.getSalesmen().subscribe({
      next: (data) => this.salesmen.set(data)
    });
  }

  onSelectionChange(): void {
    this.cockpit.set(null);
    this.orders.set([]);
  }

  loadCockpit(): void {
    if (!this.selectedSalesmanId || !this.selectedYear) return;

    this.cockpitLoading.set(true);
    this.bonusService.getCockpit(this.selectedSalesmanId, this.selectedYear).subscribe({
      next: (data) => {
        this.cockpit.set(data);
        this.cockpitLoading.set(false);
      },
      error: () => {
        this.cockpitLoading.set(false);
      }
    });
  }

  syncFromOrangeHRM(): void {
    this.bonusService.syncEmployeesFromOrangeHRM().subscribe({
      next: (response) => {
        this.notificationService.success(response.message || 'Sync completed successfully');
        this.loadSalesmen();
      }
    });
  }

  fetchOrderData(): void {
    if (!this.selectedSalesmanId || !this.selectedYear) return;

    this.bonusService.fetchOrderPerformance(this.selectedSalesmanId, this.selectedYear).subscribe({
      next: (response) => {
        this.orders.set(response.data || []);
        this.notificationService.success(response.message || 'Orders fetched successfully');
        this.loadCockpit();
      }
    });
  }

  approveBonus(): void {
    if (!this.selectedSalesmanId || !this.selectedYear) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Approve Bonuses',
        message: 'Are you sure you want to approve all social bonuses for this salesman?',
        confirmText: 'Approve',
        type: 'info'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const userRole = this.authService.currentUser()?.role;

        if (userRole === 'HR') {
          this.bonusService.approveSocialBonusesHR(this.selectedSalesmanId!, this.selectedYear).subscribe({
            next: () => {
              this.notificationService.success('Bonuses approved successfully');
              this.loadCockpit();
            }
          });
        } else if (userRole === 'CEO') {
          this.bonusService.approveSocialBonusesCEO(this.selectedSalesmanId!, this.selectedYear).subscribe({
            next: () => {
              this.notificationService.success('Bonuses approved successfully');
              this.loadCockpit();
            }
          });
        } else if (userRole === 'SALESMAN') {
          this.bonusService.approveSocialBonusesSalesman(this.selectedSalesmanId!, this.selectedYear, true).subscribe({
            next: () => {
              this.notificationService.success('Bonuses approved successfully');
              this.loadCockpit();
            }
          });
        }
      }
    });
  }

  finalApproval(): void {
    if (!this.selectedSalesmanId || !this.selectedYear) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Final Approval',
        message: 'This will finalize all bonuses and sync with HR system. Continue?',
        confirmText: 'Finalize',
        type: 'warning'
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const userRole = this.authService.currentUser()?.role;

        if (userRole === 'HR') {
          this.bonusService.finalApprovalHR(this.selectedSalesmanId!, this.selectedYear).subscribe({
            next: () => {
              this.notificationService.success('Final approval completed');
              this.loadCockpit();
            }
          });
        } else if (userRole === 'CEO') {
          this.bonusService.finalApprovalCEO(this.selectedSalesmanId!, this.selectedYear).subscribe({
            next: () => {
              this.notificationService.success('Final approval completed');
              this.loadCockpit();
            }
          });
        } else if (userRole === 'SALESMAN') {
          this.bonusService.finalApprovalSalesman(this.selectedSalesmanId!, this.selectedYear, true).subscribe({
            next: () => {
              this.notificationService.success('Final approval completed');
              this.loadCockpit();
            }
          });
        }
      }
    });
  }
}

