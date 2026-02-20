import { Injectable, computed, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockAttendanceApi } from './services/mock-attendance.api';
import { ChildAttendanceView, AttendanceSummary, CriticalAlert } from './models/attendance-view-model';

@Injectable()
export class TodayStore {
  private readonly api = inject(MockAttendanceApi);

  private readonly attendanceData = signal<ChildAttendanceView[]>([]);
  private readonly loading = signal<boolean>(false);
  private readonly searchTerm = signal<string>('');

  readonly attendance = this.attendanceData.asReadonly();
  readonly isLoading = this.loading.asReadonly();
  readonly searchQuery = this.searchTerm.asReadonly();

  readonly summary = computed<AttendanceSummary>(() => {
    const data = this.attendanceData();
    return {
      expectedCount: data.filter((c) => c.status === 'expected' || c.status === 'present').length,
      presentCount: data.filter((c) => c.status === 'present').length,
      absentCount: data.filter((c) => c.status === 'absent').length,
    };
  });

  readonly criticalAlerts = computed<CriticalAlert[]>(() => {
    const data = this.attendanceData();
    const alerts: CriticalAlert[] = [];

    data.forEach((child) => {
      if (child.hasAllergies) {
        alerts.push({
          childId: child.id,
          childName: child.name,
          alertType: 'allergy',
          message: `${child.name} a des allergies documentées`,
        });
      }
      if (child.hasPAI) {
        alerts.push({
          childId: child.id,
          childName: child.name,
          alertType: 'pai',
          message: `${child.name} a un PAI (Projet d'Accueil Individualisé)`,
        });
      }
      if (child.missingAuthorizations) {
        alerts.push({
          childId: child.id,
          childName: child.name,
          alertType: 'authorization',
          message: `${child.name} a des autorisations manquantes`,
        });
      }
    });

    return alerts;
  });

  readonly expectedNotArrived = computed<ChildAttendanceView[]>(() => {
    return this.attendanceData().filter((c) => c.status === 'expected');
  });

  readonly presentNotPickedUp = computed<ChildAttendanceView[]>(() => {
    return this.attendanceData().filter((c) => c.status === 'present' && !c.checkOutTime);
  });

  readonly searchResults = computed<ChildAttendanceView[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return [];
    }
    return this.attendanceData().filter((child) => child.name.toLowerCase().includes(term));
  });

  readonly hasActiveSearch = computed<boolean>(() => {
    return this.searchTerm().trim().length > 0;
  });

  constructor() {
    this.loadAttendance();
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  markAsArrived(childId: string): void {
    this.attendanceData.update((data) =>
      data.map((child) => {
        if (child.id === childId && child.status === 'expected') {
          return {
            ...child,
            status: 'present' as const,
            checkInTime: this.getCurrentTime(),
          };
        }
        return child;
      }),
    );
  }

  markAsPickedUp(childId: string): void {
    this.attendanceData.update((data) =>
      data.map((child) => {
        if (child.id === childId && child.status === 'present' && !child.checkOutTime) {
          return {
            ...child,
            checkOutTime: this.getCurrentTime(),
          };
        }
        return child;
      }),
    );
  }

  private getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  private loadAttendance(): void {
    this.loading.set(true);
    this.api
      .getAttendanceForToday()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.attendanceData.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
