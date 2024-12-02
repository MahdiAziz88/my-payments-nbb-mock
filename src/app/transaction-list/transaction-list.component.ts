import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Transaction } from '../interfaces';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnChanges {
  transactions: Transaction[] = [];
  groupedTransactions: { date: string; transactions: Transaction[] }[] = [];
  searchedTransactions: Transaction[] = [];
  currentPage = 1;
  itemsPerPage = 5;

  selectedTransaction: Transaction | null = null;
  errorMessage: string | null = null; // To display validation error messages

  @Input() searchTerm = '';
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getTransactions();
  }

  ngOnChanges(): void {
    this.filterTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe((data: Transaction[]) => {
      if (data.length === 0) {
        this.transactions = [];
        this.searchedTransactions = [];
      } else {
        this.transactions = this.sortTransactionsByDate(data);
        this.filterTransactions(); // Apply filters after fetching transactions
      }
    });
  }

  filterTransactions(): void {
    this.errorMessage = null; // Reset error messages

    if (this.filterCriteria.fromDate && this.filterCriteria.toDate) {
      const fromDate = new Date(this.filterCriteria.fromDate);
      const toDate = new Date(this.filterCriteria.toDate);

      // Validation: Check if the date range exceeds one month
      const maxRangeDate = new Date(fromDate);
      maxRangeDate.setMonth(maxRangeDate.getMonth() + 1);

      if (toDate > maxRangeDate) {
        this.errorMessage = 'Date range cannot exceed one month.';
        this.searchedTransactions = [];
        this.groupedTransactions = [];
        return;
      }
    }

    let filtered = [...this.transactions];

    // Apply search term filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => {
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

    // Apply date range filter
    if (this.filterCriteria.fromDate && this.filterCriteria.toDate) {
      const fromDate = new Date(this.filterCriteria.fromDate);
      const toDate = new Date(this.filterCriteria.toDate);
      filtered = filtered.filter(transaction => {
        const transactionDate = this.parseDate(transaction.transactionInitiationDate);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    // Apply transaction type filter
    if (this.filterCriteria.type !== 'All') {
      const typeMapping: { [key: string]: string } = {
        Fawri: 'FA',
        FawriPlus: 'FP',
        Fawateer: 'FT'
      };
      const selectedType = typeMapping[this.filterCriteria.type];
      filtered = filtered.filter(transaction => transaction.transactionType === selectedType);
    }

    this.searchedTransactions = filtered;
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

    const paginatedTransactions = this.searchedTransactions.slice(start, end);
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
    return this.currentPage * this.itemsPerPage < this.searchedTransactions.length;
  }

  openTransactionDetails(transaction: Transaction): void {
    this.selectedTransaction = transaction;
  }

  closeTransactionDetails(): void {
    this.selectedTransaction = null;
  }
}
