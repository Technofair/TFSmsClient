import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeConfigComponent } from './charge-config/charge-config.component';
import { DigitalHeadComponent } from './digital-head/digital-head.component';
import { DigitalMoneyComponent } from './digital-money/digital-money.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { CompanyPackageComponent } from './company-package/company-package.component';
import { ClientPackageComponent } from './client-package/client-package.component';
import { RechargeHistoryComponent } from './recharge-history/recharge-history.component';
import { BalanceRechargeComponent } from './balance-recharge/balance-recharge.component';
import { ChartOfAccountComponent } from './chart-of-accounts/chart-of-accounts.component';
import { RechargeApprovalComponent } from './recharge-approval/recharge-approval.component';
import { PaymentVoucherComponent } from './voucher-payment/vouchar-payment.component';
import { ReceivedVoucherComponent } from './voucher-received/voucher-received.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';

const routes: Routes = [
  { path: 'digitalhead', component: DigitalHeadComponent },
  { path: 'chargeconfig', component: ChargeConfigComponent },
  { path: 'digitalmoney', component: DigitalMoneyComponent },
  { path: 'transdetail', component: TransactionDetailComponent },
  { path: 'companypackage', component: CompanyPackageComponent },
  { path: 'clientpackage', component: ClientPackageComponent },
  { path: 'balance-recharge', component: BalanceRechargeComponent },
  { path: 'recharge-history', component: RechargeHistoryComponent },
  { path: 'chartofaccount', component: ChartOfAccountComponent },
  { path: 'recharge-approval', component: RechargeApprovalComponent },
  { path: 'voucher-payment', component: PaymentVoucherComponent },
  { path: 'voucher-received', component: ReceivedVoucherComponent },
  { path: 'opening-balance', component: OpeningBalanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsManagementRoutingModule { }
