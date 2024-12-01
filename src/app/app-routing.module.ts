import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpcomingPaymentsComponent } from './upcoming-payments/upcoming-payments.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-payments/history', pathMatch: 'full' }, // Default to Payment History
  { path: 'my-payments/history', component: PaymentHistoryComponent },
  { path: 'my-payments/upcoming', component: UpcomingPaymentsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
