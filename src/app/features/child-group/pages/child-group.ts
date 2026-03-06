import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChildGroupStore } from '../data-access/child-group-store';

@Component({
  selector: 'ccm-groups',
  standalone: true,
  imports: [],
  templateUrl: './child-group.html',
  styleUrls: ['./child-group.scss'],
})
export class GroupsPage {
  protected readonly store = inject(ChildGroupStore);
  private readonly router = inject(Router);

  protected navigateToChild(childId: string): void {
    this.router.navigate(['/families/children', childId]);
  }

  protected navigateToToday(): void {
    this.router.navigate(['/today']);
  }
}
