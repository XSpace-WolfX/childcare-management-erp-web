import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HealthStore } from './health-store';

@Component({
  selector: 'ccm-health',
  standalone: true,
  imports: [],
  templateUrl: './health-page.html',
  styleUrls: ['./health-page.scss'],
})
export class HealthPage implements OnInit {
  protected readonly store = inject(HealthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const view = this.route.snapshot.queryParamMap.get('view');
    if (view === 'issues') {
      this.store.applyIssuesPreset();
    }
  }

  protected navigateToChild(childId: string): void {
    this.router.navigate(['/children', childId]);
  }
}
