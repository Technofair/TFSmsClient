import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientInfoComponent } from './client-info/client-info.component';
import { ClientServicePermissionComponent } from './client-service-permission/client-service-permission.component';

const routes: Routes = [
  { path: 'clientinfo', component: ClientInfoComponent },
  { path: 'client-service-permission', component: ClientServicePermissionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechnofairRoutingModule { }
