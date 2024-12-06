import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  searchTerm = '';
  filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };

  // Updates the search term from the search bar
  onSearchTermChanged(term: string): void {
    this.searchTerm = term;
  }

  // Updates the filter criteria from the filter component
  onFilterApplied(criteria: { fromDate: string; toDate: string; type: string }): void {
    this.filterCriteria = criteria; // Pass the filter to the transaction list
  }

  // Resets the filter criteria when clearing
  onFilterCleared(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' };
  }
}
