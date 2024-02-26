import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginComponent1 } from './login1/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login1', component: LoginComponent1 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
