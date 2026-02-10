import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Family, FAMILIES_API, CreateFamilyCommand } from '../../core';
import { UpdateFamilyCommand } from '../../core/models/family-model';
import {
  AuthorizedPerson,
  CreateAuthorizedPersonCommand,
  AuthorizedPersonChildLink,
} from '../../core/models/authorized-person-model';
import { UpsertPersonalSituationCommand } from '../../core/models/personal-situation-model';
import { UpsertFinancialInformationCommand } from '../../core/models/financial-information-model';
import { Parent } from '../../core/models/parent-model';

@Injectable()
export class FamiliesStore {
  private repository = inject(FAMILIES_API);

  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _selectedFamily = signal<Family | null>(null);
  private _authorizedPersonChildLinks = signal<AuthorizedPersonChildLink[]>([]);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedFamily = this._selectedFamily.asReadonly();
  readonly authorizedPersonChildLinks = this._authorizedPersonChildLinks.asReadonly();

  readonly families = toSignal(this.repository.getFamilies(), {
    initialValue: [],
  });

  loadFamilies(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.repository.getFamilies().subscribe({
      next: () => {
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load families');
        this._isLoading.set(false);
        console.error('Error loading families:', err);
      },
    });
  }

  loadFamily(id: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._selectedFamily.set(null);

    this.repository.getFamilyById(id).subscribe({
      next: (family) => {
        this._selectedFamily.set(family);
        this._isLoading.set(false);
        if (!family) {
          this._error.set('Family not found');
        }
      },
      error: (err) => {
        this._error.set('Failed to load family');
        this._isLoading.set(false);
        console.error('Error loading family:', err);
      },
    });
  }

  loadFamilyByChildId(childId: string): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._selectedFamily.set(null);

    this.repository.getFamilyByChildId(childId).subscribe({
      next: (family) => {
        this._selectedFamily.set(family);
        this._isLoading.set(false);
        if (!family) {
          this._error.set('Family not found');
        }
      },
      error: (err) => {
        this._error.set('Failed to load family');
        this._isLoading.set(false);
        console.error('Error loading family:', err);
      },
    });
  }

  createFamily(command: CreateFamilyCommand): Observable<Family> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable<Family>((observer) => {
      this.repository.createFamily(command).subscribe({
        next: (family) => {
          this._isLoading.set(false);
          observer.next(family);
          observer.complete();
        },
        error: (err) => {
          this._error.set('Failed to create family');
          this._isLoading.set(false);
          console.error('Error creating family:', err);
          observer.error(err);
        },
      });
    });
  }

  updateFamily(command: UpdateFamilyCommand): Observable<Family> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable<Family>((observer) => {
      this.repository.updateFamily(command).subscribe({
        next: (family) => {
          this._selectedFamily.set(family);
          this.loadFamilies();
          this._isLoading.set(false);
          observer.next(family);
          observer.complete();
        },
        error: (err) => {
          this._error.set('Failed to update family');
          this._isLoading.set(false);
          console.error('Error updating family:', err);
          observer.error(err);
        },
      });
    });
  }

  createAuthorizedPerson(command: CreateAuthorizedPersonCommand): Observable<AuthorizedPerson> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable<AuthorizedPerson>((observer) => {
      this.repository.createAuthorizedPerson(command).subscribe({
        next: (person) => {
          this._isLoading.set(false);
          this.loadAuthorizedPersonChildLinks();
          observer.next(person);
          observer.complete();
        },
        error: (err) => {
          this._error.set('Failed to create authorized person');
          this._isLoading.set(false);
          console.error('Error creating authorized person:', err);
          observer.error(err);
        },
      });
    });
  }

  loadAuthorizedPersonChildLinks(): void {
    this.repository.getAuthorizedPersonChildLinks().subscribe({
      next: (links) => {
        this._authorizedPersonChildLinks.set(links);
      },
      error: (err) => {
        console.error('Error loading authorized person links:', err);
      },
    });
  }

  removeAuthorizedPersonLink(authorizedPersonId: string, childId: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable<void>((observer) => {
      this.repository.removeAuthorizedPersonLink(authorizedPersonId, childId).subscribe({
        next: () => {
          this._isLoading.set(false);
          this.loadAuthorizedPersonChildLinks();
          observer.next();
          observer.complete();
        },
        error: (err) => {
          this._error.set('Failed to remove authorized person link');
          this._isLoading.set(false);
          console.error('Error removing authorized person link:', err);
          observer.error(err);
        },
      });
    });
  }

  getAuthorizedPersonsByChildId(childId: string): Observable<AuthorizedPerson[]> {
    return this.repository.getAuthorizedPersonsByChildId(childId);
  }

  upsertPersonalSituation(command: UpsertPersonalSituationCommand): Observable<Parent> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable<Parent>((observer) => {
      this.repository.upsertPersonalSituation(command).subscribe({
        next: (parent) => {
          const currentFamily = this._selectedFamily();
          if (currentFamily?.id) {
            this.loadFamily(currentFamily.id);
          }
          this._isLoading.set(false);
          observer.next(parent);
          observer.complete();
        },
        error: (err) => {
          this._error.set('Failed to update personal situation');
          this._isLoading.set(false);
          console.error('Error updating personal situation:', err);
          observer.error(err);
        },
      });
    });
  }

  upsertFinancialInformation(command: UpsertFinancialInformationCommand): Observable<Parent> {
    this._isLoading.set(true);
    this._error.set(null);

    return new Observable<Parent>((observer) => {
      this.repository.upsertFinancialInformation(command).subscribe({
        next: (parent) => {
          const currentFamily = this._selectedFamily();
          if (currentFamily?.id) {
            this.loadFamily(currentFamily.id);
          }
          this._isLoading.set(false);
          observer.next(parent);
          observer.complete();
        },
        error: (err) => {
          this._error.set('Failed to update financial information');
          this._isLoading.set(false);
          console.error('Error updating financial information:', err);
          observer.error(err);
        },
      });
    });
  }
}
