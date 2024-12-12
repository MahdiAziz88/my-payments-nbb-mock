import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  searchTerm = ''; // Search term for transaction search
  filterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Current filter criteria
  tempFilterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Temporary filter criteria
  showFilters = false; // Toggles the visibility of the filter component

  // Toggles filter visibility
  toggleFilterVisibility(): void {
    this.showFilters = !this.showFilters;
    // Do not reset tempFilterCriteria when toggling, retain its current state
  }

  // Updates the search term
  onSearchTermChanged(term: string): void {
    this.searchTerm = term;
  }

  // Receives updated filter criteria from the filter component
  onFilterApplied(criteria: { fromDate: string; toDate: string; type: string }): void {
    this.filterCriteria = { ...criteria }; // Save the applied criteria
    this.tempFilterCriteria = { ...criteria }; // Synchronize temp criteria
  }

  // Resets the filter criteria when cleared
  onFilterCleared(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' }; // Reset the filters
    this.tempFilterCriteria = { ...this.filterCriteria }; // Sync temp object with cleared state
  }
}
