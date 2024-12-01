import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../interfaces';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

@Input() transaction!: Transaction; // Receives transaction from parent

  constructor() { }

  ngOnInit(): void {
  }

}
