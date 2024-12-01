import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 


import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Transaction } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionsUrl = 'api/transactions';


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getTransactions() {
    return this.http.get<Transaction[]>(this.transactionsUrl)
    .pipe(
      tap(() => console.log(`Fetched Transactions`)),
      catchError(this.handleError<Transaction[]>('getHeroes', []))
    );
  }

  searchTransactions(debitAccount: string, beneficiaryIBAN: string, billerSubscriberIDNumber: string): Observable<Transaction[]> {
    if (!debitAccount.trim() && !beneficiaryIBAN.trim() && !billerSubscriberIDNumber.trim()) {
      return of([]);
    }
    let query = `${this.transactionsUrl}/?`;
    if (debitAccount.trim()) {
      query += `debitAccount=${debitAccount}&`;
    }
    if (beneficiaryIBAN.trim()) {
      query += `beneficiaryIBAN=${beneficiaryIBAN}`;
    }
    if (billerSubscriberIDNumber.trim()) { 
      query += `billerSubscriberIDNumber=${billerSubscriberIDNumber}`;
    }
    return this.http.get<Transaction[]>(query)
    .pipe(
      tap(() => console.log(`Found Transactions matching debitAccount "${debitAccount}" and beneficiaryIBAN "${beneficiaryIBAN}"`)),
      catchError(this.handleError<Transaction[]>('searchTransactions', []))
    );
  }

// Error handler
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed:`, error);
    return of(result as T);
  };
}

}
