import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Transaction } from '../interfaces';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit, OnChanges {
  transactions: Transaction[] = []; // Stores all transactions
  groupedTransactions: { date: string; transactions: Transaction[] }[] = []; // Transactions grouped by date
  searchedTransactions: Transaction[] = []; // Transactions after applying search
  currentPage = 1; // Current page for pagination
  itemsPerPage = 5; // Number of items per page

  selectedTransaction: Transaction | null = null; // Currently selected transaction for details
  errorMessage: { title: string; subtitle?: string } | null = null; // Error message for validation issues

  isInitialized = false; // Track initialization status because ngonchange gets called on nginit for some reason

  @Input() searchTerm = ''; // Search term input from parent component
  @Input() filterCriteria: { fromDate: string; toDate: string; type: string } =
    { fromDate: '', toDate: '', type: 'All' }; // Filter criteria from parent component

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Fetch transactions when the component initializes
    this.getTransactions();
    this.isInitialized = true; // Mark component as initialized to avoid ngchanges from fetching transactions again
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInitialized) {
      // Trigger filtering when searchTerm or filterCriteria changes
      if (changes.filterCriteria) {
        console.log('Filter Criteria Changed');
        this.filterTransactions(); // Reapply all filters
      }
      if (changes.searchTerm) {
        this.searchTransactions(); // Perform a search
      }
    }
  }

  getTransactions(): void {
    // Fetch transactions from the service
    this.transactionService
      .getTransactions()
      .subscribe((data: Transaction[]) => {
        if (data.length === 0) {
          // No transactions available, set error message
          this.errorMessage = {
            title: 'No transactions available',
            subtitle: 'There are no transactions to display.',
          };

          // Reset lists
          this.transactions = [];
          this.searchedTransactions = [];
          this.groupedTransactions = [];
        } else {
          // Transactions are available, reset error message
          this.errorMessage = null;

          this.transactions = data; // Set transactions to fetched data

          // Set transactions unfiltered
          this.searchTransactions();
        }
      });
  }

  filterTransactions(): void {
    // Reset any existing error messages
    this.errorMessage = null;

    // Fetch transactions dynamically from the service
    this.transactionService
      .getTransactions()
      .subscribe((data: Transaction[]) => {
        let filtered = [...data]; // Make a copy of the fetched transactions for filtering

        // Filter by date range if both "From" and "To" dates are provided
        if (this.filterCriteria.fromDate && this.filterCriteria.toDate) {
          const fromDate = new Date(this.filterCriteria.fromDate);
          const toDate = new Date(this.filterCriteria.toDate);

          // Normalize time to include the full day range
          fromDate.setHours(0, 0, 0, 0); // Start of the "fromDate"
          toDate.setHours(23, 59, 59, 999); // End of the "toDate"

          // Validate that "From" date is not after "To" date
          if (fromDate > toDate) {
            this.errorMessage = {
              title: 'Invalid Date Range',
              subtitle: '"From" date cannot be after "To" date.',
            };
            this.transactions = [];
            this.groupedTransactions = [];
            return; // Exit if the date range is invalid
          }

          // Validate that the date range does not exceed 1 month
          const oneMonthLater = new Date(fromDate);
          oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
          if (oneMonthLater < toDate) {
            this.errorMessage = {
              title: 'Invalid Date Range',
              subtitle: 'Date range should not exceed 1 month.',
            };
            this.transactions = [];
            this.groupedTransactions = [];
            return; // Exit if the date range is invalid
          }

          // Include transactions between "From" and "To" dates (inclusive)
          filtered = filtered.filter((transaction) => {
            const transactionDate = this.parseDate(
              transaction.transactionInitiationDate
            );
            return transactionDate >= fromDate && transactionDate <= toDate;
          });
        }

        // Filter by transaction type if it's not "All"
        if (this.filterCriteria.type !== 'All') {
          filtered = filtered.filter(
            (transaction) =>
              transaction.transactionType === this.filterCriteria.type
          );
        }

        // If no transactions match the filters, set an error message (if none exists)
        if (filtered.length === 0 && !this.errorMessage) {
          this.errorMessage = {
            title:
              'You do not have any transaction within the selected date range or the transaction type'
          };
          this.transactions = [];
            this.groupedTransactions = [];
            return; // Exit if no transactions match the filters
        }

        // Update the filtered transactions
        this.transactions = filtered;

        // this.searchTransactions(); // Perform a search if a search term is provided        // Sort the transactions by date (ensure the order is chronological or reverse)
        this.searchTransactions();
      });
  }

  searchTransactions(): void {
    this.errorMessage = null; // Reset any existing error messages
  
    // If the search term is empty, restore the filtered transactions
    if (!this.searchTerm.trim()) {
      this.searchedTransactions = [...this.transactions];
    }
    // Perform a search if a search term is provided
    else {
      const term = this.searchTerm.toLowerCase();

      // Filter by IBAN, debit account, or biller subscriber ID (case-insensitive)
      this.searchedTransactions = this.transactions.filter(
        (transaction) => {
          const beneficiaryIBAN =
            transaction.beneficiaryIBAN?.toLowerCase() || '';
          const debitAccount = transaction.debitAccount?.toString() || '';
          const billerSubscriberIDNumber =
            transaction.billerSubscriberIDNumber?.toLowerCase() || '';

          return (
            beneficiaryIBAN.includes(term) ||
            debitAccount.includes(term) ||
            billerSubscriberIDNumber.includes(term)
          );
        }
      );

      // If no transactions match the search term, show an error message
      if (this.searchedTransactions.length === 0) {
        this.errorMessage = {
          title: 'No Transactions Found',
          subtitle: 'No Results Please try again with different keyword.',
        };
      }
    }
    // Sort the transactions by date (ensure the order is chronological or reverse)
    this.sortTransactionsByDate(this.searchedTransactions);

    // Reset pagination to the first page
    this.currentPage = 1;

    // Paginate the filtered transactions for display
    this.paginateTransactions();
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

    transactions.forEach((transaction) => {
      const parsedDate = this.parseDate(transaction.transactionInitiationDate);
      const dateKey = this.formatDate(parsedDate); // Format date for grouping
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction); // Add transaction to appropriate group
    });

    // Convert groups to an array of objects
    this.groupedTransactions = Object.keys(groups).map((date) => ({
      date,
      transactions: groups[date],
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
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
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
    return (
      this.currentPage * this.itemsPerPage < this.searchedTransactions.length
    );
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
