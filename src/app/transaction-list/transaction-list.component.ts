import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../interfaces';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  groupedTransactions: { date: string; transactions: Transaction[] }[] = [];
  filteredTransactions: Transaction[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  selectedTransaction: Transaction | null = null;

  @Input() searchTerm = ''; // Receives the search term from the parent

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  ngOnChanges(): void {
    this.filterTransactions(); // Apply the search term whenever it changes
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe((data: Transaction[]) => {
      if (data.length === 0) {
        this.transactions = [];
        this.filteredTransactions = [];
      } else {
        this.transactions = this.sortTransactionsByDate(data);
        this.filteredTransactions = [...this.transactions]; // Initialize filtered transactions
        this.paginateTransactions();
      }
    });
  }

  filterTransactions(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTransactions = [...this.transactions];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTransactions = this.transactions.filter(transaction => {
        const beneficiaryName = transaction.beneficiaryName?.toLowerCase() || '';
        const debitAccount = transaction.debitAccount?.toString() || '';
        const billerSubscriberIDNumber = transaction.billerSubscriberIDNumber?.toLowerCase() || '';
        
        return (
          beneficiaryName.includes(term) ||
          debitAccount.includes(term) ||
          billerSubscriberIDNumber.includes(term)
        );
      });
    }
    this.currentPage = 1; // Reset pagination
    this.paginateTransactions();
  }

  sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      const dateA = this.parseDate(a.transactionInitiationDate).getTime();
      const dateB = this.parseDate(b.transactionInitiationDate).getTime();
      return dateB - dateA;
    });
  }

  paginateTransactions(): void {
    const start = 0;
    const end = this.currentPage * this.itemsPerPage;

    const paginatedTransactions = this.filteredTransactions.slice(start, end);
    this.groupTransactionsByDate(paginatedTransactions);
  }

  groupTransactionsByDate(transactions: Transaction[]): void {
    const groups: { [key: string]: Transaction[] } = {};

    transactions.forEach(transaction => {
      const parsedDate = this.parseDate(transaction.transactionInitiationDate);
      const dateKey = this.formatDate(parsedDate);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    this.groupedTransactions = Object.keys(groups).map(date => ({
      date,
      transactions: groups[date]
    }));
  }

  parseDate(dateString: string): Date {
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1;
    const year = parseInt(dateString.slice(4), 10);
    return new Date(year, month, day);
  }

  formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
    }
  }

  loadMore(): void {
    this.currentPage++;
    this.paginateTransactions();
  }

  hasMoreTransactions(): boolean {
    return this.currentPage * this.itemsPerPage < this.filteredTransactions.length;
  }

  openTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

  closeTransactionDetails(): void {
    this.selectedTransaction = null;
  }
}
