import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FamiliesFacade } from '../../services/families.facade';
import { CreateFamilyCommand } from '../../data-access';

interface ChildFormModel {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface FamilyFormModel {
  familyName: string;
  guardianNames: string;
  address: string;
  phoneNumber: string;
  email: string;
  children: ChildFormModel[];
}

@Component({
  selector: 'ccm-family-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './family-create.page.html',
})
export class FamilyCreatePage implements OnInit {
  private facade = inject(FamiliesFacade);
  private router = inject(Router);

  familyForm!: FormGroup<{
    familyName: FormControl<string | null>;
    guardianNames: FormControl<string | null>;
    address: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    email: FormControl<string | null>;
    children: FormArray<
      FormGroup<{
        firstName: FormControl<string | null>;
        lastName: FormControl<string | null>;
        birthDate: FormControl<string | null>;
      }>
    >;
  }>;

  isLoading = this.facade.isLoading;
  error = this.facade.error;

  ngOnInit(): void {
    this.familyForm = new FormGroup({
      familyName: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      guardianNames: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      address: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      phoneNumber: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: false, validators: [Validators.required, Validators.email] }),
      children: new FormArray<
        FormGroup<{
          firstName: FormControl<string | null>;
          lastName: FormControl<string | null>;
          birthDate: FormControl<string | null>;
        }>
      >([], Validators.required),
    });

    this.addChild();
  }

  get children(): FormArray {
    return this.familyForm.get('children') as FormArray;
  }

  addChild(): void {
    const childGroup = new FormGroup({
      firstName: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      lastName: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      birthDate: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
    });
    this.children.push(childGroup);
  }

  removeChild(index: number): void {
    if (this.children.length > 1) {
      this.children.removeAt(index);
    }
  }

  cancel(): void {
    this.router.navigate(['/families']);
  }

  onSubmit(): void {
    if (this.familyForm.invalid) {
      this.familyForm.markAllAsTouched();
      return;
    }

    const formValue = this.familyForm.value as FamilyFormModel;

    const command: CreateFamilyCommand = {
      familyName: formValue.familyName,
      guardianNames: formValue.guardianNames.split(',').map((name) => name.trim()),
      address: formValue.address,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      children: formValue.children.map((child) => ({
        firstName: child.firstName,
        lastName: child.lastName,
        birthDate: new Date(child.birthDate),
      })),
    };

    this.facade.createFamily(command).subscribe({
      next: (family) => {
        this.router.navigate(['/families', family.id]);
      },
      error: (err) => {
        console.error('Failed to create family:', err);
      },
    });
  }
}
