import { Routes } from '@angular/router';
import { ChildGroupStore } from './data-access/child-group-store';
import { MockChildGroupApi } from './data-access/mock-child-group-api';

export const childGroupRoutes: Routes = [
  {
    path: '',
    providers: [ChildGroupStore, MockChildGroupApi],
    loadComponent: () => import('./pages/child-group').then((m) => m.GroupsPage),
  },
];
