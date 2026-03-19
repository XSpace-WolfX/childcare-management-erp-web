import { ChangeDetectionStrategy, Component, input, output, signal, inject, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FinancialInformation } from '../../../../core/models/financial-information';
import { UpsertFinancialInformationCommand } from '../../../../core/models/financial-information';

@Component({
  selector: 'ccm-financial-information-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './financial-information-editor.html',
  styleUrls: ['./financial-information-editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInformationEditorComponent {
  private fb = inject(FormBuilder);

  parentId = input.required<string>();
  financialInformation = input<FinancialInformation | undefined>(undefined);
  saveSuccessTrigger = input<number>(0);

  save = output<{ parentId: string; command: UpsertFinancialInformationCommand }>();

  isEditing = signal(false);
  financialInformationForm!: FormGroup;

  constructor() {
    effect(() => {
      const trigger = this.saveSuccessTrigger();
      if (trigger > 0 && this.isEditing()) {
        this.isEditing.set(false);
      }
    });
  }

  enterEditMode(): void {
    const info = this.financialInformation();
    
    this.financialInformationForm = this.fb.group({
      monthlyIncome: [info?.monthlyIncome || null],
      employmentType: [info?.employmentType || ''],
      notes: [info?.notes || ''],
    });

    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onSave(): void {
    if (this.financialInformationForm.invalid) {
      return;
    }

    const formValue = this.financialInformationForm.value;
    const command: UpsertFinancialInformationCommand = {
      parentId: this.parentId(),
      monthlyIncome: formValue.monthlyIncome || undefined,
      employmentType: formValue.employmentType?.trim() || undefined,
      notes: formValue.notes?.trim() || undefined,
    };

    this.save.emit({ parentId: this.parentId(), command });
  }
}
