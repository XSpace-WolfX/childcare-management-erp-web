import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FamiliesStore } from '../../families-store';
import { AuthorizedPerson } from '../../../../core/models/authorized-person-model';
import { Child } from '../../../../core/models/child-model';

@Component({
  selector: 'ccm-families-list',
  standalone: true,
  templateUrl: './families-list-page.html',
})
export class FamiliesListPage implements OnInit {
  private store = inject(FamiliesStore);
  private router = inject(Router);

  families = this.store.families;
  isLoading = this.store.isLoading;
  error = this.store.error;
  authorizedPersonChildLinks = this.store.authorizedPersonChildLinks;

  authorizedPersonsCache = signal<Map<string, AuthorizedPerson[]>>(new Map());

  ngOnInit(): void {
    this.store.loadFamilies();
    this.store.loadAuthorizedPersonChildLinks();
    this.loadAllAuthorizedPersons();
  }

  private loadAllAuthorizedPersons(): void {
    this.families().forEach((family) => {
      family.children?.forEach((child) => {
        this.store.getAuthorizedPersonsByChildId(child.id).subscribe({
          next: (persons) => {
            const cache = this.authorizedPersonsCache();
            cache.set(child.id, persons);
            this.authorizedPersonsCache.set(new Map(cache));
          },
        });
      });
    });
  }

  viewFamily(familyId: string): void {
    this.router.navigate(['/families', familyId]);
  }

  createFamily(): void {
    this.router.navigate(['/families/new']);
  }

  getAuthorizedPersonsForChild(childId: string): AuthorizedPerson[] {
    return this.authorizedPersonsCache().get(childId) || [];
  }

  getChildrenWithAuthorizedPersons(familyId: string): Child[] {
    const family = this.families().find((f) => f.id === familyId);
    if (!family || !family.children) return [];

    return family.children.filter((child) => {
      const links = this.authorizedPersonChildLinks();
      return links.some((link) => link.childId === child.id);
    });
  }

  removeAuthorizedPerson(authorizedPersonId: string, childId: string): void {
    this.store.removeAuthorizedPersonLink(authorizedPersonId, childId).subscribe({
      next: () => {
        this.store.getAuthorizedPersonsByChildId(childId).subscribe({
          next: (persons) => {
            const cache = this.authorizedPersonsCache();
            cache.set(childId, persons);
            this.authorizedPersonsCache.set(new Map(cache));
          },
        });
      },
    });
  }
}
