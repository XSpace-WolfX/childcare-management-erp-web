import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  AfterViewInit,
  signal,
  effect,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FamiliesStore } from '../../data-access/family-store';
import {
  CreateAuthorizedPersonCommand,
  AuthorizedPerson,
} from '../../../../core/models/authorized-person';
import { UpdateFamilyCommand, Family } from '../../../../core/models/family';
import { UpdateChildCommand, Child } from '../../../../core/models/child';
import { UpsertPersonalSituationCommand } from '../../../../core/models/personal-situation';
import { UpsertFinancialInformationCommand } from '../../../../core/models/financial-information';
import { ChildrenListComponent } from '../../components/children-list/children-list';
import { AuthorizedPersonFormComponent } from '../../components/authorized-person-form/authorized-person-form';
import { PersonalSituationEditorComponent } from '../../components/personal-situation-editor/personal-situation-editor';
import { FinancialInformationEditorComponent } from '../../components/financial-information-editor/financial-information-editor';

@Component({
  selector: 'ccm-family-detail',
  imports: [
    ReactiveFormsModule,
    ChildrenListComponent,
    AuthorizedPersonFormComponent,
    PersonalSituationEditorComponent,
    FinancialInformationEditorComponent,
  ],
  templateUrl: './family-detail.html',
  styleUrls: ['./family-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private routeParams = toSignal(this.route.paramMap);

  isEditMode = signal(false);
  selectedChildId = signal<string | null>(null);
  familyEditForm!: FormGroup;
  successMessage = signal<string | null>(null);
  formResetTrigger = signal(0);
  personalSituationSaveSuccessTrigger = signal(0);
  financialInformationSaveSuccessTrigger = signal(0);

  constructor() {
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

    effect(() => {
      const params = this.routeParams();
      if (params) {
        const childId = params.get('childId');
        const familyId = params.get('familyId');

        if (childId) {
          this.selectedChildId.set(childId);
          this.store.loadFamilyByChildId(childId);
        } else if (familyId) {
          this.selectedChildId.set(null);
          this.store.loadFamily(familyId);
        }
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
      children: this.fb.array(
        family.children?.map((child: Child) => this.createChildFormGroup(child)) || [],
      ),
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
    this.store.loadAuthorizedPersonChildLinks();

    const params = this.route.snapshot.paramMap;
    const childId = params.get('childId');
    const familyId = params.get('familyId');

    if (!childId && !familyId) {
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
    if (this.selectedChildId()) {
      setTimeout(() => {
        const element = document.getElementById(`child-${this.selectedChildId()}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }

  navigateToChild(childId: string): void {
    this.router.navigate(['/families/children', childId]);
  }

  goBack(): void {
    this.router.navigate(['/families']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/today']);
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

  handleAuthorizedPersonSubmit(command: CreateAuthorizedPersonCommand): void {
    this.store.createAuthorizedPerson(command).subscribe({
      next: () => {
        this.successMessage.set('Personne autorisée ajoutée avec succès');
        this.loadAuthorizedPersons();
        this.formResetTrigger.update((v) => v + 1);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }

  handlePersonalSituationSave(event: {
    parentId: string;
    command: UpsertPersonalSituationCommand;
  }): void {
    this.store.upsertPersonalSituation(event.command).subscribe({
      next: () => {
        this.successMessage.set('Situation personnelle mise à jour avec succès');
        this.personalSituationSaveSuccessTrigger.update((v) => v + 1);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }

  handleFinancialInformationSave(event: {
    parentId: string;
    command: UpsertFinancialInformationCommand;
  }): void {
    this.store.upsertFinancialInformation(event.command).subscribe({
      next: () => {
        this.successMessage.set('Informations financières mises à jour avec succès');
        this.financialInformationSaveSuccessTrigger.update((v) => v + 1);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.successMessage.set(null);
      },
    });
  }
}
