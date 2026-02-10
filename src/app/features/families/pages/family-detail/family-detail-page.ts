import { Component, inject, OnInit, AfterViewInit, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FamiliesStore } from '../../families-store';
import { CreateAuthorizedPersonCommand, AuthorizedPerson } from '../../../../core/models/authorized-person-model';
import { UpdateFamilyCommand, Family } from '../../../../core/models/family-model';
import { UpdateChildCommand, Child } from '../../../../core/models/child-model';
import { UpsertPersonalSituationCommand } from '../../../../core/models/personal-situation-model';
import { UpsertFinancialInformationCommand } from '../../../../core/models/financial-information-model';

@Component({
  selector: 'ccm-family-detail',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './family-detail-page.html',
})
export class FamilyDetailPage implements OnInit, AfterViewInit {
  private store = inject(FamiliesStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  family = this.store.selectedFamily;
  isLoading = this.store.isLoading;
  error = this.store.error;
  authorizedPersonChildLinks = this.store.authorizedPersonChildLinks;

  authorizedPersonsCache = signal<Map<string, AuthorizedPerson[]>>(new Map());

  isEditMode = signal(false);
  highlightedChildId = signal<string | null>(null);
  familyEditForm!: FormGroup;
  authorizedPersonForm: FormGroup;
  selectedChildIds = signal<string[]>([]);
  successMessage = signal<string | null>(null);

  editingPersonalSituation = signal<string | null>(null);
  editingFinancialInformation = signal<string | null>(null);
  personalSituationForm!: FormGroup;
  financialInformationForm!: FormGroup;

  constructor() {
    this.authorizedPersonForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      email: [''],
    });

    effect(() => {
      const currentFamily = this.family();
      if (currentFamily?.children) {
        this.loadAuthorizedPersons();
      }
    });

    effect(() => {
      const currentFamily = this.family();
      if (currentFamily && this.isEditMode()) {
        this.initializeFamilyEditForm(currentFamily);
      }
    });
  }

  private initializeFamilyEditForm(family: Family): void {
    const guardianNamesStr = family.guardianNames.join(', ');

    this.familyEditForm = this.fb.group({
      familyName: [family.familyName, Validators.required],
      guardianNames: [guardianNamesStr, Validators.required],
      address: [family.address, Validators.required],
      phoneNumber: [family.phoneNumber, Validators.required],
      email: [family.email, [Validators.required, Validators.email]],
      children: this.fb.array(family.children?.map((child: Child) => this.createChildFormGroup(child)) || []),
    });
  }

  private createChildFormGroup(child: Child): FormGroup {
    return this.fb.group({
      id: [child.id],
      firstName: [child.firstName, Validators.required],
      lastName: [child.lastName, Validators.required],
      birthDate: [this.formatDateForInput(child.birthDate), Validators.required],
    });
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get childrenFormArray(): FormArray {
    return this.familyEditForm?.get('children') as FormArray;
  }

  ngOnInit(): void {
    const familyId = this.route.snapshot.paramMap.get('familyId');
    const childId = this.route.snapshot.paramMap.get('childId');

    this.store.loadAuthorizedPersonChildLinks();

    if (childId) {
      this.highlightedChildId.set(childId);
      this.store.loadFamilyByChildId(childId);
    } else if (familyId) {
      this.store.loadFamily(familyId);
    } else {
      this.router.navigate(['/families']);
    }
  }

  private loadAuthorizedPersons(): void {
    const currentFamily = this.family();
    if (currentFamily?.children) {
      currentFamily.children.forEach((child) => {
        this.store.getAuthorizedPersonsByChildId(child.id).subscribe({
          next: (persons) => {
            const cache = this.authorizedPersonsCache();
            cache.set(child.id, persons);
            this.authorizedPersonsCache.set(new Map(cache));
          },
        });
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.highlightedChildId()) {
      setTimeout(() => {
        const element = document.getElementById(`child-${this.highlightedChildId()}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }

  isChildHighlighted(childId: string): boolean {
    return this.highlightedChildId() === childId;
  }

  goBack(): void {
    this.router.navigate(['/families']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/today']);
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

  getAuthorizedPersonsForChild(childId: string): AuthorizedPerson[] {
    return this.authorizedPersonsCache().get(childId) || [];
  }

  getChildrenWithAuthorizedPersons(): Child[] {
    const currentFamily = this.family();
    if (!currentFamily || !currentFamily.children) return [];

    return currentFamily.children.filter((child) => {
      const links = this.authorizedPersonChildLinks();
      return links.some((link) => link.childId === child.id);
    });
  }

  enterEditMode(): void {
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
  }

  saveFamily(): void {
    if (this.familyEditForm.invalid) {
      return;
    }

    const currentFamily = this.family();
    if (!currentFamily) return;

    interface FamilyFormValue {
      familyName: string;
      guardianNames: string;
      address: string;
      phoneNumber: string;
      email: string;
      children: { id: string; firstName: string; lastName: string; birthDate: string }[];
    }

    const formValue = this.familyEditForm.value as FamilyFormValue;
    const guardianNamesArray = formValue.guardianNames
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => name.length > 0);

    const childrenCommands: UpdateChildCommand[] = formValue.children.map((child) => ({
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      birthDate: new Date(child.birthDate),
    }));

    const command: UpdateFamilyCommand = {
      id: currentFamily.id,
      familyName: formValue.familyName,
      guardianNames: guardianNamesArray,
      address: formValue.address,
      phoneNumber: formValue.phoneNumber,
      email: formValue.email,
      children: childrenCommands,
    };

    this.store.updateFamily(command).subscribe({
      next: () => {
        this.isEditMode.set(false);
        this.successMessage.set('Famille mise à jour avec succès');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }

  submitAuthorizedPerson(): void {
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

    this.store.createAuthorizedPerson(command).subscribe({
      next: () => {
        this.successMessage.set('Personne autorisée ajoutée avec succès');
        this.authorizedPersonForm.reset();
        this.selectedChildIds.set([]);
        this.loadAuthorizedPersons();
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }

  enterEditPersonalSituation(parentId: string): void {
    const currentFamily = this.family();
    if (!currentFamily?.parents) return;

    const parent = currentFamily.parents.find((p) => p.id === parentId);
    if (!parent) return;

    this.personalSituationForm = this.fb.group({
      maritalStatus: [parent.personalSituation?.maritalStatus || ''],
      occupation: [parent.personalSituation?.occupation || ''],
      employer: [parent.personalSituation?.employer || ''],
      notes: [parent.personalSituation?.notes || ''],
    });

    this.editingPersonalSituation.set(parentId);
  }

  cancelEditPersonalSituation(): void {
    this.editingPersonalSituation.set(null);
  }

  savePersonalSituation(parentId: string): void {
    if (this.personalSituationForm.invalid) {
      return;
    }

    const formValue = this.personalSituationForm.value;
    const command: UpsertPersonalSituationCommand = {
      parentId,
      maritalStatus: formValue.maritalStatus?.trim() || undefined,
      occupation: formValue.occupation?.trim() || undefined,
      employer: formValue.employer?.trim() || undefined,
      notes: formValue.notes?.trim() || undefined,
    };

    this.store.upsertPersonalSituation(command).subscribe({
      next: () => {
        this.editingPersonalSituation.set(null);
        this.successMessage.set('Situation personnelle mise à jour avec succès');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }

  enterEditFinancialInformation(parentId: string): void {
    const currentFamily = this.family();
    if (!currentFamily?.parents) return;

    const parent = currentFamily.parents.find((p) => p.id === parentId);
    if (!parent) return;

    this.financialInformationForm = this.fb.group({
      monthlyIncome: [parent.financialInformation?.monthlyIncome || null],
      employmentType: [parent.financialInformation?.employmentType || ''],
      notes: [parent.financialInformation?.notes || ''],
    });

    this.editingFinancialInformation.set(parentId);
  }

  cancelEditFinancialInformation(): void {
    this.editingFinancialInformation.set(null);
  }

  saveFinancialInformation(parentId: string): void {
    if (this.financialInformationForm.invalid) {
      return;
    }

    const formValue = this.financialInformationForm.value;
    const command: UpsertFinancialInformationCommand = {
      parentId,
      monthlyIncome: formValue.monthlyIncome || undefined,
      employmentType: formValue.employmentType?.trim() || undefined,
      notes: formValue.notes?.trim() || undefined,
    };

    this.store.upsertFinancialInformation(command).subscribe({
      next: () => {
        this.editingFinancialInformation.set(null);
        this.successMessage.set('Informations financières mises à jour avec succès');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }
}
