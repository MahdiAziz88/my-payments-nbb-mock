import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyPaymentsComponent } from './my-payments/my-payments.component';

const routes: Routes = [
  { path: '', redirectTo: 'my-payments/history', pathMatch: 'full' }, // Default to Payment History
  { path: 'my-payments/history', component: MyPaymentsComponent },
];

// If ur checking this pls ignore because initially it was to route between payment history and upcoming payments :)

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
