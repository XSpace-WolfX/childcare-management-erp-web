import { Routes } from '@angular/router';
import { TodayStore } from '../../core/services/today/today-store';
import { MockAttendanceApi } from '../../core/services/today/mock-attendance-api';

export const todayRoutes: Routes = [
  {
    path: '',
    providers: [TodayStore, MockAttendanceApi],
    loadComponent: () => import('./today').then((m) => m.TodayPage),
  },
];
