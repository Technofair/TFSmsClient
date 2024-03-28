import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from "primeng/tabview";
import { PanelModule } from 'primeng/panel';
import { SubscriberReportComponent } from './subscriber-report/subscriber-report.component';
import { UnassignedDeviceComponent } from './unassigned-device/unassigned-device.component';
import { SubscriberInvoceComponent } from './subscriber-invoice/subscriber-invoce.component';
import { CurrentStockComponent } from './current-stock/current-stock.component';
import { CurrentStockSummaryComponent } from './current-stock-summary/current-stock-summary.component';
import { ReportViewerModule } from '../reportviewer/reportviewer.module';
import { ClientListComponent } from './client-list/client-list.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { ChallanStatementComponent } from './challan-statement/challan-statement.component';
import { IncomeStatementComponent } from './income-statement/income-statement.component';
import { PartyLagerComponent } from './party-lager/party-lager.component';
import { ChallanWiseCollectionComponent } from './challan-wise-collection/challan-wise-collection.component';
import { LsoWiseProductListComponent } from './lso-wise-product-list/lso-wise-product-list.component';
import { PurchaseLedgerComponent } from './purchase-ledger/purchase-ledger.component';
import { ClientLedgerComponent } from './client-ledger/client-ledger.component';
import { AssignDeviceComponent } from './assign-device/assign-device.component';
import { ProductReceiveComponent } from './product-receive/product-receive.component';
import { SubscriberTransferReportComponent } from './subscriber-transfer-report/subscriber-transfer-report.component';

@NgModule({
  declarations: [
    SubscriberReportComponent,
    UnassignedDeviceComponent,
    SubscriberInvoceComponent,
    CurrentStockComponent,
    CurrentStockSummaryComponent,
    ClientListComponent,
    CollectionListComponent,
    ChallanStatementComponent,
    IncomeStatementComponent,
    PartyLagerComponent,
    ChallanWiseCollectionComponent,
    LsoWiseProductListComponent,
    PurchaseLedgerComponent,
    ClientLedgerComponent,
    AssignDeviceComponent,
    ProductReceiveComponent,
    SubscriberTransferReportComponent
  ],
  imports: [
    ReportViewerModule,
    
    CommonModule,
    ReportRoutingModule,
    TranslateModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule, InputTextareaModule, MultiSelectModule, CascadeSelectModule,
    InputNumberModule, InputMaskModule, DropdownModule, AutoCompleteModule, CalendarModule, ChipsModule, TableModule, ConfirmDialogModule,
    MessagesModule, DialogModule, RadioButtonModule,
    TabViewModule, PanelModule
  ]
})
export class ReportModule { }
