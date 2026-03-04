import { Routes } from '@angular/router';
import { HealthStore } from '../../core/services/health/health-store';
import { MockHealthApi } from '../../core/services/health/mock-health-api';

export const healthRoutes: Routes = [
  {
    path: '',
    providers: [HealthStore, MockHealthApi],
    loadComponent: () => import('./health').then((m) => m.HealthPage),
  },
];
