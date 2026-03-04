import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FamiliesStore } from '../../../core/services/family/family-store';
import { Family } from '../../../core/models/family';

interface FamilyRowStatus {
  status: 'ok' | 'incomplet';
  label: string;
}

@Component({
  selector: 'ccm-families-list',
  standalone: true,
  imports: [],
  templateUrl: './family-list.html',
  styleUrls: ['./family-list.scss'],
})
export class FamiliesListPage implements OnInit {
  private store = inject(FamiliesStore);
  private router = inject(Router);

  families = this.store.families;
  isLoading = this.store.isLoading;
  error = this.store.error;

  protected searchQuery = signal('');
  protected showIncompleteOnly = signal(false);

  familiesWithStatus = computed(() => {
    return this.families().map((family) => ({
      family,
      status: this.deriveFamilyStatus(family),
    }));
  });

  protected filteredFamilies = computed(() => {
    let result = this.familiesWithStatus();

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter((item) => this.matchesSearch(item.family, query));
    }

    if (this.showIncompleteOnly()) {
      result = result.filter((item) => item.status.status === 'incomplet');
    }

    return result;
  });

  ngOnInit(): void {
    this.store.loadFamilies();
  }

  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  protected toggleIncompleteFilter(): void {
    this.showIncompleteOnly.update((value) => !value);
  }

  private matchesSearch(family: Family, query: string): boolean {
    if (family.guardianNames.some((name) => name.toLowerCase().includes(query))) {
      return true;
    }

    if (
      family.children?.some(
        (child) => child.firstName.toLowerCase().includes(query) || child.lastName.toLowerCase().includes(query),
      )
    ) {
      return true;
    }

    if (family.phoneNumber?.toLowerCase().includes(query)) {
      return true;
    }

    if (family.email?.toLowerCase().includes(query)) {
      return true;
    }

    return false;
  }

  private deriveFamilyStatus(family: Family): FamilyRowStatus {
    const hasIncompleteData =
      !family.phoneNumber || !family.email || !family.address || !family.children || family.children.length === 0;

    if (hasIncompleteData) {
      return { status: 'incomplet', label: 'Incomplet' };
    }

    return { status: 'ok', label: 'OK' };
  }

  navigateToChild(childId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/children', childId]);
  }

  navigateToFirstChild(family: Family): void {
    if (family.children && family.children.length > 0) {
      this.router.navigate(['/children', family.children[0].id]);
    }
  }

  getParent1(family: Family): string {
    return family.guardianNames[0] || 'Non renseigné';
  }

  getParent2(family: Family): string | null {
    return family.guardianNames[1] || null;
  }

  getMainContact(family: Family): string {
    const parts: string[] = [];
    if (family.phoneNumber) parts.push(family.phoneNumber);
    if (family.email) parts.push(family.email);
    return parts.length > 0 ? parts.join(' • ') : 'Non renseigné';
  }

  getAddressSummary(family: Family): string {
    return family.address || 'Non renseignée';
  }
}
