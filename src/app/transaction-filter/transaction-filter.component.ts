import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent {
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
  @Input() tempFilterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();
  @Output() closeFilterClicked = new EventEmitter<void>();
  @Output() tempCriteriaChanged = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();

  hasChanges = false;
  canClear = false;

  // Emit the current filter criteria when the user applies filters
  applyFilter(): void {
    this.filterApplied.emit(this.tempFilterCriteria);
    this.hasChanges = false;
  }

  // Reset filters and emit a cleared event
  clearFilter(): void {
    this.tempFilterCriteria = { fromDate: '', toDate: '', type: 'All' };
    this.filterCleared.emit();
    this.updateHasChanges();
  }

  // Notify parent to close the filter panel
  closeFilter(): void {
    this.closeFilterClicked.emit();
  }

  // Sync changes in temp filter criteria to the parent
  onTempFilterChange(): void {
    this.tempCriteriaChanged.emit(this.tempFilterCriteria);
    this.updateHasChanges();
  }

  // Update hasChanges and canClear flags
  updateHasChanges(): void {
    const hasChangedFromDefaults =
      this.tempFilterCriteria.fromDate !== '' ||
      this.tempFilterCriteria.toDate !== '' ||
      this.tempFilterCriteria.type !== 'All';

    const hasChangedFromFilterCriteria =
      this.filterCriteria.fromDate !== this.tempFilterCriteria.fromDate ||
      this.filterCriteria.toDate !== this.tempFilterCriteria.toDate ||
      this.filterCriteria.type !== this.tempFilterCriteria.type;

    this.hasChanges = hasChangedFromFilterCriteria;
    this.canClear = hasChangedFromDefaults;
  }
}
