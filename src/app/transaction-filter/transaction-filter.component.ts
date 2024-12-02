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

  @Output() filterApplied = new EventEmitter<{ fromDate: string; toDate: string; type: string }>();
  @Output() filterCleared = new EventEmitter<void>();

  applyFilter(): void {
    this.filterApplied.emit({ fromDate: this.fromDate, toDate: this.toDate, type: this.transactionType });
  }

  clearFilter(): void {
    this.fromDate = '';
    this.toDate = '';
    this.transactionType = 'All';
    this.filterCleared.emit();
  }
}
