import { NgModule } from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';


// import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
// import { ChipsModule } from "primeng/chips";
// import { DropdownModule } from "primeng/dropdown";
// import { InputMaskModule } from "primeng/inputmask";
// import { InputNumberModule } from "primeng/inputnumber";
// import { CascadeSelectModule } from "primeng/cascadeselect";
// import { MultiSelectModule } from "primeng/multiselect";
// import { InputTextareaModule } from "primeng/inputtextarea";
// import { TableModule } from 'primeng/table';
// import { ToastModule } from 'primeng/toast';
// import { FileUploadModule } from 'primeng/fileupload';
// import { FieldsetModule } from 'primeng/fieldset';
// import { HttpLoaderFactory } from '../app.module';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
// import { CheckboxModule } from 'primeng/checkbox';
// import { PanelModule } from 'primeng/panel';
// import { DividerModule } from 'primeng/divider';


@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SelectButtonModule,
        ButtonModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        RippleModule,
        RouterModule,
        AppConfigModule,
        TranslateModule,
        MenuModule,
        MenubarModule,
        ReactiveFormsModule,
        DropdownModule,
        SplitButtonModule,


        // AutoCompleteModule, 
        CalendarModule, 
        // ChipsModule, 
        // TableModule, 
        // ConfirmDialogModule,
        // MessagesModule, 
        DialogModule, 
        // CheckboxModule, 
        // FileUploadModule,
        // ToastModule, 
        // FieldsetModule, 
        // RadioButtonModule, 
        // PanelModule,
        // DividerModule
    ],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
