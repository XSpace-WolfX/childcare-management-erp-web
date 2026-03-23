import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Child } from '../../../../core/models/child';

@Component({
  selector: 'ccm-children-list',
  imports: [DatePipe],
  templateUrl: './children-list.html',
  styleUrls: ['./children-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenListComponent {
  children = input.required<Child[]>();
  selectedChildId = input<string | null>(null);

  childSelected = output<string>();

  onChildClick(childId: string): void {
    this.childSelected.emit(childId);
  }

  isChildSelected(childId: string): boolean {
    return this.selectedChildId() === childId;
  }
}
