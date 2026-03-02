import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Family, CreateFamilyCommand, UpdateFamilyCommand } from '../models/family-model';
import { Child } from '../models/child-model';
import { FamiliesApi } from './families-api';
import {
  AuthorizedPerson,
  CreateAuthorizedPersonCommand,
  AuthorizedPersonChildLink,
} from '../models/authorized-person-model';
import { UpsertPersonalSituationCommand } from '../models/personal-situation-model';
import { UpsertFinancialInformationCommand } from '../models/financial-information-model';
import { Parent } from '../models/parent-model';
import {
  getAllFamilies,
  getFamilyById,
  getFamilyByChildId,
  addFamily,
  updateFamilyInDb,
  getAuthorizedPersons,
  addAuthorizedPerson,
  getAuthorizedPersonChildLinks,
  addAuthorizedPersonChildLink,
} from '../mock/childcare-mock-db';

@Injectable()
export class MockFamiliesApi implements FamiliesApi {
  private get families(): Family[] {
    return getAllFamilies();
  }

  private get authorizedPersons(): AuthorizedPerson[] {
    return getAuthorizedPersons();
  }

  private get authorizedPersonChildLinks(): AuthorizedPersonChildLink[] {
    return getAuthorizedPersonChildLinks();
  }

  getFamilies(): Observable<Family[]> {
    return of(this.families).pipe(delay(300));
  }

  getFamilyById(id: string): Observable<Family | null> {
    const family = getFamilyById(id);
    return of(family).pipe(delay(200));
  }

  getFamilyByChildId(childId: string): Observable<Family | null> {
    const family = getFamilyByChildId(childId);
    return of(family).pipe(delay(200));
  }

  createFamily(command: CreateFamilyCommand): Observable<Family> {
    const newFamilyId = (this.families.length + 1).toString();

    const children: Child[] = command.children.map((childCmd, index) => {
      const age = this.calculateAge(childCmd.birthDate);
      return {
        id: `c${Date.now()}_${index}`,
        firstName: childCmd.firstName,
        lastName: childCmd.lastName,
        birthDate: childCmd.birthDate,
        age,
        familyId: newFamilyId,
      };
    });

    const parents: Parent[] | undefined = command.parents?.map((parentCmd, index) => ({
      id: `p${Date.now()}_${index}`,
      firstName: parentCmd.firstName,
      lastName: parentCmd.lastName,
      email: parentCmd.email,
      phoneNumber: parentCmd.phoneNumber,
      personalSituation: parentCmd.personalSituation,
      financialInformation: parentCmd.financialInformation,
    }));

    const newFamily: Family = {
      id: newFamilyId,
      familyName: command.familyName,
      guardianNames: command.guardianNames,
      address: command.address,
      phoneNumber: command.phoneNumber,
      email: command.email,
      children,
      parents,
    };

    addFamily(newFamily);
    return of(newFamily).pipe(delay(400));
  }

  updateFamily(command: UpdateFamilyCommand): Observable<Family> {
    const index = this.families.findIndex((f) => f.id === command.id);
    if (index === -1) {
      throw new Error(`Family with id ${command.id} not found`);
    }

    const updatedChildren: Child[] = command.children.map((childCmd) => {
      const age = this.calculateAge(childCmd.birthDate);
      return {
        id: childCmd.id,
        firstName: childCmd.firstName,
        lastName: childCmd.lastName,
        birthDate: childCmd.birthDate,
        age,
        familyId: command.id,
      };
    });

    const updatedFamily: Family = {
      id: command.id,
      familyName: command.familyName,
      guardianNames: command.guardianNames,
      address: command.address,
      phoneNumber: command.phoneNumber,
      email: command.email,
      children: updatedChildren,
    };

    updateFamilyInDb(updatedFamily);
    return of(updatedFamily).pipe(delay(400));
  }

  createAuthorizedPerson(command: CreateAuthorizedPersonCommand): Observable<AuthorizedPerson> {
    const newPerson: AuthorizedPerson = {
      id: `ap${Date.now()}`,
      firstName: command.firstName,
      lastName: command.lastName,
      phone: command.phone,
      email: command.email,
    };

    addAuthorizedPerson(newPerson);

    command.childIds.forEach((childId) => {
      addAuthorizedPersonChildLink({
        authorizedPersonId: newPerson.id,
        childId,
      });
    });

    return of(newPerson).pipe(delay(300));
  }

  getAuthorizedPersonsByChildId(childId: string): Observable<AuthorizedPerson[]> {
    const links = this.authorizedPersonChildLinks.filter((link) => link.childId === childId);
    const persons = links
      .map((link) => this.authorizedPersons.find((p) => p.id === link.authorizedPersonId))
      .filter((p): p is AuthorizedPerson => p !== undefined);
    return of(persons).pipe(delay(200));
  }

  getAuthorizedPersonChildLinks(): Observable<AuthorizedPersonChildLink[]> {
    return of([...this.authorizedPersonChildLinks]).pipe(delay(200));
  }

  removeAuthorizedPersonLink(authorizedPersonId: string, childId: string): Observable<void> {
    const index = this.authorizedPersonChildLinks.findIndex(
      (link) => link.authorizedPersonId === authorizedPersonId && link.childId === childId,
    );
    if (index !== -1) {
      this.authorizedPersonChildLinks.splice(index, 1);
    }
    return of(void 0).pipe(delay(200));
  }

  upsertPersonalSituation(command: UpsertPersonalSituationCommand): Observable<Parent> {
    for (const family of this.families) {
      if (family.parents) {
        const parent = family.parents.find((p) => p.id === command.parentId);
        if (parent) {
          parent.personalSituation = {
            maritalStatus: command.maritalStatus,
            occupation: command.occupation,
            employer: command.employer,
            notes: command.notes,
          };
          return of(parent).pipe(delay(200));
        }
      }
    }
    throw new Error(`Parent with id ${command.parentId} not found`);
  }

  upsertFinancialInformation(command: UpsertFinancialInformationCommand): Observable<Parent> {
    for (const family of this.families) {
      if (family.parents) {
        const parent = family.parents.find((p) => p.id === command.parentId);
        if (parent) {
          parent.financialInformation = {
            monthlyIncome: command.monthlyIncome,
            employmentType: command.employmentType,
            notes: command.notes,
          };
          return of(parent).pipe(delay(200));
        }
      }
    }
    throw new Error(`Parent with id ${command.parentId} not found`);
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
}
