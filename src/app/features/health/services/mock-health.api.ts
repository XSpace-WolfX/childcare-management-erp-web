import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ChildHealthView } from '../models/child-health-model';
import { getAllChildren } from '../../../core/mock/childcare-mock-db';

@Injectable()
export class MockHealthApi {
  getAllChildren(): Observable<ChildHealthView[]> {
    const allChildren = getAllChildren();

    const healthFlags: Record<
      string,
      { missingFamilyLink: boolean; missingAuthorizedPerson: boolean; missingContactInfo: boolean }
    > = {
      'child-1': { missingFamilyLink: false, missingAuthorizedPerson: false, missingContactInfo: false },
      'child-2': { missingFamilyLink: false, missingAuthorizedPerson: true, missingContactInfo: false },
      'child-3': { missingFamilyLink: false, missingAuthorizedPerson: false, missingContactInfo: true },
      'child-4': { missingFamilyLink: true, missingAuthorizedPerson: true, missingContactInfo: true },
      'child-5': { missingFamilyLink: false, missingAuthorizedPerson: false, missingContactInfo: false },
      'child-6': { missingFamilyLink: false, missingAuthorizedPerson: true, missingContactInfo: true },
      'child-7': { missingFamilyLink: true, missingAuthorizedPerson: false, missingContactInfo: false },
      'child-8': { missingFamilyLink: false, missingAuthorizedPerson: false, missingContactInfo: false },
      'child-9': { missingFamilyLink: false, missingAuthorizedPerson: true, missingContactInfo: false },
      'child-10': { missingFamilyLink: true, missingAuthorizedPerson: false, missingContactInfo: true },
      'child-11': { missingFamilyLink: false, missingAuthorizedPerson: false, missingContactInfo: false },
      'child-12': { missingFamilyLink: false, missingAuthorizedPerson: false, missingContactInfo: true },
    };

    const mockChildren: ChildHealthView[] = allChildren.map((child) => ({
      id: child.id,
      name: `${child.firstName} ${child.lastName}`,
      group: 'Groupe A',
      healthFlags: healthFlags[child.id] || {
        missingFamilyLink: false,
        missingAuthorizedPerson: false,
        missingContactInfo: false,
      },
    }));

    return of(mockChildren).pipe(delay(300));
  }
}
