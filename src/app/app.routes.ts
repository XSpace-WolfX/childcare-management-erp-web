import { Routes } from '@angular/router';
import { FamiliesStore } from './features/families/families-store';
import { FAMILIES_API, MockFamiliesApi } from './core';

export const routes: Routes = [
  {
    path: 'today',
    loadChildren: () => import('./features/today/today.routes').then((m) => m.todayRoutes),
  },
  {
    path: 'families',
    providers: [FamiliesStore, { provide: FAMILIES_API, useClass: MockFamiliesApi }],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/families/pages/families-list/families-list-page').then((m) => m.FamiliesListPage),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/families/pages/family-create/family-create-page').then((m) => m.FamilyCreatePage),
      },
      {
        path: ':familyId',
        loadComponent: () =>
          import('./features/families/pages/family-detail/family-detail-page').then((m) => m.FamilyDetailPage),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'today' },
];
