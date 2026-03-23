import { Routes } from '@angular/router';
import { ChildGroupStore } from './data-access/child-group-store';

export const childGroupRoutes: Routes = [
  {
    path: '',
    providers: [ChildGroupStore],
    loadComponent: () => import('./pages/child-group').then((m) => m.GroupsPage),
  },
];
