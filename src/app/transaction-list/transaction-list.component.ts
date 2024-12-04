import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Transaction } from '../interfaces';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnChanges {
  transactions: Transaction[] = []; // Stores all transactions
  groupedTransactions: { date: string; transactions: Transaction[] }[] = []; // Transactions grouped by date
  searchedTransactions: Transaction[] = []; // Transactions after applying filters
  currentPage = 1; // Current page for pagination
  itemsPerPage = 5; // Number of items per page

  selectedTransaction: Transaction | null = null; // Currently selected transaction for details
  errorMessage: { title: string; subtitle: string } | null = null; // Error message for validation issues

  isInitialized = false; // Track initialization status because ngonchange gets called on nginit for some reason
  
  @Input() searchTerm = ''; // Search term input from parent component
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' }; // Filter criteria from parent component

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    // Fetch transactions when the component initializes
    this.getTransactions();
    this.isInitialized = true; // Mark component as initialized to avoid ngchanges from fetching transactions again
  }

  ngOnChanges(): void {
    if (this.isInitialized) {
      // Only execute the filter logic if the component is initialized
      this.filterTransactions();
    }
  }

  getTransactions(): void {
    // Fetch transactions from the service
    this.transactionService.getTransactions().subscribe((data: Transaction[]) => {
      if (data.length === 0) {
        // If no transactions are returned, reset lists
        this.transactions = [];
        this.searchedTransactions = [];
      } else {
        // Sort transactions by date and apply filters
        this.transactions = this.sortTransactionsByDate(data);
        this.filterTransactions();
      }
    });
  }

  filterTransactions(): void {
    this.errorMessage = null; // Reset error messages

    // Fetch transactions from service dynamically
    this.transactionService.getTransactions().subscribe((data: Transaction[]) => {
      let filtered = [...data]; // Use fetched data for filtering

      if (this.filterCriteria.fromDate && this.filterCriteria.toDate) {
        const fromDate = new Date(this.filterCriteria.fromDate);
        const toDate = new Date(this.filterCriteria.toDate);

        if (fromDate > toDate) {
          this.errorMessage = {
            title: 'Invalid Date Range',
            subtitle: '"From" date cannot be after "To" date.'
          };
          this.searchedTransactions = [];
          this.groupedTransactions = [];
          return;
        }

        if (fromDate.toDateString() === toDate.toDateString()) {
          filtered = filtered.filter(transaction => {
              const transactionDate = this.parseDate(transaction.transactionInitiationDate);
              return transactionDate.toDateString() === fromDate.toDateString();
          });
      } else {
          // Include transactions between `fromDate` and `toDate`
          filtered = filtered.filter(transaction => {
              const transactionDate = this.parseDate(transaction.transactionInitiationDate);
              return transactionDate >= fromDate && transactionDate <= toDate;
          });
      }
  }

      if (this.filterCriteria.type !== 'All') {
        filtered = filtered.filter(transaction => transaction.transactionType === this.filterCriteria.type);
      }

      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(transaction => {
          const beneficiaryIBAN = transaction.beneficiaryIBAN?.toLowerCase() || '';
          const debitAccount = transaction.debitAccount?.toString() || '';
          const billerSubscriberIDNumber = transaction.billerSubscriberIDNumber?.toLowerCase() || '';

          return (
            beneficiaryIBAN.includes(term) ||
            debitAccount.includes(term) ||
            billerSubscriberIDNumber.includes(term)
          );
        });

        if (filtered.length === 0) {
          this.errorMessage = {
            title: 'No Transactions Found',
            subtitle: 'No Results Please try again with different keyword.'
          };
        }
      }

      if (filtered.length === 0 && !this.errorMessage) {
        this.errorMessage = {
          title: 'You do not have any transaction within the selected date range or the transaction type',
          subtitle: ''
        };
      }

      this.searchedTransactions = filtered;
      this.sortTransactionsByDate(this.searchedTransactions); // Sort filtered transactions by date since we are getting transactions from the server again
      this.currentPage = 1; // Reset pagination
      this.paginateTransactions();
    });
  }


  sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      const dateA = this.parseDate(a.transactionInitiationDate).getTime();
      const dateB = this.parseDate(b.transactionInitiationDate).getTime();
      // Sort in descending order (latest first)
      return dateB - dateA; // Subtract dateA from dateB to sort descending
    });
  }
  

  paginateTransactions(): void {
    // Paginate transactions based on current page
    const start = 0;
    const end = this.currentPage * this.itemsPerPage;
    const paginatedTransactions = this.searchedTransactions.slice(start, end);
    this.groupTransactionsByDate(paginatedTransactions); // Group paginated transactions by date
  }

  groupTransactionsByDate(transactions: Transaction[]): void {
    const groups: { [key: string]: Transaction[] } = {}; // Group transactions by date

    transactions.forEach(transaction => {
      const parsedDate = this.parseDate(transaction.transactionInitiationDate);
      const dateKey = this.formatDate(parsedDate); // Format date for grouping
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction); // Add transaction to appropriate group
    });

    // Convert groups to an array of objects
    this.groupedTransactions = Object.keys(groups).map(date => ({
      date,
      transactions: groups[date]
    }));
  }

  parseDate(dateString: string): Date {
    // Parse date string in DDMMYYYY format into a Date object
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1;
    const year = parseInt(dateString.slice(4), 10);
    return new Date(year, month, day);
  }

  formatDate(date: Date): string {
    // Format date for display
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date(); // For upcoming payments
    tomorrow.setDate(today.getDate() + 1);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${date.getFullYear()}`;
    }
  }

  loadMore(): void {
    // Load more transactions by incrementing the current page
    this.currentPage++;
    this.paginateTransactions();
  }

  hasMoreTransactions(): boolean {
    // Check if more transactions are available for pagination
    return this.currentPage * this.itemsPerPage < this.searchedTransactions.length;
  }

  openTransactionDetails(transaction: Transaction): void {
    // Open transaction details modal
    this.selectedTransaction = transaction;
  }

  closeTransactionDetails(): void {
    // Close transaction details modal
    this.selectedTransaction = null;
  }
}
