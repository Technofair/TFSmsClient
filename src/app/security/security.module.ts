import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './security-routing.module';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { ModuleComponent } from './module/module.component'
import { MenuComponent } from './menu/menu.component';
import { MenuPermissionComponent } from './menu-permission/menu-permission.component';
import { UserwiseMenuComponent } from './userwise-menu/userwise-menu.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserComponent } from './user/user.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
//import { UserRoleMappingComponent } from './user-role-mapping/user-role-mapping.component';
import { UserRolesMappingComponent } from './user-roles-mapping/user-roles-mapping.component';
import { BackgroundServiceComponent } from './background-service/background-service.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    UserRolesComponent,
    UserComponent,
    ModuleComponent,
    MenuPermissionComponent,
    MenuComponent,
    UserwiseMenuComponent,
   // UserRoleMappingComponent,
    UserRolesMappingComponent,
    BackgroundServiceComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ProgressSpinnerModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule, InputTextareaModule, MultiSelectModule, CascadeSelectModule,
    InputNumberModule, InputMaskModule, DropdownModule, AutoCompleteModule, CalendarModule, ChipsModule, TableModule,
    UserManagementRoutingModule, ConfirmDialogModule,
    MessagesModule, DialogModule, CheckboxModule, PanelModule
  ]
})
export class UserManagementModule { }
