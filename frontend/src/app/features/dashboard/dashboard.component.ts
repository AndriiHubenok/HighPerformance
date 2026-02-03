import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SalesmanService, BonusService, DashboardStats } from '../../core/services';
import { Salesman } from '../../core/models';
import { slideInAnimation, listAnimation } from '../../shared/animations';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgxChartsModule,
    SkeletonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation, listAnimation],
  template: `
    <div class="dashboard" @slideIn>

      <!-- Stats Cards -->
      <section class="stats-section" [@listAnimation]="stats().length">
        @if (loading()) {
          @for (i of [1, 2, 3, 4]; track i) {
            <mat-card class="stat-card skeleton-card">
              <app-skeleton height="80px"></app-skeleton>
            </mat-card>
          }
        } @else {
          @for (stat of stats(); track stat.title) {
            <mat-card class="stat-card" [style.--accent-color]="stat.color">
              <div class="stat-icon" [style.background]="stat.color + '20'">
                <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-title">{{ stat.title }}</span>
                @if (stat.change !== undefined) {
                  <span class="stat-change" [class.positive]="stat.change >= 0" [class.negative]="stat.change < 0">
                    {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}%
                  </span>
                }
              </div>
            </mat-card>
          }
        }
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Bonus by Salesman</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (loading()) {
              <app-skeleton height="300px"></app-skeleton>
            } @else {
              <ngx-charts-bar-vertical-2d
                [results]="performanceData()"
                [xAxis]="true"
                [yAxis]="true"
                [legend]="true"
                [showXAxisLabel]="true"
                [showYAxisLabel]="true"
                xAxisLabel="Bonus Type"
                yAxisLabel="Bonus Amount"
                [gradient]="true"
                [animations]="true"
                [scheme]="colorScheme">
              </ngx-charts-bar-vertical-2d>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Bonus Distribution</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (loading()) {
              <app-skeleton height="300px"></app-skeleton>
            } @else {
              <ngx-charts-pie-chart
                [results]="bonusDistribution()"
                [legend]="true"
                [labels]="true"
                [doughnut]="true"
                [arcWidth]="0.4"
                [gradient]="true"
                [animations]="true"
                [scheme]="colorScheme">
              </ngx-charts-pie-chart>
            }
          </mat-card-content>
        </mat-card>
      </section>

      <!-- Recent Salesmen -->
      <section class="recent-section">
        <mat-card class="recent-card">
          <mat-card-header>
            <mat-card-title>Recent Salesmen</mat-card-title>
            <button mat-button color="primary">View All</button>
          </mat-card-header>
          <mat-card-content>
            @if (loading()) {
              @for (i of [1, 2, 3, 4, 5]; track i) {
                <div class="salesman-item skeleton">
                  <app-skeleton width="48px" height="48px" [circle]="true"></app-skeleton>
                  <div class="salesman-info">
                    <app-skeleton width="150px" height="20px"></app-skeleton>
                    <app-skeleton width="100px" height="16px"></app-skeleton>
                  </div>
                </div>
              }
            } @else {
              @for (salesman of recentSalesmen(); track salesman.sid) {
                <div class="salesman-item">
                  <div class="salesman-avatar">
                    {{ salesman.firstname[0] }}{{ salesman.lastname[0] }}
                  </div>
                  <div class="salesman-info">
                    <span class="salesman-name">{{ salesman.firstname }} {{ salesman.lastname }}</span>
                    <span class="salesman-department">{{ salesman.department }}</span>
                  </div>
                  <div class="salesman-year">
                    {{ salesman.yearOfPerformance }}
                  </div>
                </div>
              }
            }
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }


    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .stat-card {
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      border-radius: 16px;
      background: var(--card-bg, white);
      border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      }
    }

    .skeleton-card {
      min-height: 100px;
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #1a1a2e);
    }

    .stat-title {
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .stat-change {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 20px;
      margin-top: 4px;
      width: fit-content;

      &.positive {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
      }

      &.negative {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .chart-card {
      border-radius: 16px;
      padding: 24px;

      mat-card-header {
        margin-bottom: 24px;
      }

      mat-card-content {
        height: 300px;
      }
    }

    .recent-card {
      border-radius: 16px;

      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
      }

      mat-card-content {
        padding: 0;
      }
    }

    .salesman-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
      transition: background 0.2s ease;

      &:hover {
        background: var(--hover-bg, rgba(0, 0, 0, 0.02));
      }

      &:last-child {
        border-bottom: none;
      }

      &.skeleton {
        gap: 16px;
      }
    }

    .salesman-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .salesman-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .salesman-name {
      font-weight: 600;
      color: var(--text-primary, #1a1a2e);
    }

    .salesman-department {
      font-size: 0.875rem;
      color: var(--text-secondary, #666);
    }

    .salesman-year {
      padding: 4px 12px;
      background: var(--chip-bg, rgba(0, 0, 0, 0.05));
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    :host-context(.dark-theme) {

      .stat-card {
        background: #1e1e2d;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .stat-value {
        color: white;
      }

      .stat-title {
        color: #94a3b8;
      }

      .chart-card, .recent-card {
        background: #1e1e2d;
      }

      .chart-card mat-card-title,
      .recent-card mat-card-title {
        color: white;
      }

      .salesman-name {
        color: white;
      }

      .salesman-department {
        color: #94a3b8;
      }

      .salesman-year {
        background: rgba(255, 255, 255, 0.1);
        color: #e2e8f0;
      }

      .salesman-item:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      /* ngx-charts dark theme styles */
      ::ng-deep {
        .ngx-charts {
          text {
            fill: #e2e8f0 !important;
          }

          .tick text {
            fill: #94a3b8 !important;
          }

          .gridline-path {
            stroke: rgba(255, 255, 255, 0.1) !important;
          }

          .legend-labels {
            background: transparent !important;
          }

          .legend-label-text {
            color: #e2e8f0 !important;
          }

          .legend-title-text {
            color: #e2e8f0 !important;
          }

          .x.axis .tick text,
          .y.axis .tick text {
            fill: #94a3b8 !important;
          }

          .axis-label {
            fill: #e2e8f0 !important;
          }

          .pie-label {
            fill: #e2e8f0 !important;
          }

          .arc-label-text {
            fill: #1e1e2d !important;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .charts-section {
        grid-template-columns: 1fr;
      }

      .chart-card mat-card-content {
        height: 250px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly salesmanService = inject(SalesmanService);
  private readonly bonusService = inject(BonusService);

  readonly loading = signal(true);
  readonly stats = signal<StatCard[]>([]);
  readonly recentSalesmen = signal<Salesman[]>([]);
  readonly performanceData = signal<any[]>([]);
  readonly bonusDistribution = signal<any[]>([]);

  readonly colorScheme = 'cool';

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    this.bonusService.getDashboardStats().subscribe({
      next: (data: DashboardStats) => {

        // Set recent salesmen
        this.recentSalesmen.set(data.recentSalesmen.slice(0, 5));

        // Generate stats from real data
        this.stats.set([
          {
            title: 'Total Salesmen',
            value: data.stats.totalSalesmen,
            icon: 'people',
            color: '#60a5fa'
          },
          {
            title: 'Active This Year',
            value: data.stats.activeThisYear,
            icon: 'trending_up',
            color: '#34d399'
          },
          {
            title: 'Departments',
            value: data.stats.departmentsCount,
            icon: 'business',
            color: '#a78bfa'
          },
          {
            title: 'Avg Performance',
            value: data.stats.avgPerformance > 0 ? `${data.stats.avgPerformance}` : 'N/A',
            icon: 'analytics',
            color: '#fbbf24'
          }
        ]);

        // Generate performance chart data from real data
        const performanceChartData = data.performanceByPerson.length > 0
          ? [
              {
                name: 'Social Bonus',
                series: data.performanceByPerson.map(p => ({
                  name: p.name,
                  value: p.socialBonus
                }))
              },
              {
                name: 'Order Bonus',
                series: data.performanceByPerson.map(p => ({
                  name: p.name,
                  value: p.orderBonus
                }))
              }
            ]
          : [
              {
                name: 'Social Bonus',
                series: [{ name: 'No Data', value: 0 }]
              },
              {
                name: 'Order Bonus',
                series: [{ name: 'No Data', value: 0 }]
              }
            ];

        this.performanceData.set(performanceChartData);

        // Set bonus distribution from real data
        const hasBonusData = data.bonusDistribution.some(b => b.value > 0);
        this.bonusDistribution.set(
          hasBonusData
            ? data.bonusDistribution
            : [{ name: 'No Bonus Data', value: 1 }]
        );

        this.loading.set(false);
      },
      error: () => {
        // Fallback to salesmen only if stats API fails
        this.salesmanService.getSalesmen().subscribe({
          next: (salesmen) => {
            this.recentSalesmen.set(salesmen.slice(0, 5));

            this.stats.set([
              {
                title: 'Total Salesmen',
                value: salesmen.length,
                icon: 'people',
                color: '#60a5fa'
              },
              {
                title: 'Active This Year',
                value: salesmen.filter(s => s.yearOfPerformance === new Date().getFullYear()).length,
                icon: 'trending_up',
                color: '#34d399'
              },
              {
                title: 'Departments',
                value: new Set(salesmen.map(s => s.department)).size,
                icon: 'business',
                color: '#a78bfa'
              },
              {
                title: 'Avg Performance',
                value: 'N/A',
                icon: 'analytics',
                color: '#fbbf24'
              }
            ]);

            this.performanceData.set([
              { name: 'Social Bonus', series: [{ name: 'No Data', value: 0 }] },
              { name: 'Order Bonus', series: [{ name: 'No Data', value: 0 }] }
            ]);

            this.bonusDistribution.set([{ name: 'No Bonus Data', value: 1 }]);

            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
          }
        });
      }
    });
  }
}

