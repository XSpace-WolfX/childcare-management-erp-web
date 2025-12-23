import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Family, FAMILIES_REPOSITORY, CreateFamilyCommand } from '../data-access';

@Injectable()
export class FamiliesFacade {
  private repository = inject(FAMILIES_REPOSITORY);

  private _isLoading = signal(false);
  private _error = signal<string | null>(null);
  private _selectedFamily = signal<Family | null>(null);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedFamily = this._selectedFamily.asReadonly();

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
}
