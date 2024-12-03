import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../interfaces';

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: './transaction-details-modal.component.html',
  styleUrls: ['./transaction-details-modal.component.css']
})
export class TransactionDetailsModalComponent implements OnInit {
  @Input() transaction!: Transaction; // Transaction details passed from the parent component
  @Output() close = new EventEmitter<void>(); // Event emitter to notify the parent when the modal is closed

  formattedDate: string = ''; // Holds the formatted transaction initiation date

  constructor() { }

  ngOnInit(): void {
    // When the component initializes, format the transaction initiation date
    if (this.transaction?.transactionInitiationDate) {
      const parsedDate = this.parseDate(this.transaction.transactionInitiationDate); // Parse the date string into a Date object
      this.formattedDate = this.formatDate(parsedDate); // Format the parsed date for display
    }
  }

  onClose(): void {
    // Emit the close event to notify the parent component
    this.close.emit();
  }

  parseDate(dateString: string): Date {
    // Convert a date string in DDMMYYYY format to a JavaScript Date object
    const day = parseInt(dateString.slice(0, 2), 10); // Extract the day from the string
    const month = parseInt(dateString.slice(2, 4), 10) - 1; // Extract the month and convert to 0-indexed
    const year = parseInt(dateString.slice(4), 10); // Extract the year
    return new Date(year, month, day); // Return the constructed Date object
  }

  formatDate(date: Date): string {
    // Format the date object into a human-readable string in the format "Day Month Year"
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Format the date using the specified locale and options
  }
}
