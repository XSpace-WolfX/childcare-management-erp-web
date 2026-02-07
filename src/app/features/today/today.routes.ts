import { Routes } from '@angular/router';
import { TodayStore } from './today.store';
import { MockAttendanceApi } from './services/mock-attendance.api';

export const todayRoutes: Routes = [
  {
    path: '',
    providers: [TodayStore, MockAttendanceApi],
    loadComponent: () => import('./today.page').then((m) => m.TodayPage),
  },
];
