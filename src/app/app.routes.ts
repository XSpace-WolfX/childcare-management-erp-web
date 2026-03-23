import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/app-shell/app-shell').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'today',
        loadChildren: () => import('./features/today/today.routes').then((m) => m.todayRoutes),
      },
      {
        path: 'families',
        loadChildren: () => import('./features/family/family.routes').then((m) => m.familyRoutes),
      },
      {
        path: 'health',
        loadChildren: () => import('./features/health/health.routes').then((m) => m.healthRoutes),
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('./features/child-group/child-group.routes').then((m) => m.childGroupRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'today' },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./layout/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
