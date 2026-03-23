import {
  ChangeDetectionStrategy,
  Component,
  output,
  input,
  inject,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ccm-tools-drawer',
  imports: [],
  templateUrl: './tools-drawer.html',
  styleUrls: ['./tools-drawer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolsDrawerComponent {
  private readonly router = inject(Router);
  private previouslyFocusedElement: HTMLElement | null = null;

  isOpen = input.required<boolean>();
  closeDrawer = output<void>();
  drawerPanel = viewChild<ElementRef<HTMLElement>>('drawerPanel');

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.previouslyFocusedElement = document.activeElement as HTMLElement;
        setTimeout(() => this.focusDrawer(), 0);
      } else if (this.previouslyFocusedElement) {
        this.previouslyFocusedElement.focus();
        this.previouslyFocusedElement = null;
      }
    });
  }

  private focusDrawer(): void {
    const panel = this.drawerPanel()?.nativeElement;
    if (panel) {
      panel.focus();
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const panel = this.drawerPanel()?.nativeElement;
    if (!panel) return [];

    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(panel.querySelectorAll(selector)) as HTMLElement[];
  }

  onDrawerKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      const focusableElements = this.getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

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
