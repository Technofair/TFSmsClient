import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'ssl-com', loadChildren: () => import('./ssl-com/ssl-com.module').then(m => m.SslComModule) },
//   { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
//   { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
//   { path: '**', redirectTo: '/notfound' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentGatewayRoutingModule { }