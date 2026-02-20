import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FamiliesStore } from '../../families-store';
import { Family } from '../../../../core/models/family-model';

interface FamilyRowStatus {
  status: 'ok' | 'incomplet';
  label: string;
}

@Component({
  selector: 'ccm-families-list',
  standalone: true,
  imports: [],
  templateUrl: './families-list-page.html',
  styleUrls: ['./families-list-page.scss'],
})
export class FamiliesListPage implements OnInit {
  private store = inject(FamiliesStore);
  private router = inject(Router);

  families = this.store.families;
  isLoading = this.store.isLoading;
  error = this.store.error;

  familiesWithStatus = computed(() => {
    return this.families().map((family) => ({
      family,
      status: this.deriveFamilyStatus(family),
    }));
  });

  ngOnInit(): void {
    this.store.loadFamilies();
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
