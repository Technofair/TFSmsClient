import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';

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

import { CompanyComponent } from './company/company.component';
import { integratorCredentialComponent } from './integrator-credential/integrator-credential.component';
import { IntegratorPackageComponent } from './integrator-package/integrator-package.component';
import { IntegratorCompanyComponent } from './integrator-company/integrator-company.component';
import { IntegratorPermissionComponent } from './integrator-permission/integrator-permission.component';
import { IntegratorSettingsComponent } from './integrator-settings/integrator-settings.component';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { ClientPackageComponent } from './client-package/client-package.component';
import { QuickDashboardComponent } from './quick-dashboard/quick-dashboard.component';
import { NetidMappingComponent } from './company-integrator-netid-mapping/netid-mapping.component';

import { DirectiveModule } from '../directives/directive.module';
import { ClientPackageCommissionComponent } from './client-package-commission/client-package-commission.component';
import { PackagePeriodPermissionComponent } from './package-period-permission/package-period-permission.component';
import { ScpProductComponent } from './scp-product/scp-product.component';

@NgModule({
  declarations: [
    CompanyComponent,
    integratorCredentialComponent,
    IntegratorPackageComponent,
    IntegratorCompanyComponent,
    IntegratorPermissionComponent,
    IntegratorSettingsComponent,
    ClientPackageComponent,
    QuickDashboardComponent,
    NetidMappingComponent,
    ClientPackageCommissionComponent,
    PackagePeriodPermissionComponent,
    ScpProductComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SettingRoutingModule,FormsModule,ReactiveFormsModule,
    InputTextModule,InputTextareaModule,MultiSelectModule,CascadeSelectModule,
    InputNumberModule,InputMaskModule,DropdownModule,AutoCompleteModule,CalendarModule,ChipsModule,TableModule,ConfirmDialogModule,
    MessagesModule,DialogModule, PanelModule, CheckboxModule, DirectiveModule
  ],
  
})
export class SettingModule { }