import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsManagementRoutingModule } from './account-routing.module';
import { DigitalHeadComponent } from './digital-head/digital-head.component';
import { ChargeConfigComponent } from './charge-config/charge-config.component';
import { DigitalMoneyComponent } from './digital-money/digital-money.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { CompanyPackageComponent } from './company-package/company-package.component';
import { ClientPackageComponent } from './client-package/client-package.component';
import { PanelModule } from 'primeng/panel';
import { BalanceRechargeComponent } from './balance-recharge/balance-recharge.component';
import { RechargeHistoryComponent } from './recharge-history/recharge-history.component';
import { ChartOfAccountComponent } from './chart-of-accounts/chart-of-accounts.component';
import { RechargeApprovalComponent } from './recharge-approval/recharge-approval.component';
import { PaymentVoucherComponent } from './voucher-payment/vouchar-payment.component';
import { ReceivedVoucherComponent } from './voucher-received/voucher-received.component';
import { OpeningBalanceComponent } from './opening-balance/opening-balance.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReportViewerModule } from '../reportviewer/reportviewer.module';

@NgModule({
  declarations: [
    DigitalHeadComponent,
    ChargeConfigComponent,
    DigitalMoneyComponent,
    TransactionDetailComponent,
    CompanyPackageComponent,
    ClientPackageComponent,
    BalanceRechargeComponent,
    RechargeHistoryComponent,
    ChartOfAccountComponent,
    RechargeApprovalComponent,
    PaymentVoucherComponent,
    ReceivedVoucherComponent,
    OpeningBalanceComponent,
  ],
  imports: [
    ReportViewerModule,
    
    CommonModule, TranslateModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule, InputTextareaModule, MultiSelectModule, CascadeSelectModule,
    InputNumberModule, InputMaskModule, DropdownModule, AutoCompleteModule, CalendarModule, ChipsModule, TableModule, ConfirmDialogModule,
    MessagesModule, DialogModule,
    AccountsManagementRoutingModule, PanelModule,ProgressSpinnerModule
  ]
})
export class AccountsManagementModule { }
