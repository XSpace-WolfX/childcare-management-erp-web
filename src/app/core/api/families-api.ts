import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Family } from '../models/family-model';
import { CreateFamilyCommand } from '../models/create-family-command';
import { UpdateFamilyCommand } from '../models/update-family-command';
import { AuthorizedPerson } from '../models/authorized-person-model';
import { CreateAuthorizedPersonCommand } from '../models/create-authorized-person-command';
import { AuthorizedPersonChildLink } from '../models/authorized-person-child-link-model';
import { UpsertPersonalSituationCommand } from '../models/upsert-personal-situation-command';
import { UpsertFinancialInformationCommand } from '../models/upsert-financial-information-command';
import { Parent } from '../models/parent-model';

export interface FamiliesApi {
  getFamilies(): Observable<Family[]>;
  getFamilyById(id: string): Observable<Family | null>;
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
