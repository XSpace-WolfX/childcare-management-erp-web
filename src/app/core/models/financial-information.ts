export interface FinancialInformation {
  monthlyIncome?: number;
  employmentType?: string;
  notes?: string;
}

export interface UpsertFinancialInformationCommand {
  parentId: string;
  monthlyIncome?: number;
  employmentType?: string;
  notes?: string;
}
