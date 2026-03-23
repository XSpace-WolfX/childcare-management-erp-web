import { Routes } from '@angular/router';
import { HealthStore } from './data-access/health-store';

export const healthRoutes: Routes = [
  {
    path: '',
    providers: [HealthStore],
    loadComponent: () => import('./pages/health').then((m) => m.HealthPage),
  },
];
