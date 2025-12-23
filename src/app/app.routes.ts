import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'families',
    loadChildren: () => import('./features/families').then((m) => m.FAMILIES_ROUTES),
  },
  { path: '', pathMatch: 'full', redirectTo: 'families' },
];
