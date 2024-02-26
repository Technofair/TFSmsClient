import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PaymentGatewayRoutingModule } from './payment-gateway-routing.module';
import { ChieldPaymentComponent } from '../website/chield-payment/chield-payment.component';


@NgModule({
  declarations: [
    ChieldPaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule,
    PaymentGatewayRoutingModule
  
  ]
})
export class PaymentGatewayModule { }