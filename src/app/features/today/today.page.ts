import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TodayStore } from './today.store';
import { ChildAttendanceView } from './models/attendance-view.model';

@Component({
  selector: 'ccm-today',
  standalone: true,
  imports: [],
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
})
export class TodayPage {
  protected readonly store = inject(TodayStore);
  private readonly router = inject(Router);
  protected readonly alertsExpanded = signal(false);
  private readonly MAX_COLLAPSED_ALERTS = 5;

  protected readonly alertCounts = computed(() => {
    const alerts = this.store.criticalAlerts();
    return {
      allergies: alerts.filter((a) => a.alertType === 'allergy').length,
      pai: alerts.filter((a) => a.alertType === 'pai').length,
      authorizations: alerts.filter((a) => a.alertType === 'authorization').length,
      total: alerts.length,
    };
  });

  protected readonly displayedAlerts = computed(() => {
    const alerts = this.store.criticalAlerts();
    return this.alertsExpanded() ? alerts : alerts.slice(0, this.MAX_COLLAPSED_ALERTS);
  });

  protected readonly hasMoreAlerts = computed(() => {
    return this.store.criticalAlerts().length > this.MAX_COLLAPSED_ALERTS;
  });

  protected toggleAlerts(): void {
    this.alertsExpanded.update((expanded) => !expanded);
  }

  protected getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.store.setSearchTerm(input.value);
  }

  protected getChildStatus(child: ChildAttendanceView): string {
    if (child.checkOutTime) {
      return 'Récupéré';
    }
    switch (child.status) {
      case 'expected':
        return 'Attendu';
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      default:
        return '';
    }
  }

  protected canCheckIn(child: ChildAttendanceView): boolean {
    return child.status === 'expected';
  }

  protected canCheckOut(child: ChildAttendanceView): boolean {
    return child.status === 'present' && !child.checkOutTime;
  }

  protected hasNoAction(child: ChildAttendanceView): boolean {
    return !this.canCheckIn(child) && !this.canCheckOut(child);
  }

  protected navigateToChild(childId: string): void {
    this.router.navigate(['/children', childId]);
  }
}
