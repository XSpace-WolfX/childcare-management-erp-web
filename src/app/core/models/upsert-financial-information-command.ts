export interface UpsertFinancialInformationCommand {
  parentId: string;
  monthlyIncome?: number;
  employmentType?: string;
  notes?: string;
}
