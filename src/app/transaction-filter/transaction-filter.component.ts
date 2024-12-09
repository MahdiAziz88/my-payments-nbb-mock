import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent implements OnChanges {
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();
  @Output() closeFilterClicked = new EventEmitter<void>();

  hasChanges = false; // Tracks if any changes were made

  // Detect changes to @Input() filterCriteria and update hasChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterCriteria) {
      this.updateHasChanges(); // Update the `hasChanges` flag based on the current criteria
    }
  }

  // Emit the current filter criteria when the user applies filters
  applyFilter(): void {
    this.filterApplied.emit(this.filterCriteria);
    this.hasChanges = false; // Reset the change detection flag
  }

  // Reset filters and emit a cleared event
  clearFilter(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Reset filter inputs
    this.filterCleared.emit();
    this.hasChanges = false; // Reset the change detection flag
  }

  // Notify parent to close the filter panel
  closeFilter(): void {
    this.closeFilterClicked.emit();
  }

  // Manually check for changes when inputs are modified
  checkChanges(): void {
    this.updateHasChanges();
  }

  // Update hasChanges flag based on the filter criteria values
  private updateHasChanges(): void {
    this.hasChanges =
      !!this.filterCriteria.fromDate || // Check if "fromDate" is set
      !!this.filterCriteria.toDate || // Check if "toDate" is set
      this.filterCriteria.type !== 'All'; // Check if "type" is not default
  }
}
