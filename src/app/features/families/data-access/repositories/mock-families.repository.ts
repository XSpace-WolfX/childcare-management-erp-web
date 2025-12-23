import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Family } from '../models/family.model';
import { Child } from '../models/child.model';
import { CreateFamilyCommand } from '../models/create-family.command';
import { FamiliesRepository } from './families.repository';

@Injectable()
export class MockFamiliesRepository implements FamiliesRepository {
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

    const newFamily: Family = {
      id: newFamilyId,
      familyName: command.familyName,
      guardianNames: command.guardianNames,
      address: command.address,
      phoneNumber: command.phoneNumber,
      email: command.email,
      children,
    };

    this.families.push(newFamily);
    return of(newFamily).pipe(delay(400));
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
