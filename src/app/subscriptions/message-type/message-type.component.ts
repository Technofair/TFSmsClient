import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { type } from 'os';

@Component({
  selector: 'app-stb-assign-test',
  templateUrl: './message-type.component.html',
  styleUrls: ['./message-type.component.css'],
  providers: [ConfirmationService]
})
export class MessageTypeComponent implements OnInit {

  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any;
  devicesCards: any;
  messageTemplate: any
  messagesList:any;
  messageType: any = [{ name: 'Simple OSD', id: '1' }, { name: 'Force OSD', id: '2' }, { name: 'Scroll OSD', 'id': '3' }];
  frm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService) {

  }
  ngOnInit(): void {
    this.createMestemFrm();
    this.messageTypes();
  }

  createMestemFrm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      bodyTemplate: new FormControl('',Validators.required),
      name: new FormControl('',Validators.required),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
      isActive: new FormControl()
    });
  }
  save() {
    if (this.frm.invalid) return false;
    //console.log(this.frm.value); 
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.controls['id'].value == 0) {
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
        } else if (this.frm.controls['id'].value > 0) {
          this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
        }
       debugger;
        this.gSvc.postdata("api/MessageType/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.toastrService.success("Saved success");
          this.messageTypes()
          this.reset();
        }, err => {
          this.toastrService.error("Error(save):" +err.message);
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
 messageTypes(){
  this.gSvc.postdata("api/MessageType/GetAll", {}).subscribe(res => {
    this.messageTemplate = res;
    this.join(this.messageTemplate);
  }, err => {
    this.toastrService.error("Error! Subscribers not found!");
  })
 }
 
 join(messages:any){
  var t :any;
  var message=messages;
  //var result=this.messageType.find((type: { id: number; }) => type.id == 2).name;
  const transformedList = messages.map((item: {
    frequency: any;
    endDate: any;
    startDate: any;
    scpMessageTypeId: any; id: any; prdDeviceNumberId: any; description:any;
    name:any
  }) => ({
    id: 0,
    scpMessageTypeId: item.scpMessageTypeId,
    typeName:this.messageType.find((type: { id: number; }) => type.id == item.scpMessageTypeId).name,
    description: item.description,
    startDate:item.startDate,
    endDate:item.endDate,
    frequency:item.frequency,
  }));
  
  this.messageTemplate = transformedList;
 }
  
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  edit(res: any) {
    this.messageType;
    this.frm.patchValue(res);
  }
}
