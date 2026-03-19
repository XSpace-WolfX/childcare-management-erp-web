import { Routes } from '@angular/router';
import { TodayStore } from './data-access/today-store';

export const todayRoutes: Routes = [
  {
    path: '',
    providers: [TodayStore],
    loadComponent: () => import('./pages/today').then((m) => m.TodayPage),
  },
];
