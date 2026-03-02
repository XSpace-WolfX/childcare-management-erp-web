import { Routes } from '@angular/router';
import { HealthStore } from './health-store';
import { MockHealthApi } from './services/mock-health.api';

export const healthRoutes: Routes = [
  {
    path: '',
    providers: [HealthStore, MockHealthApi],
    loadComponent: () => import('./health-page').then((m) => m.HealthPage),
  },
];
