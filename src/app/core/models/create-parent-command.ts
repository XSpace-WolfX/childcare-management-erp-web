import { PersonalSituation } from './personal-situation-model';
import { FinancialInformation } from './financial-information-model';

export interface CreateParentCommand {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  personalSituation?: PersonalSituation;
  financialInformation?: FinancialInformation;
}
