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
  templateUrl: './message-template.component.html',
  styleUrls: ['./message-template.component.css'],
  providers: [ConfirmationService]
})
export class MessageTemplateComponent implements OnInit {

  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any;
  devicesCards: any;
  messageTemplate: any
  messagesList:any;
  setMessage:any;
  list:any;
  //messageType: any = [{ name: 'Simple OSD', id: '1' }, { name: 'Force OSD', id: '2' }, { name: 'Scroll OSD', 'id': '3' }];
  messageType: any;
  frm!: FormGroup;
  osdTypes:any;
  dvbEncodings: any = [{ 'name': 'ascii' }, { 'name': 'latin1' },{ 'name': 'latin2'},{ 'name': 'latin5' },{ 'name': 'ISO-8859-13' },{ 'name': 'hebrew'},{ 'name': 'greek'},{ 'name': 'ISO-8859-6'},{ 'name': 'utf8' }];
  bgColors:any=[{name:'Black',id:'0'},{name:'White',id:'1'},{name:'Teal',id:'2'},{name:'Purple',id:'3'},{name:'Blue',id:'4'},{name:'Light Gray',id:'5'},{name:'Dark Gray',id:'6'},{name:'Dark Teal',id:'7'},{name:'Dark Purple',id:'8'},{name:'Dark Blue',id:'9'},{name:'Yellow',id:'10'},{name:'Green',id:'11'},{name:'Dark Yellow',id:'12'},{name:'Dark Green',id:'13'},{name:'Red',id:'14'},{name:'Dark Red',id:'15'},{name:'Dark Red',id:'15'}];
  colors:any=[{name:'Black',id:'0'},{name:'White',id:'1'},{name:'Teal',id:'2'},{name:'Purple',id:'3'},{name:'Blue',id:'4'},{name:'Light Gray',id:'5'},{name:'Dark Gray',id:'6'},{name:'Dark Teal',id:'7'},{name:'Dark Purple',id:'8'},{name:'Dark Blue',id:'9'},{name:'Yellow',id:'10'},{name:'Green',id:'11'},{name:'Dark Yellow',id:'12'},{name:'Dark Green',id:'13'},{name:'Red',id:'14'},{name:'Dark Red',id:'15'}];

  simpleOsd:boolean=true;
  longOsd:boolean=true;
  scrollOsd:boolean=true;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.createMestemFrm();
    this.messageTemplates();
    this.getMessageType();
    this.getOsdType();
  }

  createMestemFrm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      scpMessageTypeId: new FormControl(Validators.required),
      description: new FormControl(),
      message:new FormControl('',Validators.required),
      cmnCompanyId: new FormControl(this.auth.getCompany()),
      startDate: new FormControl(),
      endDate: new FormControl(),
      oSDTypeId: new FormControl(Validators.required),
      dVBEncoding: new FormControl('ascii', Validators.required),
      duration: new FormControl(),

      recurrent: new FormControl(false),
      date:new FormControl(),
      repetition: new FormControl(),
      interval: new FormControl(),
      color: new FormControl(),
      backgroundColor: new FormControl(),
      scrollSpeed: new FormControl(),
      forced: new FormControl(false),

      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl()

    });
  }
  getMessageType(){
    this.gSvc.postdata("api/MessageType/GetActiveAMessageType", {}).subscribe(res => {
      this.messageType=res;
      console.log(JSON.stringify(res));
    }, err => {
      this.toastrService.error(err.message);
    })
  }

  getOsdType(){
    this.gSvc.postdata("Common/OSDType/GetAllOSDType", {}).subscribe(res => {
      this.osdTypes=res;
    }, err => {
      this.toastrService.error(err.message);
    })
  }
  messageSet(){
    var messageTypeId= this.frm.get('scpMessageTypeId')?.value;
    var messages= this.messageType.find((x: { id: any; }) => x.id ===messageTypeId );
    this.setMessage= messages.bodyTemplate;
    // this.frm.setValue({
    //   message: messages.bodyTemplate,
    // });
  }
  osdTypeChange(){
    var osd= this.frm.get('oSDTypeId')?.value;
    if(osd==1){
       this.simpleOsd=false;
       this.longOsd=true;
       this.scrollOsd=true;
    }else if(osd==2){
       this.longOsd=false;
       this.simpleOsd=true;
       this.scrollOsd=true;
    }else if(osd==3){
      this.simpleOsd=true;
      this.longOsd=true;
      this.scrollOsd=false;
    }
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
        //obj.cmnCompanyId=this.auth.getCompany();
        this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());
        console.log(this.frm.value);
        this.gSvc.postdata("api/MessageTemplate/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.toastrService.success("Saved success");
          this.messageTemplates();
          this.reset();
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
  this.gSvc.postdata("api/MessageTemplate/GetAll", {}).subscribe(res => {
    this.join(res);
  }, err => {
    this.toastrService.error(err.message);
  })
 }
 
 join(messages:any){
  
  //var result=this.messageType.find((type: { id: number; }) => type.id == 2).name;
  const transformedList = messages.map((item: {
    frequency: any;
    endDate: any;
    startDate: any;
    scpMessageTypeId: any; id: any;  description:any;
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
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  edit(id: any) {
    this.osdTypes
    this.messageType;
    this.dvbEncodings;
    this.gSvc.postdata("api/MessageTemplate/GetById/"+id, {}).subscribe(res => {
       this.frm.controls['oSDTypeId'].setValue(res.osdTypeId);
       this.frm.controls['dVBEncoding'].setValue(res.dvbEncoding);
       this.osdTypeChange()
      this.frm.patchValue(res);
    }, err => {
      this.toastrService.error(err.message);
    })
  }
}
