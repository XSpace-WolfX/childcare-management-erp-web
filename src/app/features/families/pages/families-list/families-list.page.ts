import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FamiliesFacade } from '../../services/families.facade';

@Component({
  selector: 'ccm-families-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './families-list.page.html',
})
export class FamiliesListPage implements OnInit {
  private facade = inject(FamiliesFacade);
  private router = inject(Router);

  families = this.facade.families;
  isLoading = this.facade.isLoading;
  error = this.facade.error;

  ngOnInit(): void {
    this.facade.loadFamilies();
  }

  viewFamily(familyId: string): void {
    this.router.navigate(['/families', familyId]);
  }

  createFamily(): void {
    this.router.navigate(['/families/new']);
  }
}
