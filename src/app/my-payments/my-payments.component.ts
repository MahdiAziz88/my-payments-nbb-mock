import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  searchTerm = '';
  filterCriteria: { fromDate: string; toDate: string; type: string } = { fromDate: '', toDate: '', type: 'All' };

  onSearchTermChanged(term: string): void {
    this.searchTerm = term;
  }

  onFilterApplied(criteria: { fromDate: string; toDate: string; type: string }): void {
    this.filterCriteria = criteria;
  }

  onFilterCleared(): void {
    this.filterCriteria = { fromDate: '', toDate: '', type: 'All' };
  }
}
