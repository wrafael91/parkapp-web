import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard), canActivate: [authGuard] },
  { path: 'parking', loadComponent: () => import('./pages/parking/parking').then(m => m.Parking), canActivate: [authGuard] },
  { path: 'vehicles', loadComponent: () => import('./pages/vehicles/vehicles').then(m => m.Vehicles), canActivate: [authGuard] },
  { path: 'spaces', loadComponent: () => import('./pages/spaces/spaces').then(m => m.Spaces), canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
