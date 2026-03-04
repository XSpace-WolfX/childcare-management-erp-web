import { Routes } from '@angular/router';
import { ChildGroupStore } from '../../core/services/child-group/child-group-store';
import { MockChildGroupApi } from '../../core/services/child-group/mock-child-group-api';

export const childGroupRoutes: Routes = [
  {
    path: '',
    providers: [ChildGroupStore, MockChildGroupApi],
    loadComponent: () => import('./child-group').then((m) => m.GroupsPage),
  },
];
