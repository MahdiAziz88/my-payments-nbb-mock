import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  searchTerm = '';
  filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };
  showFilters: boolean = false; // Toggle state for the filter component

  // Toggle the visibility of the filter component
  toggleFilterVisibility(): void {
    this.showFilters = !this.showFilters;
  }

  // Updates the search term from the search bar
  onSearchTermChanged(term: string): void {
    this.searchTerm = term;
  }

  // Updates the filter criteria from the filter component
  onFilterApplied(criteria: { fromDate: string; toDate: string; type: string }): void {
    this.filterCriteria = criteria;
  }

  // Resets the filter criteria when clearing
  onFilterCleared(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' };
  }

  // Handles the filter toggle event from the child component
  onFilterToggled(showFilters: boolean): void {
    this.showFilters = showFilters; // Sync the visibility state
  }
}
