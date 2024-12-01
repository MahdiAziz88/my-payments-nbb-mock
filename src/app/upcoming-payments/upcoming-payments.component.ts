import { Component, OnInit } from '@angular/core';
import { Transaction } from '../interfaces';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-upcoming-payments',
  templateUrl: './upcoming-payments.component.html',
  styleUrls: ['./upcoming-payments.component.css']
})
export class UpcomingPaymentsComponent implements OnInit {
  transactions: Transaction[] = [];
  upcomingTransactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe((data: Transaction[]) => {
      this.transactions = data;
      this.filterUpcomingTransactions();
    });
  }

  filterUpcomingTransactions(): void {
    const currentDate = new Date();
    this.upcomingTransactions = this.transactions.filter(transaction => {
      const transactionDate = this.parseDate(transaction.transactionInitiationDate);
      return transactionDate > currentDate; // Keep only transactions after today
    });
  }

  parseDate(dateString: string): Date {
    // Assumes date string is in DDMMYYYY format
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1; // Month is 0-indexed
    const year = parseInt(dateString.slice(4), 10);
    return new Date(year, month, day);
  }
}
