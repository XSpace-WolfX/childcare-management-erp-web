import { Component, output, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ccm-tools-drawer',
  standalone: true,
  imports: [],
  templateUrl: './tools-drawer-component.html',
  styleUrls: ['./tools-drawer-component.scss'],
})
export class ToolsDrawerComponent {
  private readonly router = inject(Router);

  isOpen = input.required<boolean>();
  closeDrawer = output<void>();

  navigateTo(path: string, extras?: { queryParams?: Record<string, string> }): void {
    this.router.navigate([path], extras);
    this.closeDrawer.emit();
  }

  onBackdropClick(): void {
    this.closeDrawer.emit();
  }

  onDrawerClick(event: Event): void {
    event.stopPropagation();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDrawer.emit();
    }
  }
}
