import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  searchTerm = ''; // Stores the search term for the list

  // Update search term when the user triggers a search
  onSearchTermChanged(term: string): void {
    this.searchTerm = term;
  }
}
