import { UpdateChildCommand } from './update-child-command';

export interface UpdateFamilyCommand {
  id: string;
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children: UpdateChildCommand[];
}
