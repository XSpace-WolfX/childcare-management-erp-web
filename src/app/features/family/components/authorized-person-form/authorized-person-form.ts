import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  inject,
  effect,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Child } from '../../../../core/models/child';
import { CreateAuthorizedPersonCommand } from '../../../../core/models/authorized-person';

@Component({
  selector: 'ccm-authorized-person-form',
  imports: [ReactiveFormsModule],
  templateUrl: './authorized-person-form.html',
  styleUrls: ['./authorized-person-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedPersonFormComponent {
  private fb = inject(FormBuilder);

  children = input.required<Child[]>();
  resetTrigger = input<number>(0);

  authorizedPersonSubmit = output<CreateAuthorizedPersonCommand>();

  authorizedPersonForm: FormGroup;
  selectedChildIds = signal<string[]>([]);

  constructor() {
    this.authorizedPersonForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      email: [''],
    });

    effect(() => {
      const trigger = this.resetTrigger();
      if (trigger > 0) {
        this.resetForm();
      }
    });
  }

  toggleChildSelection(childId: string): void {
    const selected = this.selectedChildIds();
    const index = selected.indexOf(childId);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(childId);
    }
    this.selectedChildIds.set([...selected]);
  }

  isChildSelected(childId: string): boolean {
    return this.selectedChildIds().includes(childId);
  }

  onSubmit(): void {
    if (this.authorizedPersonForm.invalid) {
      return;
    }

    if (this.selectedChildIds().length === 0) {
      return;
    }

    const formValue = this.authorizedPersonForm.value;
    const command: CreateAuthorizedPersonCommand = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      phone: formValue.phone?.trim() || undefined,
      email: formValue.email?.trim() || undefined,
      childIds: this.selectedChildIds(),
    };

    this.authorizedPersonSubmit.emit(command);
  }

  resetForm(): void {
    this.authorizedPersonForm.reset();
    this.selectedChildIds.set([]);
  }
}
