import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent {
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();
  @Output() closeFilterClicked = new EventEmitter<void>();

  hasChanges = false; // Tracks if any changes were made

  // Emit the current filter criteria when the user applies filters
  applyFilter(): void {
    this.filterApplied.emit(this.filterCriteria);
    this.hasChanges = false;
  }

  // Reset filters and emit a cleared event
  clearFilter(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' };
    this.filterCleared.emit();
    this.hasChanges = false;
  }

  // Notify parent to close the filter panel
  closeFilter(): void {
    this.closeFilterClicked.emit();
  }

  // Detect changes to inputs and update the hasChanges flag
  checkChanges(): void {
    this.hasChanges = !!this.filterCriteria.fromDate || !!this.filterCriteria.toDate || this.filterCriteria.type !== 'All';
  }
}
