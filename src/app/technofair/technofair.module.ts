import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';

import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { DirectiveModule } from '../directives/directive.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ClientInfoComponent } from './client-info/client-info.component';
import { ReportViewerModule } from '../reportviewer/reportviewer.module';
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { SubscriberManagementRoutingModule } from '../subscriptions/subscription-routing.module';
import { ClientServicePermissionComponent } from './client-service-permission/client-service-permission.component';
import { TechnofairRoutingModule } from './technofair-routing.module';
import { ClientPackageComponent } from './client-package/client-package.component';
import { CompanyCollectionComponent } from './company-collection/company-collection.component';
import { CompanyPackageComponent } from './company-package/company-package.component';
import { ClientPaymentComponent } from './client-payment/client-payment.component';
import { CompanyPackageTypeComponent } from './company-package-type/company-package-type.componet';
import { CustomerServerInfoComponent } from './customer-server-info/customer-server-info.component';
import { ClientServerInfoComponent } from './client-server-info/client-server-info.component';
import { ClientBillGenerationComponent } from './client-bill-generation/client-bill-generation.component';
import { BillGenPermssionComponent } from './bill-gen-permssion/bill-gen-permssion.component';

@NgModule({
  declarations: [
    ClientInfoComponent,
    ClientServicePermissionComponent,
    ClientPackageComponent,
    CompanyCollectionComponent,
    CompanyPackageComponent,
    ClientPaymentComponent,
    CompanyPackageTypeComponent,
    CustomerServerInfoComponent,
    ClientServerInfoComponent,
    ClientBillGenerationComponent,
    BillGenPermssionComponent
  ],
  exports: [
  ],
  imports: [
    ReportViewerModule,
    CommonModule,
    TranslateModule,
    HttpClientModule,
    ProgressSpinnerModule,
    TechnofairRoutingModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule, InputTextareaModule, MultiSelectModule, CascadeSelectModule,
    InputNumberModule, InputMaskModule, DropdownModule, AutoCompleteModule, CalendarModule, ChipsModule, TableModule, ConfirmDialogModule,
    MessagesModule, DialogModule, RadioButtonModule,
    SubscriberManagementRoutingModule, TabViewModule, PanelModule, DirectiveModule,SelectButtonModule,AccordionModule
  ],
  
})
export class TechnofairModule { }