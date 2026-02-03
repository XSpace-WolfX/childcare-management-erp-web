import { Child } from './child-model';
import { Parent } from './parent-model';

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
