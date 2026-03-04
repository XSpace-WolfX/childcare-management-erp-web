import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Family, CreateFamilyCommand, UpdateFamilyCommand } from '../../models/family';
import {
  AuthorizedPerson,
  CreateAuthorizedPersonCommand,
  AuthorizedPersonChildLink,
} from '../../models/authorized-person';
import { UpsertPersonalSituationCommand } from '../../models/personal-situation';
import { UpsertFinancialInformationCommand } from '../../models/financial-information';
import { Parent } from '../../models/parent';

export interface FamiliesApi {
  getFamilies(): Observable<Family[]>;
  getFamilyById(id: string): Observable<Family | null>;
  getFamilyByChildId(childId: string): Observable<Family | null>;
  createFamily(command: CreateFamilyCommand): Observable<Family>;
  updateFamily(command: UpdateFamilyCommand): Observable<Family>;
  createAuthorizedPerson(command: CreateAuthorizedPersonCommand): Observable<AuthorizedPerson>;
  getAuthorizedPersonsByChildId(childId: string): Observable<AuthorizedPerson[]>;
  getAuthorizedPersonChildLinks(): Observable<AuthorizedPersonChildLink[]>;
  removeAuthorizedPersonLink(authorizedPersonId: string, childId: string): Observable<void>;
  upsertPersonalSituation(command: UpsertPersonalSituationCommand): Observable<Parent>;
  upsertFinancialInformation(command: UpsertFinancialInformationCommand): Observable<Parent>;
}

export const FAMILIES_API = new InjectionToken<FamiliesApi>('FamiliesApi');
