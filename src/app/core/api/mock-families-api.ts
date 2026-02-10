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

@Injectable()
export class MockFamiliesApi implements FamiliesApi {
  private authorizedPersons: AuthorizedPerson[] = [];
  private authorizedPersonChildLinks: AuthorizedPersonChildLink[] = [];

  private families: Family[] = [
    {
      id: '1',
      familyName: 'Famille Dupont',
      guardianNames: ['Marie Dupont', 'Jean Dupont'],
      address: '12 Rue de la Paix, 75001 Paris',
      phoneNumber: '+33 1 23 45 67 89',
      email: 'dupont.famille@example.fr',
      children: [
        {
          id: 'c1',
          firstName: 'Sophie',
          lastName: 'Dupont',
          birthDate: new Date('2020-03-15'),
          age: 4,
          familyId: '1',
        },
        {
          id: 'c2',
          firstName: 'Lucas',
          lastName: 'Dupont',
          birthDate: new Date('2022-07-22'),
          age: 2,
          familyId: '1',
        },
      ],
      parents: [
        {
          id: 'p1',
          firstName: 'Marie',
          lastName: 'Dupont',
          email: 'marie.dupont@example.fr',
          phoneNumber: '+33 6 12 34 56 78',
          personalSituation: {
            maritalStatus: 'Mariée',
            occupation: 'Ingénieure informatique',
            employer: 'TechCorp France',
            notes: 'Horaires flexibles, télétravail 2 jours par semaine',
          },
          financialInformation: {
            monthlyIncome: 4500,
            employmentType: 'CDI temps plein',
            notes: 'Revenus stables, éligible aux aides',
          },
        },
        {
          id: 'p2',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.fr',
          phoneNumber: '+33 6 98 76 54 32',
          personalSituation: {
            maritalStatus: 'Marié',
            occupation: 'Professeur des écoles',
            employer: 'Éducation Nationale',
            notes: 'Disponible pendant les vacances scolaires',
          },
          financialInformation: {
            monthlyIncome: 3200,
            employmentType: 'Fonctionnaire',
            notes: 'Revenus garantis, avantages sociaux',
          },
        },
      ],
    },
    {
      id: '2',
      familyName: 'Famille Martin',
      guardianNames: ['Claire Martin'],
      address: '45 Avenue des Champs, 69002 Lyon',
      phoneNumber: '+33 4 78 90 12 34',
      email: 'c.martin@example.fr',
      children: [
        {
          id: 'c3',
          firstName: 'Emma',
          lastName: 'Martin',
          birthDate: new Date('2021-11-08'),
          age: 3,
          familyId: '2',
        },
      ],
      parents: [
        {
          id: 'p3',
          firstName: 'Claire',
          lastName: 'Martin',
          email: 'c.martin@example.fr',
          phoneNumber: '+33 4 78 90 12 34',
          personalSituation: {
            maritalStatus: 'Célibataire',
            occupation: 'Infirmière',
            employer: 'Hôpital de Lyon',
          },
        },
      ],
    },
    {
      id: '3',
      familyName: 'Famille Bernard',
      guardianNames: ['Thomas Bernard', 'Julie Bernard'],
      address: '78 Boulevard Victor Hugo, 31000 Toulouse',
      phoneNumber: '+33 5 61 23 45 67',
      email: 'bernard.family@example.fr',
      children: [],
    },
  ];

  getFamilies(): Observable<Family[]> {
    return of(this.families).pipe(delay(300));
  }

  getFamilyById(id: string): Observable<Family | null> {
    const family = this.families.find((f) => f.id === id) || null;
    return of(family).pipe(delay(200));
  }

  getFamilyByChildId(childId: string): Observable<Family | null> {
    const family = this.families.find((f) => f.children?.some((c) => c.id === childId)) || null;
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

    this.families.push(newFamily);
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

    this.families[index] = updatedFamily;
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

    this.authorizedPersons.push(newPerson);

    command.childIds.forEach((childId) => {
      this.authorizedPersonChildLinks.push({
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
