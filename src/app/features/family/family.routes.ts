import { Routes } from '@angular/router';
import { FamiliesStore } from './data-access/family-store';
import { FAMILIES_API } from './data-access/family-api';
import { MockFamiliesApi } from './data-access/mock-family-api';

export const familyRoutes: Routes = [
  {
    path: '',
    providers: [FamiliesStore, { provide: FAMILIES_API, useClass: MockFamiliesApi }],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/family-list/family-list').then((m) => m.FamiliesListPage),
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/family-create/family-create').then((m) => m.FamilyCreatePage),
      },
      {
        path: ':familyId',
        loadComponent: () => import('./pages/family-detail/family-detail').then((m) => m.FamilyDetailPage),
      },
      {
        path: 'children/:childId',
        loadComponent: () => import('./pages/family-detail/family-detail').then((m) => m.FamilyDetailPage),
      },
    ],
  },
];
