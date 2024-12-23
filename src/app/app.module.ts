import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyPaymentsComponent } from './my-payments/my-payments.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionDetailsModalComponent } from './transaction-details-modal/transaction-details-modal.component';
import { TransactionSearchComponent } from './transaction-search/transaction-search.component';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    MyPaymentsComponent,
    TransactionComponent,
    TransactionListComponent,
    TransactionDetailsModalComponent,
    TransactionSearchComponent,
    TransactionFilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


