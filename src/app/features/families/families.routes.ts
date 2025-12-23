import { Routes } from '@angular/router';
import { FamiliesFacade } from './services/families.facade';
import { FAMILIES_REPOSITORY } from './data-access';
import { MockFamiliesRepository } from './data-access';

export const FAMILIES_ROUTES: Routes = [
  {
    path: '',
    providers: [FamiliesFacade, { provide: FAMILIES_REPOSITORY, useClass: MockFamiliesRepository }],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/families-list/families-list.page').then((m) => m.FamiliesListPage),
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/family-create/family-create.page').then((m) => m.FamilyCreatePage),
      },
      {
        path: ':familyId',
        loadComponent: () => import('./pages/family-detail/family-detail.page').then((m) => m.FamilyDetailPage),
      },
    ],
  },
];
