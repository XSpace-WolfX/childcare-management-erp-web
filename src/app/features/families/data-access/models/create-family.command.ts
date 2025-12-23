import { CreateChildCommand } from './create-child.command';

export interface CreateFamilyCommand {
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children: CreateChildCommand[];
}
