import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HealthStore } from '../data-access/health-store';

@Component({
  selector: 'ccm-health',
  imports: [],
  templateUrl: './health.html',
  styleUrls: ['./health.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.router.navigate(['/families/children', childId]);
  }
}
