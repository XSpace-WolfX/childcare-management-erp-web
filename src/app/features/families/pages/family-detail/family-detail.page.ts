import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FamiliesFacade } from '../../services/families.facade';

@Component({
  selector: 'ccm-family-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './family-detail.page.html',
})
export class FamilyDetailPage implements OnInit {
  private facade = inject(FamiliesFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  family = this.facade.selectedFamily;
  isLoading = this.facade.isLoading;
  error = this.facade.error;

  ngOnInit(): void {
    const familyId = this.route.snapshot.paramMap.get('familyId');
    if (familyId) {
      this.facade.loadFamily(familyId);
    } else {
      this.router.navigate(['/families']);
    }
  }

  goBack(): void {
    this.router.navigate(['/families']);
  }
}
