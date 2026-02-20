import { Injectable, computed, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockGroupsApi } from './services/mock-groups.api';
import { ChildInGroup, GroupedChildren } from './models/child-group-model';

@Injectable()
export class GroupsStore {
  private readonly api = inject(MockGroupsApi);

  private readonly childrenData = signal<ChildInGroup[]>([]);
  private readonly loading = signal<boolean>(false);

  readonly children = this.childrenData.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  readonly groupedChildren = computed<GroupedChildren[]>(() => {
    const data = this.childrenData();
    
    const groupsMap = new Map<string, ChildInGroup[]>();
    
    data.forEach((child) => {
      const groupName = child.group;
      if (!groupsMap.has(groupName)) {
        groupsMap.set(groupName, []);
      }
      groupsMap.get(groupName)!.push(child);
    });

    const grouped: GroupedChildren[] = [];
    
    const sortedGroupNames = Array.from(groupsMap.keys()).sort((a, b) => 
      a.localeCompare(b, 'fr', { sensitivity: 'base' })
    );

    sortedGroupNames.forEach((groupName) => {
      const children = groupsMap.get(groupName)!;
      
      children.sort((a, b) => {
        const lastNameCompare = a.lastName.localeCompare(b.lastName, 'fr', { sensitivity: 'base' });
        if (lastNameCompare !== 0) {
          return lastNameCompare;
        }
        return a.firstName.localeCompare(b.firstName, 'fr', { sensitivity: 'base' });
      });

      grouped.push({
        groupName,
        children,
        count: children.length,
      });
    });

    return grouped;
  });

  readonly totalChildren = computed<number>(() => {
    return this.childrenData().length;
  });

  constructor() {
    this.loadChildren();
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
