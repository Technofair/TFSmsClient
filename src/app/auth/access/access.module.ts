import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessRoutingModule } from './access-routing.module';
import { AccessComponent } from './access/access.component';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    AccessComponent
  ],
  imports: [
    CommonModule,
    AccessRoutingModule,
    ButtonModule
  ]
})
export class AccessModule { }
