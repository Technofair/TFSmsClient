import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryManagementRoutingModule } from './inventory-management-routing.module';
import { ItemComponent } from './item/item.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { ItemModelComponent } from './item-model/item-model.component';
import { ItemBrandComponent } from './item-brand/item-brand.component';

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
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { FieldsetModule } from 'primeng/fieldset';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { StoreComponent } from './store/store.component';
import { StoreOpeningComponent } from './store-opening/store-opening.component';
import { ChallanComponent } from './challan/challan.component';
import { ChallanReturnComponent } from './challan-return/challan-return.component';
import { CollectionComponent } from './collection/collection.component';
import { CompanyCollectionComponent } from './company-collection/company-collection.component';
import { DamageComponent } from './damage/damage.component';
import { DamageTypeComponent } from './damage-type/damage-type.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseOrderuploadComponent } from './purchase-orderupload/purchase-orderupload.component';
import { SupplierComponent } from './supplier/supplier.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TransferComponent } from './transfer/transfer.component';
import { ReturnComponent } from './return/return.component';

import { ReportViewerModule } from '../reportviewer/reportviewer.module';
import { ProductReturnComponent } from './product-return/product-return.component';
import { ChallanReceiveComponent } from './challan-receive/challan-receive.component';
import { ReturnReceiveComponent } from './return-receive/return-receive.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [ 
    ItemComponent,
    ItemTypeComponent,
    ItemModelComponent,
    ItemBrandComponent,
    StoreComponent,
    StoreOpeningComponent,
    ChallanComponent,
    ChallanReturnComponent,
    CollectionComponent,
    CompanyCollectionComponent,
    DamageComponent,
    DamageTypeComponent,
    PurchaseComponent,
    PurchaseOrderuploadComponent,
    SupplierComponent,
    TransferComponent,
    ReturnComponent,
    ProductReturnComponent,
    ChallanReceiveComponent,
    ReturnReceiveComponent,
    ProductGalleryComponent
  ],
  imports: [
    ReportViewerModule,
    ProgressSpinnerModule,
    CommonModule,
    TranslateModule,
    HttpClientModule,
    InventoryManagementRoutingModule, FormsModule, ReactiveFormsModule,
    InputTextModule, InputTextareaModule, MultiSelectModule, CascadeSelectModule,
    InputNumberModule, InputMaskModule, DropdownModule, AutoCompleteModule, CalendarModule, ChipsModule, TableModule, ConfirmDialogModule,
    MessagesModule, DialogModule, CheckboxModule, FileUploadModule,
    ToastModule, FieldsetModule, RadioButtonModule, PanelModule,DividerModule


  ]
})
export class InventoryManagementModule { }
