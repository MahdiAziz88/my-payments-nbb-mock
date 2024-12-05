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
  showFilters: boolean = false; // Toggle state for filters

  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();
  @Output() filterToggled = new EventEmitter<boolean>(); // Notify parent about the toggle state

  // Toggle filter visibility
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    this.filterToggled.emit(this.showFilters); // Notify parent
  }

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

  // Check if any value has changed
  checkChanges(): void {
    this.hasChanges =
      !!this.fromDate ||
      !!this.toDate ||
      this.transactionType !== 'All'; // Default type is 'All'
  }
}
