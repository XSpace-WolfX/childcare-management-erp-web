import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ChildInGroup } from '../models/child-group-model';
import { getAllChildren } from '../../../core/mock/childcare-mock-db';

@Injectable()
export class MockGroupsApi {
  getAllChildren(): Observable<ChildInGroup[]> {
    const allChildren = getAllChildren();

    const mockChildren: ChildInGroup[] = allChildren.map((child) => ({
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      group: `Groupe ${String.fromCharCode(65 + (allChildren.indexOf(child) % 4))}`,
    }));

    return of(mockChildren).pipe(delay(300));
  }
}
