import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../interfaces';

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: './transaction-details-modal.component.html',
  styleUrls: ['./transaction-details-modal.component.css']
})
export class TransactionDetailsModalComponent implements OnInit {
  @Input() transaction!: Transaction;
  @Output() close = new EventEmitter<void>();

  formattedDate: string = ''; // Formatted date for display

  constructor() { }

  ngOnInit(): void {
    if (this.transaction?.transactionInitiationDate) {
      const parsedDate = this.parseDate(this.transaction.transactionInitiationDate);
      this.formattedDate = this.formatDate(parsedDate);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  parseDate(dateString: string): Date {
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1; // Months are 0-indexed
    const year = parseInt(dateString.slice(4), 10);
    return new Date(year, month, day);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Adjust locale if needed
  }
}
