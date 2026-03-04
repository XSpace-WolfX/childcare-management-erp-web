import { PersonalSituation } from './personal-situation';
import { FinancialInformation } from './financial-information';

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  personalSituation?: PersonalSituation;
  financialInformation?: FinancialInformation;
}

export interface CreateParentCommand {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  personalSituation?: PersonalSituation;
  financialInformation?: FinancialInformation;
}
