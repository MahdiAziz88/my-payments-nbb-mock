import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  searchTerm = ''; // Search term for transaction search
  filterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Current filter criteria
  showFilters = false; // Toggles the visibility of the filter component

  // Toggles filter visibility
  toggleFilterVisibility(): void {
    this.showFilters = !this.showFilters;
  }

  // Updates the search term
  onSearchTermChanged(term: string): void {
    this.searchTerm = term;
  }

  // Receives updated filter criteria from the filter component
  onFilterApplied(criteria: { fromDate: string; toDate: string; type: string }): void {
    this.filterCriteria = { ...criteria }; // Create a new object reference
  }

  // Resets the filter criteria when cleared
  onFilterCleared(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Reset the filters
  }
}
