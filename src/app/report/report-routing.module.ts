import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriberReportComponent } from './subscriber-report/subscriber-report.component';
import { UnassignedDeviceComponent } from './unassigned-device/unassigned-device.component';
import { SubscriberInvoceComponent } from './subscriber-invoice/subscriber-invoce.component';
import { CurrentStockComponent } from './current-stock/current-stock.component';
import { CurrentStockSummaryComponent } from './current-stock-summary/current-stock-summary.component';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SubscriberTransferReportComponent } from './subscriber-transfer-report/subscriber-transfer-report.component';

const routes: Routes = [
  { path: "subscriber-report", component: SubscriberReportComponent },
  { path: "unassigned-device", component: UnassignedDeviceComponent },
  { path: "subscriber-invoice", component: SubscriberInvoceComponent },
  { path: "current-stock", component: CurrentStockComponent },
  { path: "stock-summary", component: CurrentStockSummaryComponent },
  { path: "client-list", component: ClientListComponent },
  { path: "collection-list", component: CollectionListComponent },
  { path: "challan-statement", component: ChallanStatementComponent },
  { path: "income-statement", component: IncomeStatementComponent },
  { path: "party-lager", component: PartyLagerComponent },
  { path: "challan-wise-collection", component: ChallanWiseCollectionComponent },
  { path: "lso-wise-product-list", component: LsoWiseProductListComponent },
  { path: "purchase-ledger", component: PurchaseLedgerComponent },
  { path: "client-ledger", component: ClientLedgerComponent },
  { path: "assign-device-list", component: AssignDeviceComponent },
  { path: "product-receive", component: ProductReceiveComponent },
  { path: "subscriber-transfer-report", component: SubscriberTransferReportComponent }
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,ProgressSpinnerModule]
})
export class ReportRoutingModule { }
