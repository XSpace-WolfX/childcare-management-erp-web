import { Routes } from '@angular/router';
import { TodayStore } from './data-access/today-store';
import { MockAttendanceApi } from './data-access/mock-attendance-api';

export const todayRoutes: Routes = [
  {
    path: '',
    providers: [TodayStore, MockAttendanceApi],
    loadComponent: () => import('./pages/today').then((m) => m.TodayPage),
  },
];
