import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-client-sms-balance',
  templateUrl: './client-sms-balance.component.html',
  styleUrls: ['./client-sms-balance.component.css'],
  providers: [ConfirmationService]
})
export class ClientSmsBalanceComponent {
  companyList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup;  
  toastrService: any; 

  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService    
    , private auth: AuthService
   
  ) {

 }

 ngOnInit(): void{
  this.frm = new FormGroup({
    id: new FormControl(0),     
    rate: new FormControl("",[Validators.required]),    
    balance: new FormControl("",[Validators.required]),  
    noOfMessage: new FormControl("",[Validators.required]),
    cmnCompanyCustomerId: new FormControl("",[Validators.required]),
  });
 }


 save(){

 }

 edit(){

 }

 reset(){

 }

 clear(){

 }

 showModalDialog(){

 }


}
