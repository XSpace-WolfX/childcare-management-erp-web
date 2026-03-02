import { Injectable, computed, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockHealthApi } from './services/mock-health.api';
import { ChildHealthView, HealthSummary, HealthFilter } from './models/child-health-model';

@Injectable()
export class HealthStore {
  private readonly api = inject(MockHealthApi);

  private readonly childrenData = signal<ChildHealthView[]>([]);
  private readonly loading = signal<boolean>(false);
  private readonly activeFilters = signal<Set<HealthFilter>>(new Set());

  readonly children = this.childrenData.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly filters = this.activeFilters.asReadonly();

  readonly summary = computed<HealthSummary>(() => {
    const data = this.childrenData();
    const incompleteCount = data.filter((child) => this.hasAnyIssue(child)).length;
    return {
      totalChildren: data.length,
      incompleteCount,
    };
  });

  readonly filteredChildren = computed<ChildHealthView[]>(() => {
    const data = this.childrenData();
    const filters = this.activeFilters();

    if (filters.size === 0) {
      return data;
    }

    return data.filter((child) => {
      const flags = child.healthFlags;

      if (filters.has('incomplete') && this.hasAnyIssue(child)) {
        return true;
      }

      if (filters.has('missingAuthorization') && flags.missingAuthorizedPerson) {
        return true;
      }

      if (filters.has('missingContact') && flags.missingContactInfo) {
        return true;
      }

      return false;
    });
  });

  constructor() {
    this.loadChildren();
  }

  toggleFilter(filter: HealthFilter): void {
    this.activeFilters.update((filters) => {
      const newFilters = new Set(filters);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  }

  isFilterActive(filter: HealthFilter): boolean {
    return this.activeFilters().has(filter);
  }

  applyIssuesPreset(): void {
    this.activeFilters.set(new Set(['incomplete']));
  }

  getChildStatus(child: ChildHealthView): 'OK' | 'Incomplet' {
    return this.hasAnyIssue(child) ? 'Incomplet' : 'OK';
  }

  private hasAnyIssue(child: ChildHealthView): boolean {
    const flags = child.healthFlags;
    return flags.missingFamilyLink || flags.missingAuthorizedPerson || flags.missingContactInfo;
  }

  private loadChildren(): void {
    this.loading.set(true);
    this.api
      .getAllChildren()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.childrenData.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
