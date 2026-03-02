import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GroupsStore } from './groups-store';

@Component({
  selector: 'ccm-groups',
  standalone: true,
  imports: [],
  templateUrl: './groups-page.html',
  styleUrls: ['./groups-page.scss'],
})
export class GroupsPage {
  protected readonly store = inject(GroupsStore);
  private readonly router = inject(Router);

  protected navigateToChild(childId: string): void {
    this.router.navigate(['/children', childId]);
  }

  protected navigateToToday(): void {
    this.router.navigate(['/today']);
  }
}
