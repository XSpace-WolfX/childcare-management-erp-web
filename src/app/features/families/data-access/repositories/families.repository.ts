import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Family } from '../models/family.model';
import { CreateFamilyCommand } from '../models/create-family.command';

export interface FamiliesRepository {
  getFamilies(): Observable<Family[]>;
  getFamilyById(id: string): Observable<Family | null>;
  createFamily(command: CreateFamilyCommand): Observable<Family>;
}

export const FAMILIES_REPOSITORY = new InjectionToken<FamiliesRepository>('FamiliesRepository');
