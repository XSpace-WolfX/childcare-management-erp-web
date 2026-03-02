import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FamiliesStore } from '../../families-store';
import { CreateFamilyCommand } from '../../../../core';
import { CreateParentCommand } from '../../../../core/models/parent-model';

interface ChildFormModel {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface PersonalSituationFormModel {
  maritalStatus?: string;
  occupation?: string;
  employer?: string;
  notes?: string;
}

interface FinancialInformationFormModel {
  monthlyIncome?: number;
  employmentType?: string;
  notes?: string;
}

interface ParentFormModel {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  personalSituation?: PersonalSituationFormModel;
  financialInformation?: FinancialInformationFormModel;
}

interface FamilyFormModel {
  familyName: string;
  guardianNames: string;
  address: string;
  phoneNumber: string;
  email: string;
  children: ChildFormModel[];
  parents: ParentFormModel[];
}

@Component({
  selector: 'ccm-family-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './family-create-page.html',
})
export class FamilyCreatePage implements OnInit {
  private store = inject(FamiliesStore);
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
    parents: FormArray<
      FormGroup<{
        firstName: FormControl<string | null>;
        lastName: FormControl<string | null>;
        email: FormControl<string | null>;
        phoneNumber: FormControl<string | null>;
        personalSituation: FormGroup<{
          maritalStatus: FormControl<string | null>;
          occupation: FormControl<string | null>;
          employer: FormControl<string | null>;
          notes: FormControl<string | null>;
        }>;
        financialInformation: FormGroup<{
          monthlyIncome: FormControl<number | null>;
          employmentType: FormControl<string | null>;
          notes: FormControl<string | null>;
        }>;
      }>
    >;
  }>;

  isLoading = this.store.isLoading;
  error = this.store.error;

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
      parents: new FormArray<
        FormGroup<{
          firstName: FormControl<string | null>;
          lastName: FormControl<string | null>;
          email: FormControl<string | null>;
          phoneNumber: FormControl<string | null>;
          personalSituation: FormGroup<{
            maritalStatus: FormControl<string | null>;
            occupation: FormControl<string | null>;
            employer: FormControl<string | null>;
            notes: FormControl<string | null>;
          }>;
          financialInformation: FormGroup<{
            monthlyIncome: FormControl<number | null>;
            employmentType: FormControl<string | null>;
            notes: FormControl<string | null>;
          }>;
        }>
      >([]),
    });

    this.addChild();
    this.addParent();
  }

  get children(): FormArray {
    return this.familyForm.get('children') as FormArray;
  }

  get parents(): FormArray {
    return this.familyForm.get('parents') as FormArray;
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

  addParent(): void {
    const parentGroup = new FormGroup({
      firstName: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      lastName: new FormControl('', { nonNullable: false, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: false }),
      phoneNumber: new FormControl('', { nonNullable: false }),
      personalSituation: new FormGroup({
        maritalStatus: new FormControl('', { nonNullable: false }),
        occupation: new FormControl('', { nonNullable: false }),
        employer: new FormControl('', { nonNullable: false }),
        notes: new FormControl('', { nonNullable: false }),
      }),
      financialInformation: new FormGroup({
        monthlyIncome: new FormControl<number | null>(null, { nonNullable: false }),
        employmentType: new FormControl('', { nonNullable: false }),
        notes: new FormControl('', { nonNullable: false }),
      }),
    });
    this.parents.push(parentGroup);
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

    const parentCommands: CreateParentCommand[] = formValue.parents
      .filter((parent) => parent.firstName && parent.lastName)
      .map((parent) => {
        const hasPersonalSituation =
          parent.personalSituation?.maritalStatus ||
          parent.personalSituation?.occupation ||
          parent.personalSituation?.employer ||
          parent.personalSituation?.notes;

        const hasFinancialInformation =
          parent.financialInformation?.monthlyIncome ||
          parent.financialInformation?.employmentType ||
          parent.financialInformation?.notes;

        return {
          firstName: parent.firstName,
          lastName: parent.lastName,
          email: parent.email || undefined,
          phoneNumber: parent.phoneNumber || undefined,
          personalSituation: hasPersonalSituation
            ? {
                maritalStatus: parent.personalSituation?.maritalStatus || undefined,
                occupation: parent.personalSituation?.occupation || undefined,
                employer: parent.personalSituation?.employer || undefined,
                notes: parent.personalSituation?.notes || undefined,
              }
            : undefined,
          financialInformation: hasFinancialInformation
            ? {
                monthlyIncome: parent.financialInformation?.monthlyIncome || undefined,
                employmentType: parent.financialInformation?.employmentType || undefined,
                notes: parent.financialInformation?.notes || undefined,
              }
            : undefined,
        };
      });

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
      parents: parentCommands.length > 0 ? parentCommands : undefined,
    };

    this.store.createFamily(command).subscribe({
      next: (family) => {
        this.router.navigate(['/families', family.id]);
      },
      error: (err) => {
        console.error('Failed to create family:', err);
      },
    });
  }
}
