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

@NgModule({
  declarations: [
    ClientInfoComponent
  
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ProgressSpinnerModule,
    FormsModule,ReactiveFormsModule,
    InputTextModule,InputTextareaModule,MultiSelectModule,CascadeSelectModule,
    InputNumberModule,InputMaskModule,DropdownModule,AutoCompleteModule,CalendarModule,ChipsModule,TableModule,ConfirmDialogModule,
    MessagesModule,DialogModule, PanelModule, CheckboxModule, DirectiveModule
  ],
  
})
export class TechnofairModule { }