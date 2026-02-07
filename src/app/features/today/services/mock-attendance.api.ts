import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ChildAttendanceView } from '../models/attendance-view.model';

@Injectable()
export class MockAttendanceApi {
  getAttendanceForToday(): Observable<ChildAttendanceView[]> {
    const mockData: ChildAttendanceView[] = [
      {
        id: '1',
        name: 'Emma Johnson',
        status: 'present',
        expectedArrivalTime: '08:00',
        checkInTime: '07:55',
        hasAllergies: true,
        hasPAI: false,
        missingAuthorizations: false,
      },
      {
        id: '2',
        name: 'Liam Smith',
        status: 'present',
        expectedArrivalTime: '08:30',
        checkInTime: '08:25',
        hasAllergies: false,
        hasPAI: true,
        missingAuthorizations: false,
      },
      {
        id: '3',
        name: 'Olivia Brown',
        status: 'expected',
        expectedArrivalTime: '09:00',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: true,
      },
      {
        id: '4',
        name: 'Noah Davis',
        status: 'expected',
        expectedArrivalTime: '08:45',
        hasAllergies: true,
        hasPAI: false,
        missingAuthorizations: false,
      },
      {
        id: '5',
        name: 'Ava Wilson',
        status: 'absent',
        expectedArrivalTime: '08:00',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
      {
        id: '6',
        name: 'Ethan Martinez',
        status: 'present',
        expectedArrivalTime: '07:30',
        checkInTime: '07:35',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
      {
        id: '7',
        name: 'Sophia Garcia',
        status: 'present',
        expectedArrivalTime: '08:15',
        checkInTime: '08:10',
        hasAllergies: true,
        hasPAI: true,
        missingAuthorizations: false,
      },
      {
        id: '8',
        name: 'Mason Rodriguez',
        status: 'expected',
        expectedArrivalTime: '09:30',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
      {
        id: '9',
        name: 'Isabella Lopez',
        status: 'present',
        expectedArrivalTime: '08:00',
        checkInTime: '08:05',
        checkOutTime: undefined,
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: true,
      },
      {
        id: '10',
        name: 'Lucas Hernandez',
        status: 'absent',
        expectedArrivalTime: '08:30',
        hasAllergies: false,
        hasPAI: false,
        missingAuthorizations: false,
      },
    ];

    return of(mockData).pipe(delay(300));
  }
}
