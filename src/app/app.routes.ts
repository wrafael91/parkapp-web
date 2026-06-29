import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard), canActivate: [authGuard] },
  { path: 'parking', loadComponent: () => import('./pages/parking/parking').then(m => m.Parking), canActivate: [authGuard] },
  { path: 'vehicles', loadComponent: () => import('./pages/vehicles/vehicles').then(m => m.Vehicles), canActivate: [authGuard] },
  { path: 'spaces', loadComponent: () => import('./pages/spaces/spaces').then(m => m.Spaces), canActivate: [authGuard] },
  { path: 'history', loadComponent: () => import('./pages/history/history').then(m => m.History), canActivate: [authGuard] },
  { path: 'reports', loadComponent: () => import('./pages/reports/reports').then(m => m.Reports), canActivate: [authGuard] },
  { path: 'passes', loadComponent: () => import('./pages/passes/passes').then(m => m.Passes), canActivate: [authGuard] },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.Settings), canActivate: [authGuard] },
  { path: 'users', loadComponent: () => import('./pages/users/users').then(m => m.Users), canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
