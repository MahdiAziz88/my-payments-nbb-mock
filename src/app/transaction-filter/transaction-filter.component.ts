import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent {
  fromDate: string = '';
  toDate: string = '';
  transactionType: string = 'All';
  hasChanges: boolean = false; // Tracks if any input has changed

  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();
  @Output() filterClosed = new EventEmitter<void>();

  // Emit the filter criteria when applying the filter
  applyFilter(): void {
    this.filterApplied.emit({
      fromDate: this.fromDate,
      toDate: this.toDate,
      type: this.transactionType
    });
    this.hasChanges = false; // Reset changes after applying
  }

  // Emit the reset event when clearing the filter
  clearFilter(): void {
    this.fromDate = '';
    this.toDate = '';
    this.transactionType = 'All';
    this.filterCleared.emit();
    this.hasChanges = false; // Reset changes after clearing
  }

  // Notify parent to close the filter
  closeFilters(): void {
    this.filterClosed.emit();
  }

  // Check if any value has changed
  checkChanges(): void {
    this.hasChanges =
      !!this.fromDate ||
      !!this.toDate ||
      this.transactionType !== 'All'; // Default type is 'All'
  }
}
