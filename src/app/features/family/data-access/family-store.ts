import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
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

    const result = this.repository.createFamily(command);

    result.subscribe({
      next: () => {
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to create family');
        this._isLoading.set(false);
        console.error('Error creating family:', err);
      },
    });

    return result;
  }

  updateFamily(command: UpdateFamilyCommand): Observable<Family> {
    this._isLoading.set(true);
    this._error.set(null);

    const result = this.repository.updateFamily(command);

    result.subscribe({
      next: (updatedFamily) => {
        this._selectedFamily.set(updatedFamily);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to update family');
        this._isLoading.set(false);
        console.error('Error updating family:', err);
      },
    });

    return result;
  }

  createAuthorizedPerson(command: CreateAuthorizedPersonCommand): Observable<AuthorizedPerson> {
    this._isLoading.set(true);
    this._error.set(null);

    const result = this.repository.createAuthorizedPerson(command);

    result.subscribe({
      next: () => {
        this._isLoading.set(false);
        this.loadAuthorizedPersonChildLinks();
      },
      error: (err) => {
        this._error.set('Failed to create authorized person');
        this._isLoading.set(false);
        console.error('Error creating authorized person:', err);
      },
    });

    return result;
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

    const result = this.repository.removeAuthorizedPersonLink(authorizedPersonId, childId);

    result.subscribe({
      next: () => {
        this._isLoading.set(false);
        this.loadAuthorizedPersonChildLinks();
      },
      error: (err) => {
        this._error.set('Failed to remove authorized person link');
        this._isLoading.set(false);
        console.error('Error removing authorized person link:', err);
      },
    });

    return result;
  }

  upsertPersonalSituation(command: UpsertPersonalSituationCommand): Observable<Parent> {
    this._isLoading.set(true);
    this._error.set(null);

    const result = this.repository.upsertPersonalSituation(command);

    result.subscribe({
      next: () => {
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to update personal situation');
        this._isLoading.set(false);
        console.error('Error updating personal situation:', err);
      },
    });

    return result;
  }

  upsertFinancialInformation(command: UpsertFinancialInformationCommand): Observable<Parent> {
    this._isLoading.set(true);
    this._error.set(null);

    const result = this.repository.upsertFinancialInformation(command);

    result.subscribe({
      next: () => {
        this._isLoading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to update financial information');
        this._isLoading.set(false);
        console.error('Error updating financial information:', err);
      },
    });

    return result;
  }

  clearSelectedFamily(): void {
    this._selectedFamily.set(null);
  }
}
