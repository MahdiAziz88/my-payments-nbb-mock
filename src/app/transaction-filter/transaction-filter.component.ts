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
  hasChanges: boolean = false;

  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();
  @Output() closeFilterClicked = new EventEmitter<void>(); // New Output Event

  // Emit the filter criteria when applying the filter
  applyFilter(): void {
    this.filterApplied.emit({
      fromDate: this.fromDate,
      toDate: this.toDate,
      type: this.transactionType
    });
    this.hasChanges = false;
  }

  // Emit the reset event when clearing the filter
  clearFilter(): void {
    this.fromDate = '';
    this.toDate = '';
    this.transactionType = 'All';
    this.filterCleared.emit();
    this.hasChanges = false;
  }

  // Emit close filter event
  closeFilter(): void {
    this.closeFilterClicked.emit(); // Notify parent about closing
  }

  // Check if any value has changed
  checkChanges(): void {
    this.hasChanges =
      !!this.fromDate ||
      !!this.toDate ||
      this.transactionType !== 'All';
  }
}
