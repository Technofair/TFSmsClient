import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//import { NotfoundComponent } from 'src/demo/components/notfound/notfound.component';
import { LoginComponent } from './auth/login/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './services/auth.guard';
import { WebHomeComponent } from './website/home/home.component';
import { WebContactComponent } from './website/contact/contact.component';
import { WebAboutComponent } from './website/about/about.component';
import { WebTramsConditionComponent } from './website/trams-condition/trams-condition.component';
import { WebPackageComponent } from './website/package/package.component';
import { WebReturnRefundComponent } from './website/return-refund/return-refund.component';
import { WebProductsComponent } from './website/products/products.component';
import { PaymentComponent } from './website/payment/payment.component';

const routes: Routes = [
  { path: 'contact', component: WebContactComponent },
  { path: 'about', component: WebAboutComponent },
  { path: 'trams-condition', component: WebTramsConditionComponent },
  { path: 'package', component: WebPackageComponent },
  { path: 'return-refund', component: WebReturnRefundComponent },
  { path: 'products', component: WebProductsComponent },
  { path: 'sslpayments', component: PaymentComponent },
  
  {
    path: '', component: WebHomeComponent,
     children: [
     // { path: '', loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule) },
    ] 
  },
  {
    path: 'login', component: LoginComponent,
   /* children: [
      { path: '', component: LoginComponent }
    ] */
  },
  {
    path: 'home', component: AppLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
      { path: 'inventory', loadChildren: () => import('./inventory/inventory-management.module').then(m => m.InventoryManagementModule) },
      { path: 'security', loadChildren: () => import('./security/security.module').then(m => m.UserManagementModule) },
      { path: 'subscription', loadChildren: () => import('./subscriptions/subscription.module').then(m => m.SubscriberManagementModule) },
      { path: 'account', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsManagementModule) },
      { path: 'hrm', loadChildren: () => import('./hrm/hrm.module').then(m => m.HrmModule) },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'report', loadChildren: () => import('./report/report.module').then(m => m.ReportModule) },
      { path: 'pgw', loadChildren: () => import('./payment-gateway/payment-gateway.module').then(m => m.PaymentGatewayModule) },
    ]
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  // { path: 'landing', loadChildren: () => import('../demo/components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
