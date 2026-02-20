export type AttendanceStatus = 'expected' | 'present' | 'absent';

export interface ChildAttendanceView {
  id: string;
  name: string;
  status: AttendanceStatus;
  expectedArrivalTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
  hasAllergies: boolean;
  hasPAI: boolean;
  missingAuthorizations: boolean;
}

export interface AttendanceSummary {
  expectedCount: number;
  presentCount: number;
  absentCount: number;
}

export interface CriticalAlert {
  childId: string;
  childName: string;
  alertType: 'allergy' | 'pai' | 'authorization';
  message: string;
}
