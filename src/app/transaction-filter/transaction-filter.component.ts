import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent implements OnChanges {
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
  @Input() tempFilterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
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
    if (this.hasChanges) {
      // Emit only if changes exist between tempFilterCriteria and filterCriteria
      this.filterCriteria = { ...this.tempFilterCriteria }; // Update the filterCriteria with the new values
      this.filterApplied.emit(this.filterCriteria); // Emit the updated criteria
      this.hasChanges = false; // Reset the change detection flag
    }
  }

  // Reset filters and emit a cleared event
  clearFilter(): void {
    this.tempFilterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Reset tempFilterCriteria
    this.filterCriteria = { ...this.tempFilterCriteria }; // Reset filterCriteria
    this.filterCleared.emit();
    this.hasChanges = false; // Reset the change detection flag
  }

  // Notify parent to close the filter panel
  closeFilter(): void {
    this.closeFilterClicked.emit();
  }

  // Update hasChanges flag based on the filter criteria values
  updateHasChanges(): void {
    this.hasChanges =
      this.filterCriteria.fromDate !== this.tempFilterCriteria.fromDate || // Check if "fromDate" is different
      this.filterCriteria.toDate !== this.tempFilterCriteria.toDate || // Check if "toDate" is different
      this.filterCriteria.type !== this.tempFilterCriteria.type; // Check if "type" is different
  }
}
