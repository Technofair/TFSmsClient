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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SslComRoutingModule } from './ssl-com-routing.module';
import { PgwPaymentComponent } from './pgw-payment/pgw-payment.component';
import { PgwCancelComponent } from './pgw-cancel/pgw-cancel.component';
import { PgwFailComponent } from './pgwfail/pgwfail.component';
import { PgwIpnComponent } from './pgwipn/pgwipn.component';
import { PgwSuccessComponent } from './pgwsuccess/pgwsuccess.component';


@NgModule({
  declarations: [
    PgwPaymentComponent,
    PgwCancelComponent,
    PgwFailComponent,
    PgwIpnComponent,
    PgwSuccessComponent
  ],
  imports: [
    CommonModule,

    CheckboxModule,
    InputTextModule,
    FormsModule,
    
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule,
    SslComRoutingModule,
    TranslateModule,
    CheckboxModule,
    InputNumberModule,
    DropdownModule,
    AutoCompleteModule,
    CalendarModule,ChipsModule,TableModule,ConfirmDialogModule,
    MessagesModule,DialogModule, PanelModule,
  ]
})
export class SslComModule { }
