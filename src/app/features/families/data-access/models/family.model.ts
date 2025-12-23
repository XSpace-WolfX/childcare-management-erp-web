import { Child } from './child.model';

export interface Family {
  id: string;
  familyName: string;
  guardianNames: string[];
  address: string;
  phoneNumber: string;
  email: string;
  children?: Child[];
}
