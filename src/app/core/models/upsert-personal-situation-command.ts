export interface UpsertPersonalSituationCommand {
  parentId: string;
  maritalStatus?: string;
  occupation?: string;
  employer?: string;
  notes?: string;
}
