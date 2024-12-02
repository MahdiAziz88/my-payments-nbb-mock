import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-transaction-search',
  templateUrl: './transaction-search.component.html',
  styleUrls: ['./transaction-search.component.css']
})
export class TransactionSearchComponent {
  searchTerm = ''; // Search term entered by the user

  @Output() searchTermChanged = new EventEmitter<string>(); // Emits the search term

  // Trigger search on action
  onSearch(): void {
    this.searchTermChanged.emit(this.searchTerm.trim());
  }
}
