import { Routes } from '@angular/router';
import { FamiliesStore } from './core/services/family/family-store';
import { FAMILIES_API } from './core/services/family/family-api';
import { MockFamiliesApi } from './core/services/family/mock-family-api';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layouts/app-shell/app-shell').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'today',
        loadChildren: () => import('./pages/today/today.routes').then((m) => m.todayRoutes),
      },
      {
        path: 'families',
        providers: [FamiliesStore, { provide: FAMILIES_API, useClass: MockFamiliesApi }],
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/family/family-list/family-list').then((m) => m.FamiliesListPage),
          },
          {
            path: 'new',
            loadComponent: () => import('./pages/family/family-create/family-create').then((m) => m.FamilyCreatePage),
          },
          {
            path: ':familyId',
            loadComponent: () => import('./pages/family/family-detail/family-detail').then((m) => m.FamilyDetailPage),
          },
        ],
      },
      {
        path: 'children/:childId',
        providers: [FamiliesStore, { provide: FAMILIES_API, useClass: MockFamiliesApi }],
        loadComponent: () => import('./pages/family/family-detail/family-detail').then((m) => m.FamilyDetailPage),
      },
      {
        path: 'health',
        loadChildren: () => import('./pages/health/health.routes').then((m) => m.healthRoutes),
      },
      {
        path: 'groups',
        loadChildren: () => import('./pages/child-group/child-group.routes').then((m) => m.childGroupRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'today' },
    ],
  },
];
