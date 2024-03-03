import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { integratorCredentialComponent } from './integrator-credential/integrator-credential.component';
import { IntegratorPackageComponent } from './integrator-package/integrator-package.component';
import { IntegratorCompanyComponent } from './integrator-company/integrator-company.component';
import { IntegratorPermissionComponent } from './integrator-permission/integrator-permission.component';
import { IntegratorSettingsComponent } from './integrator-settings/integrator-settings.component';
import { ClientPackageComponent } from './client-package/client-package.component';
import { QuickDashboardComponent } from './quick-dashboard/quick-dashboard.component';
import { NetidMappingComponent } from './company-integrator-netid-mapping/netid-mapping.component';
import { ClientPackageCommissionComponent } from './client-package-commission/client-package-commission.component';
import { PackagePeriodPermissionComponent } from './package-period-permission/package-period-permission.component';
import { ScpProductComponent } from './scp-product/scp-product.component';


const routes: Routes = [
  { path: 'company', component: CompanyComponent },
  { path: 'integratorcredential/:id', component: integratorCredentialComponent },
  { path: 'integratorpackage', component: IntegratorPackageComponent },
  { path: 'integrationcompany', component: IntegratorCompanyComponent },
  { path: 'integrationpermission', component: IntegratorPermissionComponent },
  { path: 'integrationsettings', component: IntegratorSettingsComponent},
  { path: 'clientpackage', component: ClientPackageComponent},
  { path: 'quick-dashboard', component: QuickDashboardComponent},
  { path: 'netid-mapping', component: NetidMappingComponent },
  { path: 'client-package-commission', component: ClientPackageCommissionComponent },
  { path: 'package-period-permission', component: PackagePeriodPermissionComponent },
  { path: 'scp-package', component: ScpProductComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
