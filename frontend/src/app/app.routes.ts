import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    data: { title: 'Login' }
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard],
    data: { title: 'Register' }
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
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
        canActivate: [roleGuard],
        data: { title: 'Salesmen', roles: ['HR', 'CEO', 'SALESMAN'] }
      },
      {
        path: 'social-performance',
        loadComponent: () => import('./features/social-performance/social-performance.component').then(m => m.SocialPerformanceComponent),
        canActivate: [roleGuard],
        data: { title: 'Social Performance', roles: ['HR', 'CEO', 'SALESMAN'] }
      },
      {
        path: 'social-performance/:sid',
        loadComponent: () => import('./features/social-performance/social-performance.component').then(m => m.SocialPerformanceComponent),
        canActivate: [roleGuard],
        data: { title: 'Social Performance', roles: ['HR', 'CEO', 'SALESMAN'] }
      },
      {
        path: 'bonus',
        loadComponent: () => import('./features/bonus/bonus-management.component').then(m => m.BonusManagementComponent),
        canActivate: [roleGuard],
        data: { title: 'Bonus Management', roles: ['HR', 'CEO', 'SALESMAN'] }
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
