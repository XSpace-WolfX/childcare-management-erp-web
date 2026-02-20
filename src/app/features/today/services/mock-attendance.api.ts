import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ChildAttendanceView } from '../models/attendance-view-model';
import { getAllChildren } from '../../../core/mock/childcare-mock-db';

@Injectable()
export class MockAttendanceApi {
  getAttendanceForToday(): Observable<ChildAttendanceView[]> {
    const allChildren = getAllChildren();

    const attendanceStates: Record<
      string,
      {
        status: 'present' | 'expected' | 'absent';
        expectedArrivalTime: string;
        checkInTime?: string;
        checkOutTime?: string;
        hasAllergies: boolean;
        hasPAI: boolean;
        missingAuthorizations: boolean;
      }
    > = {
      'child-1': {
        status: 'present',
        expectedArrivalTime: '08:00',
        checkInTime: '07:55',
        hasAllergies: true,
        hasPAI: false,
        missingAuthorizations: false,
      },
      'child-2': {
        status: 'present',
        expectedArrivalTime: '08:30',
        checkInTime: '08:25',
        hasAllergies: false,
        hasPAI: true,
        missingAuthorizations: false,
      },
      'child-3': {
        status: 'expected',
        expectedArrivalTime: '09:00',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: true,
      },
      'child-4': {
        status: 'expected',
        expectedArrivalTime: '08:45',
        hasAllergies: true,
        hasPAI: false,
        missingAuthorizations: false,
      },
      'child-5': {
        status: 'absent',
        expectedArrivalTime: '08:00',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
      'child-6': {
        status: 'present',
        expectedArrivalTime: '07:30',
        checkInTime: '07:35',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
      'child-7': {
        status: 'present',
        expectedArrivalTime: '08:15',
        checkInTime: '08:10',
        hasAllergies: true,
        hasPAI: true,
        missingAuthorizations: false,
      },
      'child-8': {
        status: 'expected',
        expectedArrivalTime: '09:30',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
    };

    const mockData: ChildAttendanceView[] = allChildren
      .filter((child) => attendanceStates[child.id])
      .map((child) => {
        const state = attendanceStates[child.id];
        return {
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          status: state.status,
          expectedArrivalTime: state.expectedArrivalTime,
          checkInTime: state.checkInTime,
          checkOutTime: state.checkOutTime,
          hasAllergies: state.hasAllergies,
          hasPAI: state.hasPAI,
          missingAuthorizations: state.missingAuthorizations,
        };
      });

    return of(mockData).pipe(delay(300));
  }
}
