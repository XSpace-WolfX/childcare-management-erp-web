import { Routes } from '@angular/router';
import { GroupsStore } from './groups-store';
import { MockGroupsApi } from './services/mock-groups.api';

export const groupsRoutes: Routes = [
  {
    path: '',
    providers: [GroupsStore, MockGroupsApi],
    loadComponent: () => import('./groups-page').then((m) => m.GroupsPage),
  },
];
