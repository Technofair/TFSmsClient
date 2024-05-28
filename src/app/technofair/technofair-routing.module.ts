import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientInfoComponent } from './client-info/client-info.component';
import { ClientServicePermissionComponent } from './client-service-permission/client-service-permission.component';
import { ClientPackageComponent } from './client-package/client-package.component';
import { CompanyCollectionComponent } from './company-collection/company-collection.component';
import { CompanyPackageComponent } from './company-package/company-package.component';

const routes: Routes = [
  { path: 'clientinfo', component: ClientInfoComponent },
  { path: 'client-service-permission', component: ClientServicePermissionComponent },
  { path: 'client-package', component: ClientPackageComponent },
  { path: 'company-package', component: CompanyPackageComponent },
  { path: 'company-collection', component: CompanyCollectionComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnofairRoutingModule { }
