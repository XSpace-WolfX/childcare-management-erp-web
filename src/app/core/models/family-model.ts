import { Child, CreateChildCommand, UpdateChildCommand } from './child-model';
import { Parent, CreateParentCommand } from './parent-model';

export interface Family {
  id: string;
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children?: Child[];
  parents?: Parent[];
}

export interface CreateFamilyCommand {
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children: CreateChildCommand[];
  parents?: CreateParentCommand[];
}

export interface UpdateFamilyCommand {
  id: string;
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children: UpdateChildCommand[];
}
