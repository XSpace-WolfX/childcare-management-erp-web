import { CreateChildCommand } from './create-child-command';
import { CreateParentCommand } from './create-parent-command';

export interface CreateFamilyCommand {
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children: CreateChildCommand[];
  parents?: CreateParentCommand[];
}
