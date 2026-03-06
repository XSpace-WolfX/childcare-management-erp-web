import { Routes } from '@angular/router';
import { HealthStore } from './data-access/health-store';
import { MockHealthApi } from './data-access/mock-health-api';

export const healthRoutes: Routes = [
  {
    path: '',
    providers: [HealthStore, MockHealthApi],
    loadComponent: () => import('./pages/health').then((m) => m.HealthPage),
  },
];
