import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-mobile-message-template',
  templateUrl: './mobile-message-template.component.html',
  styleUrls: ['./mobile-message-template.component.css'],
  providers: [ConfirmationService]
})
export class MobileMessageTemplateComponent {

  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any;
  devicesCards: any;
  messageTemplate: any
  messagesList:any;
  setMessage:any="";
  list:any;
  messageType: any;
  mobileMesTemFrm!:FormGroup;
  osdTypes:any;
  scpFrequency:any;
  selectedProducts:any;
  availableProducts:any;
  draggedProduct: any ="";

  constructor(private fb: FormBuilder,
      private router: Router,
      private confirmationService: ConfirmationService,
      private gSvc: GeneralService,
      private auth: AuthService,
      private toastrService: ToastrService
    ){
   
  }

  ngOnInit(): void {
   // this.createMestemFrm();
    this.createMobileMesTemFrm();
    this.messageTemplates();
    this.getMessageType();
    //this.getOsdType();
    this.  getFrequency();
    this.selectedProducts = [];
    this.getAllMessageParam();
  }
  createMobileMesTemFrm(){
    this.mobileMesTemFrm = this.fb.group({
      id: new FormControl(0),
      scpMessageTypeId: new FormControl(null,Validators.required),
      timeframe:new FormControl(),
      cmnFrequencyId:new FormControl(null,Validators.required),
      cmnCompanyId:new FormControl(this.auth.getCompany(),Validators.required),
      serviceInitiate:new FormControl(""),
      lang:new FormControl(''),
      message:new FormControl(''),
      isActive: new FormControl(true),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date),
      modifiedBy: new FormControl(this.auth.getUserId()),
      modifiedDate: new FormControl(new Date),
    });
  }

  getMessageType(){
    this.gSvc.postdata("api/MessageType/GetActiveAMessageType", {}).subscribe(res => {
      this.messageType=res;
    }, err => {
      this.toastrService.error(err.message);
    })
  }



  getFrequency() { 
    this.gSvc.postdata("Common/CmnFrequency/CmnFrequencies", {}).subscribe(res => {
      this.scpFrequency = res;      
    }, err => {      
      this.toastrService.error(err.message);
    })
  }
  
  messageSet(){
    var messageTypeId= this.mobileMesTemFrm.get('scpMessageTypeId')?.value;
    var messages= this.messageType.find((x: { id: any; }) => x.id ===messageTypeId );
    this.setMessage= messages.bodyTemplate;    
  }


 
  save() {
    if (this.mobileMesTemFrm.invalid) return false;
    //console.log(this.frm.value); 
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.mobileMesTemFrm.controls['id'].value == 0) {
          this.mobileMesTemFrm.controls['createdBy'].setValue(this.auth.getUserId());
          this.mobileMesTemFrm.controls['createdDate'].setValue(new Date());
        } else if (this.mobileMesTemFrm.controls['id'].value > 0) {
          this.mobileMesTemFrm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }
        this.mobileMesTemFrm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
        this.gSvc.postdata("api/CmnMobileMessageTamplate/Add", JSON.stringify(this.mobileMesTemFrm.value)).subscribe(res => {
          this.toastrService.success("Saved success");
          this.createMobileMesTemFrm();
          this.messageTemplates();
        }, err => {
          this.toastrService.error(err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
 messageTemplates(){
  this.gSvc.getdata("api/CmnMobileMessageTamplate/GetAllMessageTemp").subscribe(res => {
    this.list=res;
    //this.join(res);
  }, err => {
    this.toastrService.error(err.message);
  })
 }
 
 join(messages:any){
  const transformedList = messages.map((item: {
    frequency: any;
    endDate: any;
    startDate: any;
    scpMessageTypeId: any; id: any; 
    description:any;
    name:any
  }) => ({
    id: item.id,
    scpMessageTypeId: item.scpMessageTypeId,
    typeName:this.messageType.find((type: { id: number; }) => type.id == item.scpMessageTypeId).name,
    description: item.description,
    startDate:item.startDate,
    endDate:item.endDate,
    frequency:item.frequency,
  }));
  this.list = transformedList;

 }
  clear(table: Table) {
    table.clear();
  }
  
  reset() {
    this.createMobileMesTemFrm();
  }
  edit(data: any) {
    this.mobileMesTemFrm.patchValue(data);
  }
dragStart(product: any) {
    this.draggedProduct = product;
}

drop() {
    if (this.draggedProduct) {
      this.setMessage +=  "#"+this.draggedProduct.name;
    }
}

dragEnd() {
    this.draggedProduct = null;
}

findIndex(product: any) {
    let index = -1;
    for (let i = 0; i < (this.availableProducts ).length; i++) {
        if (product.id === (this.availableProducts)[i].id) {
            index = i;
            break;
        }
    }
    return index;
  }
getAllMessageParam(){
  this.gSvc.getdata("api/CmnMessageParam/GetAllMessageParam").subscribe(res => {
    this.availableProducts=res;
  }, err => {
    this.toastrService.error(err.message);
  })
}
}
