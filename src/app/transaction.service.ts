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


  // Error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

}
