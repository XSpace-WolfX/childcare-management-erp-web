import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  inject,
  effect,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PersonalSituation } from '../../../../core/models/personal-situation';
import { UpsertPersonalSituationCommand } from '../../../../core/models/personal-situation';

@Component({
  selector: 'ccm-personal-situation-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './personal-situation-editor.html',
  styleUrls: ['./personal-situation-editor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalSituationEditorComponent {
  private fb = inject(FormBuilder);

  parentId = input.required<string>();
  personalSituation = input<PersonalSituation | undefined>(undefined);
  saveSuccessTrigger = input<number>(0);

  save = output<{ parentId: string; command: UpsertPersonalSituationCommand }>();

  isEditing = signal(false);
  personalSituationForm!: FormGroup;

  constructor() {
    effect(() => {
      const trigger = this.saveSuccessTrigger();
      if (trigger > 0 && this.isEditing()) {
        this.isEditing.set(false);
      }
    });
  }

  enterEditMode(): void {
    const situation = this.personalSituation();

    this.personalSituationForm = this.fb.group({
      maritalStatus: [situation?.maritalStatus || ''],
      occupation: [situation?.occupation || ''],
      employer: [situation?.employer || ''],
      notes: [situation?.notes || ''],
    });

    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onSave(): void {
    if (this.personalSituationForm.invalid) {
      return;
    }

    const formValue = this.personalSituationForm.value;
    const command: UpsertPersonalSituationCommand = {
      parentId: this.parentId(),
      maritalStatus: formValue.maritalStatus?.trim() || undefined,
      occupation: formValue.occupation?.trim() || undefined,
      employer: formValue.employer?.trim() || undefined,
      notes: formValue.notes?.trim() || undefined,
    };

    this.save.emit({ parentId: this.parentId(), command });
  }
}
