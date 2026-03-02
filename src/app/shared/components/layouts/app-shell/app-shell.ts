import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolsDrawerComponent } from '../../ui/tools-drawer/tools-drawer';

@Component({
  selector: 'ccm-app-shell',
  standalone: true,
  imports: [RouterOutlet, ToolsDrawerComponent],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShellComponent {
  protected readonly isDrawerOpen = signal(false);

  protected toggleDrawer(): void {
    this.isDrawerOpen.update((open) => !open);
  }

  protected closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }
}
