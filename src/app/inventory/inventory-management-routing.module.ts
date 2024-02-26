import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { ItemBrandComponent } from './item-brand/item-brand.component';
import { ItemModelComponent } from './item-model/item-model.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { TransferComponent } from './transfer/transfer.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { StoreComponent } from './store/store.component';
import { StoreOpeningComponent } from './store-opening/store-opening.component';
import { ChallanComponent } from './challan/challan.component';
import { ChallanReturnComponent } from './challan-return/challan-return.component';
import { CollectionComponent } from './collection/collection.component';
import { CompanyCollectionComponent } from './company-collection/company-collection.component';
import { DamageComponent } from './damage/damage.component';
import { DamageTypeComponent } from './damage-type/damage-type.component';
import { PurchaseOrderuploadComponent } from './purchase-orderupload/purchase-orderupload.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ReturnComponent } from './return/return.component';
import { ProductReturnComponent } from './product-return/product-return.component';
import { ChallanReceiveComponent } from './challan-receive/challan-receive.component';
import { ReturnReceiveComponent } from './return-receive/return-receive.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';



const routes: Routes = [
  
  { path: 'item', component: ItemComponent },
  { path: 'itemtype', component: ItemTypeComponent },
  { path: 'itembrand', component: ItemBrandComponent },
  { path: 'itemmodel', component: ItemModelComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'store', component: StoreComponent },
  { path: 'store-opening', component: StoreOpeningComponent },
  { path: 'challan', component: ChallanComponent },
  { path: 'challanReturn', component: ChallanReturnComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'company-collection', component: CompanyCollectionComponent },
  { path: 'damage', component: DamageComponent },
  { path: 'damagetype', component: DamageTypeComponent },
  { path: 'poupload',component:PurchaseOrderuploadComponent},
  { path: 'supplier', component: SupplierComponent },
  { path: 'return', component: ReturnComponent },
  { path: 'product-return', component: ProductReturnComponent },
  { path: 'challan-receive', component: ChallanReceiveComponent },
  { path: 'return-receive', component: ReturnReceiveComponent },
  { path:'product-gallery',component:ProductGalleryComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagementRoutingModule { }