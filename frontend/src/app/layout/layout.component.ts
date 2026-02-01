import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../core/services/theme.service';
import { fadeInAnimation } from '../shared/animations';

interface NavItem {
  path: string;
  label: string;
  icon: string;
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
    MatTooltipModule
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
          @for (item of navItems; track item.path) {
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
            <button mat-stroked-button class="sync-btn" (click)="onSync()">
              <mat-icon>sync</mat-icon>
              Sync Data
            </button>
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
export class LayoutComponent {
  readonly themeService = inject(ThemeService);

  readonly sidebarCollapsed = signal(false);
  readonly currentPageTitle = signal('Dashboard');

  readonly navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/salesmen', label: 'Salesmen', icon: 'people' },
    { path: '/social-performance', label: 'Social Performance', icon: 'assessment' },
    { path: '/bonus', label: 'Bonus Management', icon: 'paid' }
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  onSync(): void {
    // Will be implemented with bonus service
  }
}

