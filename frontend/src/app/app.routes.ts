import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Dashboard' }
      },
      {
        path: 'salesmen',
        loadComponent: () => import('./features/salesmen/salesmen-list.component').then(m => m.SalesmenListComponent),
        data: { title: 'Salesmen' }
      },
      {
        path: 'social-performance',
        loadComponent: () => import('./features/social-performance/social-performance.component').then(m => m.SocialPerformanceComponent),
        data: { title: 'Social Performance' }
      },
      {
        path: 'social-performance/:sid',
        loadComponent: () => import('./features/social-performance/social-performance.component').then(m => m.SocialPerformanceComponent),
        data: { title: 'Social Performance' }
      },
      {
        path: 'bonus',
        loadComponent: () => import('./features/bonus/bonus-management.component').then(m => m.BonusManagementComponent),
        data: { title: 'Bonus Management' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
