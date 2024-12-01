import { Component } from '@angular/core';

@Component({
  selector: 'app-my-payments',
  templateUrl: './my-payments.component.html',
  styleUrls: ['./my-payments.component.css']
})
export class MyPaymentsComponent {
  activeTab: 'history' | 'upcoming' = 'history'; // Default to 'Payment History'

  switchTab(tab: 'history' | 'upcoming'): void {
    this.activeTab = tab; // Switch the active tab
  }
}
