import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPaymentsComponent } from './my-payments/my-payments.component';
import { UpcomingPaymentsComponent } from './upcoming-payments/upcoming-payments.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-payments/history', pathMatch: 'full' }, // Default to Payment History
  { path: 'my-payments/history', component: MyPaymentsComponent },
  { path: 'my-payments/upcoming', component: UpcomingPaymentsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
