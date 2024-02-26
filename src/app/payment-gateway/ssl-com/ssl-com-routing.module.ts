import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PgwPaymentComponent } from './pgw-payment/pgw-payment.component';
import { PgwCancelComponent } from './pgw-cancel/pgw-cancel.component';
import { PgwFailComponent } from './pgwfail/pgwfail.component';
import { PgwIpnComponent } from './pgwipn/pgwipn.component';
import { PgwSuccessComponent } from './pgwsuccess/pgwsuccess.component';

const routes: Routes = [
  { path: 'payment', component: PgwPaymentComponent },
  { path: 'cancel', component: PgwCancelComponent },
  { path: 'fail', component: PgwFailComponent },
  { path: 'ipn', component: PgwIpnComponent },
  { path: 'success', component: PgwSuccessComponent },
  { path:''}
//   { path: 'login1', component: LoginComponent1 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SslComRoutingModule { }
