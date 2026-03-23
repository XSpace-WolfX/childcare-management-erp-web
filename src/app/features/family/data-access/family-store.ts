import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, tap, catchError, throwError, finalize } from 'rxjs';
import { Family, CreateFamilyCommand } from '../../../core/models/family';
import { FAMILIES_API } from './family-api';
import { UpdateFamilyCommand } from '../../../core/models/family';
import {
  AuthorizedPerson,
  CreateAuthorizedPersonCommand,
  AuthorizedPersonChildLink,
} from '../../../core/models/authorized-person';
import { UpsertPersonalSituationCommand } from '../../../core/models/personal-situation';
import { UpsertFinancialInformationCommand } from '../../../core/models/financial-information';
import { Parent } from '../../../core/models/parent';

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

    this.repository.getFamilyById(id).subscribe({
      next: (family) => {
        this._selectedFamily.set(family);
        this._isLoading.set(false);
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

    this.repository.getFamilyByChildId(childId).subscribe({
      next: (family) => {
        this._selectedFamily.set(family);
        this._isLoading.set(false);
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

    return this.repository.createFamily(command).pipe(
      catchError((err) => {
        this._error.set('Failed to create family');
        console.error('Error creating family:', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  updateFamily(command: UpdateFamilyCommand): Observable<Family> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.repository.updateFamily(command).pipe(
      tap((updatedFamily) => {
        this._selectedFamily.set(updatedFamily);
      }),
      catchError((err) => {
        this._error.set('Failed to update family');
        console.error('Error updating family:', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  createAuthorizedPerson(command: CreateAuthorizedPersonCommand): Observable<AuthorizedPerson> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.repository.createAuthorizedPerson(command).pipe(
      tap(() => {
        this.loadAuthorizedPersonChildLinks();
      }),
      catchError((err) => {
        this._error.set('Failed to create authorized person');
        console.error('Error creating authorized person:', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  getAuthorizedPersonsByChildId(childId: string): Observable<AuthorizedPerson[]> {
    return this.repository.getAuthorizedPersonsByChildId(childId);
  }

  loadAuthorizedPersonChildLinks(): void {
    this.repository.getAuthorizedPersonChildLinks().subscribe({
      next: (links) => {
        this._authorizedPersonChildLinks.set(links);
      },
      error: (err) => {
        console.error('Error loading authorized person child links:', err);
      },
    });
  }

  removeAuthorizedPersonLink(authorizedPersonId: string, childId: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.repository.removeAuthorizedPersonLink(authorizedPersonId, childId).pipe(
      tap(() => {
        this.loadAuthorizedPersonChildLinks();
      }),
      catchError((err) => {
        this._error.set('Failed to remove authorized person link');
        console.error('Error removing authorized person link:', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  upsertPersonalSituation(command: UpsertPersonalSituationCommand): Observable<Parent> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.repository.upsertPersonalSituation(command).pipe(
      catchError((err) => {
        this._error.set('Failed to update personal situation');
        console.error('Error updating personal situation:', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  upsertFinancialInformation(command: UpsertFinancialInformationCommand): Observable<Parent> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.repository.upsertFinancialInformation(command).pipe(
      catchError((err) => {
        this._error.set('Failed to update financial information');
        console.error('Error updating financial information:', err);
        return throwError(() => err);
      }),
      finalize(() => {
        this._isLoading.set(false);
      }),
    );
  }

  clearSelectedFamily(): void {
    this._selectedFamily.set(null);
  }
}
