import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../interfaces';

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: './transaction-details-modal.component.html',
  styleUrls: ['./transaction-details-modal.component.css']
})
export class TransactionDetailsModalComponent implements OnInit {
  @Input() transaction!: Transaction | null; // Allow `null` to handle cases when no transaction is passed
  @Output() close = new EventEmitter<void>(); // Event emitter for closing the modal

  formattedDate: string = ''; // Holds the formatted transaction initiation date

  constructor() {}

  ngOnInit(): void {
    // Check if transaction data is available
    if (this.transaction?.transactionInitiationDate) {
      const parsedDate = this.parseDate(this.transaction.transactionInitiationDate);
      this.formattedDate = this.formatDate(parsedDate);
    }
  }

  onClose(): void {
    // Emit the close event to notify the parent component
    this.close.emit();
  }

  parseDate(dateString: string): Date {
    // Parse the date string in DDMMYYYY format to a Date object
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1;
    const year = parseInt(dateString.slice(4), 10);
    return new Date(year, month, day);
  }

  formatDate(date: Date): string {
    // Format the date as "Day Month Year"
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
}
