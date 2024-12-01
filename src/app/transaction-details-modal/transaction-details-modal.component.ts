import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../interfaces';

@Component({
  selector: 'app-transaction-details-modal',
  templateUrl: './transaction-details-modal.component.html',
  styleUrls: ['./transaction-details-modal.component.css']
})
export class TransactionDetailsModalComponent implements OnInit {
  @Input() transaction!: Transaction;
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    this.close.emit();
  }
}
