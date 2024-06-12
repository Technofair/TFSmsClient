import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientInfoComponent } from './client-info/client-info.component';
import { ClientServicePermissionComponent } from './client-service-permission/client-service-permission.component';
import { ClientPackageComponent } from './client-package/client-package.component';
import { CompanyCollectionComponent } from './company-collection/company-collection.component';
import { CompanyPackageComponent } from './company-package/company-package.component';
import { ClientPaymentComponent } from './client-payment/client-payment.component';
import { CompanyPackageTypeComponent } from './company-package-type/company-package-type.componet';
import { CustomerServerInfoComponent } from './customer-server-info/customer-server-info.component';

const routes: Routes = [
  { path: 'clientinfo', component: ClientInfoComponent },
  { path: 'client-service-permission', component: ClientServicePermissionComponent },
  { path: 'client-package', component: ClientPackageComponent },
  { path: 'company-package', component: CompanyPackageComponent },
  { path: 'client-payment', component: ClientPaymentComponent },
  { path: 'company-collection', component: CompanyCollectionComponent },
  { path: 'company-package-type', component: CompanyPackageTypeComponent },
  { path: 'customer-server-info-component', component: CustomerServerInfoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnofairRoutingModule { }
