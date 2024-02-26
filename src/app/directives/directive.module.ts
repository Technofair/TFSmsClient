import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailCharactersDirective } from './email/email-characters.directive';
import { PhoneCharactersDirective } from './phone/phone-characters.directive';
import { WebCharactersDirective } from './web/web-characters.directive';
import { FaxCharactersDirective } from './fax/fax-characters.directive';



@NgModule({
  declarations: [EmailCharactersDirective, PhoneCharactersDirective, WebCharactersDirective, FaxCharactersDirective],
  imports: [
    CommonModule
  ],
  exports: [EmailCharactersDirective, PhoneCharactersDirective, WebCharactersDirective, FaxCharactersDirective]
})
export class DirectiveModule { }
