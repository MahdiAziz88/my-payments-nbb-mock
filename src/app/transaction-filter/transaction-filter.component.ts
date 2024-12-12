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

  hasChanges = false;
  canClear = false;

  // Detect changes to @Input() filterCriteria and update hasChanges
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filterCriteria) {
      this.updateHasChanges();
    }
  }

  // Emit the current filter criteria when the user applies filters
  applyFilter(): void {
    this.filterApplied.emit(this.tempFilterCriteria);
    this.hasChanges = false; // Reset the change detection flag
  }

  // Reset filters and emit a cleared event
  clearFilter(): void {
    this.tempFilterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Reset tempFilterCriteria
    this.filterCleared.emit();
    this.updateHasChanges();
  }

  // Notify parent to close the filter panel
  closeFilter(): void {
    this.closeFilterClicked.emit();
  }

  // Update hasChanges and canClear flags based on filter criteria values
  updateHasChanges(): void {
    const hasChangedFromDefaults =
      this.tempFilterCriteria.fromDate !== '' ||
      this.tempFilterCriteria.toDate !== '' ||
      this.tempFilterCriteria.type !== 'All';

    const hasChangedFromFilterCriteria =
      this.filterCriteria.fromDate !== this.tempFilterCriteria.fromDate ||
      this.filterCriteria.toDate !== this.tempFilterCriteria.toDate ||
      this.filterCriteria.type !== this.tempFilterCriteria.type;

    this.hasChanges = hasChangedFromFilterCriteria; // "Apply" is enabled when changes exist
    this.canClear = hasChangedFromDefaults; // "Clear" is enabled when any non-default values exist
  }
}
