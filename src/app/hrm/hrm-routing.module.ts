import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { DesignationComponent } from './designation/designation.component';
import { OfficeComponent } from './office/office.component';

const routes: Routes = [
  { path: 'employee', component:EmployeeComponent },
  { path: 'designation', component:DesignationComponent },
  { path: 'office', component:OfficeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmRoutingModule { }
