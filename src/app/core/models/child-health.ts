export interface ChildHealthView {
  id: string;
  name: string;
  group?: string;
  healthFlags: HealthFlags;
}

export interface HealthFlags {
  missingFamilyLink: boolean;
  missingAuthorizedPerson: boolean;
  missingContactInfo: boolean;
}

export interface HealthSummary {
  totalChildren: number;
  incompleteCount: number;
}

export type HealthFilter = 'incomplete' | 'missingAuthorization' | 'missingContact';
