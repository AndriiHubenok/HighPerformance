import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';
import { SystemNotificationService, SystemNotification } from '../core/services/system-notification.service';
import { fadeInAnimation } from '../shared/animations';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: ('HR' | 'CEO' | 'SALESMAN')[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  animations: [fadeInAnimation],
  template: `
    <div class="app-layout" @fadeIn>
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header">
          <div class="logo">
            @if (!sidebarCollapsed()) {
              <span class="logo-text">HighPerformance</span>
            }
            <span class="logo-icon">🚀</span>
          </div>
          <button mat-icon-button (click)="toggleSidebar()" class="collapse-btn">
            <mat-icon>{{ sidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of filteredNavItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              class="nav-item"
              [matTooltip]="sidebarCollapsed() ? item.label : ''"
              matTooltipPosition="right">
              <mat-icon>{{ item.icon }}</mat-icon>
              @if (!sidebarCollapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button
            mat-icon-button
            (click)="themeService.toggleTheme()"
            [matTooltip]="themeService.currentTheme() === 'dark' ? 'Light Mode' : 'Dark Mode'"
            matTooltipPosition="right"
            class="theme-toggle">
            <mat-icon>
              {{ themeService.currentTheme() === 'dark' ? 'light_mode' : 'dark_mode' }}
            </mat-icon>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="app-header glass-effect">
          <div class="header-left">
            <h1 class="page-title">{{ currentPageTitle() }}</h1>
          </div>
          <div class="header-right">
            @if (canSync()) {
              <button mat-stroked-button class="sync-btn" (click)="onSync()">
                <mat-icon>sync</mat-icon>
                Sync Data
              </button>
            }

            <!-- Notifications -->
            @if (canViewNotifications()) {
              <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-btn"
                [matBadge]="systemNotificationService.unreadCount()"
                [matBadgeHidden]="systemNotificationService.unreadCount() === 0"
                matBadgeColor="warn"
                matBadgeSize="small">
                <mat-icon>notifications</mat-icon>
              </button>
              <mat-menu #notificationMenu="matMenu" class="notification-dropdown">
                <div class="notification-header">
                  <span>Notifications</span>
                  <div class="notification-actions">
                    @if (systemNotificationService.unreadCount() > 0) {
                      <button mat-button color="primary" (click)="markAllNotificationsAsRead($event)">
                        Mark all read
                      </button>
                    }
                    @if (systemNotificationService.notifications().length > 0) {
                      <button mat-icon-button color="warn" (click)="clearAllNotifications($event)" matTooltip="Clear all">
                        <mat-icon>delete_sweep</mat-icon>
                      </button>
                    }
                  </div>
                </div>
                <mat-divider></mat-divider>
                @if (systemNotificationService.notifications().length === 0) {
                  <div class="no-notifications">
                    <mat-icon>notifications_none</mat-icon>
                    <span>No notifications</span>
                  </div>
                } @else {
                  @for (notification of systemNotificationService.notifications().slice(0, 10); track notification._id) {
                    <div class="notification-item" [class.unread]="!notification.isRead">
                      <mat-icon [class]="getNotificationIconClass(notification.type)">
                        {{ getNotificationIcon(notification.type) }}
                      </mat-icon>
                      <div class="notification-content" (click)="onNotificationClick(notification)">
                        <span class="notification-title">{{ notification.title }}</span>
                        <span class="notification-message">{{ notification.message }}</span>
                        <span class="notification-time">{{ getTimeAgo(notification.createdAt) }}</span>
                      </div>
                      <button mat-icon-button class="delete-notification-btn" (click)="deleteNotification($event, notification._id)" matTooltip="Delete">
                        <mat-icon>close</mat-icon>
                      </button>
                    </div>
                  }
                }
              </mat-menu>
            }

            <!-- User Menu -->
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
              <div class="user-avatar">
                {{ getUserInitials() }}
              </div>
              <div class="user-info">
                <span class="user-name">{{ authService.currentUser()?.username }}</span>
                <span class="user-role-badge">{{ authService.currentUser()?.role }}</span>
              </div>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="user-dropdown">
              <div class="user-info-header">
                <div class="user-avatar-large">{{ getUserInitials() }}</div>
                <div class="user-details">
                  <span class="user-fullname">{{ authService.currentUser()?.username }}</span>
                  <span class="user-role">{{ getRoleDisplayName() }}</span>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="themeService.toggleTheme()">
                <mat-icon>{{ themeService.currentTheme() === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
                <span>{{ themeService.currentTheme() === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
              </button>
              <button mat-menu-item (click)="onLogout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background: var(--sidebar-bg, #1a1a2e);
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 100;

      &.collapsed {
        width: 80px;
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .collapse-btn {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transform: translateX(4px);
      }

      &.active {
        background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2));
        color: white;
        border-left: 3px solid #60a5fa;
      }

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .nav-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
    }

    .theme-toggle {
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--content-bg, #f5f7fa);
      overflow: hidden;
    }

    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 32px;
      background: var(--header-bg, rgba(255, 255, 255, 0.8));
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary, #1a1a2e);
    }

    .sync-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-menu-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px 6px 6px;
      border-radius: 28px;
      background: var(--user-menu-bg, rgba(0, 0, 0, 0.05));
      transition: background 0.2s ease;
      height: auto;
      min-height: 44px;

      &:hover {
        background: var(--user-menu-hover, rgba(0, 0, 0, 0.1));
      }

      ::ng-deep .mdc-button__label {
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.3;
      text-align: left;
    }

    .user-name {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary, #1a1a2e);
      line-height: 1.2;
    }

    .user-role-badge {
      font-size: 10px;
      color: white;
      font-weight: 500;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2px 8px;
      border-radius: 8px;
      margin-top: 2px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }

    ::ng-deep .user-dropdown {
      min-width: 280px !important;

      .user-info-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: var(--user-header-bg, #f5f5f5);
      }

      .user-avatar-large {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
      }

      .user-details {
        display: flex;
        flex-direction: column;
      }

      .user-fullname {
        font-weight: 600;
        font-size: 14px;
      }

      .user-email {
        font-size: 12px;
        color: var(--text-secondary, #666);
      }

      .user-role {
        font-size: 10px;
        color: white;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2px 8px;
        border-radius: 10px;
        margin-top: 4px;
        width: fit-content;
      }
    }

    :host-context(.dark-theme) {
      .user-menu-btn {
        background: rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }

      .user-name {
        color: #fff;
      }

      .user-role-badge {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      ::ng-deep .user-dropdown .user-info-header {
        background: #1a1a2e;
      }
    }

    .notification-btn {
      color: var(--text-primary, #1a1a2e);
    }

    ::ng-deep .notification-dropdown {
      min-width: 360px !important;
      max-width: 400px !important;

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        font-weight: 600;
        font-size: 14px;

        .notification-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .no-notifications {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 32px 16px;
        color: var(--text-secondary, #666);

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          opacity: 0.5;
        }
      }

      .notification-item {
        display: flex;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.2s ease;
        align-items: flex-start;

        &:hover {
          background: rgba(0, 0, 0, 0.05);

          .delete-notification-btn {
            opacity: 1;
          }
        }

        &.unread {
          background: rgba(102, 126, 234, 0.1);
        }

        .notification-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .notification-title {
          font-weight: 600;
          font-size: 13px;
        }

        .notification-message {
          font-size: 12px;
          color: var(--text-secondary, #666);
          line-height: 1.4;
        }

        .notification-time {
          font-size: 11px;
          color: var(--text-secondary, #999);
        }

        .delete-notification-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
          width: 24px;
          height: 24px;
          line-height: 24px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .notification-icon-error {
        color: #ef4444;
      }

      .notification-icon-success {
        color: #22c55e;
      }

      .notification-icon-warning {
        color: #f59e0b;
      }

      .notification-icon-info {
        color: #3b82f6;
      }
    }

    :host-context(.dark-theme) {
      .notification-btn {
        color: white;
      }

      ::ng-deep .notification-dropdown {
        background: #1e1e2d !important;

        .notification-header {
          color: #e2e8f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .no-notifications {
          color: #94a3b8;

          mat-icon {
            color: #94a3b8;
          }
        }

        .notification-item {
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          &.unread {
            background: rgba(102, 126, 234, 0.2);
          }

          .notification-title {
            color: #e2e8f0;
          }

          .notification-message {
            color: #94a3b8;
          }

          .notification-time {
            color: #64748b;
          }

          .delete-notification-btn {
            color: #94a3b8;

            &:hover {
              color: #ef4444;
            }
          }
        }

        mat-divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      }
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }

    .glass-effect {
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: blur(10px);
    }

    :host-context(.dark-theme) {
      .sidebar {
        background: #0f0f1a;
      }

      .main-content {
        background: #121220;
      }

      .app-header {
        background: rgba(18, 18, 32, 0.8);
        border-color: rgba(255, 255, 255, 0.1);
      }

      .page-title {
        color: white;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);

        &.open {
          transform: translateX(0);
        }
      }

      .content-area {
        padding: 16px;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  readonly systemNotificationService = inject(SystemNotificationService);

  readonly sidebarCollapsed = signal(false);
  readonly currentPageTitle = signal('Dashboard');

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' }, // доступно всім
    { path: '/salesmen', label: 'Salesmen', icon: 'people', roles: ['HR', 'CEO', 'SALESMAN'] },
    { path: '/social-performance', label: 'Social Performance', icon: 'assessment', roles: ['HR', 'CEO', 'SALESMAN'] },
    { path: '/bonus', label: 'Bonus Management', icon: 'paid', roles: ['HR', 'CEO', 'SALESMAN'] }
  ];

  ngOnInit(): void {
    // Load notifications for CEO and HR
    if (this.canViewNotifications()) {
      this.systemNotificationService.loadNotifications();
      this.systemNotificationService.loadUnreadCount();
      this.systemNotificationService.startPolling();
    }
  }

  get filteredNavItems(): NavItem[] {
    const userRole = this.authService.currentUser()?.role;
    return this.navItems.filter(item => {
      if (!item.roles) return true; // доступно всім
      return userRole && item.roles.includes(userRole);
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';

    return user.username.substring(0, 2).toUpperCase();
  }

  getRoleDisplayName(): string {
    const role = this.authService.currentUser()?.role;
    const roleNames: Record<string, string> = {
      'HR': 'HR Manager',
      'CEO': 'Chief Executive Officer',
      'SALESMAN': 'Salesman'
    };
    return role ? roleNames[role] || role : '';
  }

  // Перевірка прав доступу до кнопок
  canSync(): boolean {
    return this.authService.hasRole(['HR', 'CEO']);
  }

  canManageSalesmen(): boolean {
    return this.authService.hasRole(['HR', 'CEO']);
  }

  canApproveBonus(): boolean {
    return this.authService.hasRole(['HR', 'CEO']);
  }

  canViewNotifications(): boolean {
    return this.authService.hasRole(['HR', 'CEO']);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onSync(): void {
    // Will be implemented with bonus service
  }

  // Notification methods
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'BONUS_REJECTED': 'cancel',
      'BONUS_APPROVED': 'check_circle',
      'BONUS_PENDING': 'hourglass_empty',
      'INFO': 'info'
    };
    return icons[type] || 'notifications';
  }

  getNotificationIconClass(type: string): string {
    const classes: Record<string, string> = {
      'BONUS_REJECTED': 'notification-icon-error',
      'BONUS_APPROVED': 'notification-icon-success',
      'BONUS_PENDING': 'notification-icon-warning',
      'INFO': 'notification-icon-info'
    };
    return classes[type] || '';
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  onNotificationClick(notification: SystemNotification): void {
    if (!notification.isRead) {
      this.systemNotificationService.markNotificationAsRead(notification._id);
    }
  }

  markAllNotificationsAsRead(event: Event): void {
    event.stopPropagation();
    this.systemNotificationService.markAllNotificationsAsRead();
  }

  deleteNotification(event: Event, id: string): void {
    event.stopPropagation();
    this.systemNotificationService.removeNotification(id);
  }

  clearAllNotifications(event: Event): void {
    event.stopPropagation();
    this.systemNotificationService.clearAllNotifications();
  }
}

