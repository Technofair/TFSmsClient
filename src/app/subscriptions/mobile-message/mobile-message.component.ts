import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


interface client {
  id: number;
  name: string;
  checked: boolean;
  isActive: boolean;
}
@Component({
  selector: 'app-stb-assign-single-osd',
  templateUrl: './mobile-message.component.html',
  styleUrls: ['./mobile-message.component.css'],
  providers: [ConfirmationService]
})


export class MobileMessageComponent implements OnInit {
  subscribers: any[] = [];
  selectedSubscribers:any[]=[];
  packages: any[] = [];
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any;
  devicesCards: any;
  cards: any;
  organizations: any;
  frm!: FormGroup;
  messages: any
  thanaList: any;
  unionList: any;
  frmsrc!: FormGroup;
  simpleOsd:boolean=true;
  longOsd:boolean=true;
  scrollOsd:boolean=true;
  districtList:any;
  check:boolean=true;
  clients:client[] =[];
  osdMessages:any;
  bgColors:any=[{name:'Black',id:'0'},{name:'White',id:'1'},{name:'Teal',id:'2'},{name:'Purple',id:'3'},{name:'Blue',id:'4'},{name:'Light Gray',id:'5'},{name:'Dark Gray',id:'6'},{name:'Dark Teal',id:'7'},{name:'Dark Purple',id:'8'},{name:'Dark Blue',id:'9'},{name:'Yellow',id:'10'},{name:'Green',id:'11'},{name:'Dark Yellow',id:'12'},{name:'Dark Green',id:'13'},{name:'Red',id:'14'},{name:'Dark Red',id:'15'},{name:'Dark Red',id:'15'}];
  colors:any=[{name:'Black',id:'0'},{name:'White',id:'1'},{name:'Teal',id:'2'},{name:'Purple',id:'3'},{name:'Blue',id:'4'},{name:'Light Gray',id:'5'},{name:'Dark Gray',id:'6'},{name:'Dark Teal',id:'7'},{name:'Dark Purple',id:'8'},{name:'Dark Blue',id:'9'},{name:'Yellow',id:'10'},{name:'Green',id:'11'},{name:'Dark Yellow',id:'12'},{name:'Dark Green',id:'13'},{name:'Red',id:'14'},{name:'Dark Red',id:'15'}];
  clientTypes: any = [{name:'MSO',id:1},{name:'LSO',id:'2'},{name:'Subscriber',id:'2'}];
  date: any;
  osdTypes:any;
  characters:any;
  countSMS:any;
  messageLength:any;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService) {

  }
  ngOnInit(): void {
    this.frmcreate();
    this.frmsearch();
    this.getCompany();
    this.getDistrict();
  }
  frmsearch() {
    this.frmsrc = this.fb.group({
      companyId:new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(''),
      contactNumber: new FormControl(''),
      name: new FormControl(''),
      cmnDistrictId:new FormControl(),
      cmnUpazillaId: new FormControl(),
      cmnUnionId: new FormControl(),
      clientTypeId:new FormControl()
    })
  }
  frmcreate() {
    this.frm = this.fb.group({
    
      id: new FormControl(0,Validators.required),
      recipient: new FormControl('', Validators.required),
      message: new FormControl('',Validators.required ),
      countSMS: new FormControl(1,Validators.required),
      date:new FormControl(new Date()),
      lang:new FormControl(),
      
    });
  }
  getCompany(){
    this.apiurl = "Common/Company/GetAll";
    this.gSvc.postdata(this.apiurl,{}).subscribe(res => {
      this.organizations = res;
    }, err => {
      this.toastrService.error("Union Error!");
    })
  }
  search() {
    var requestBody =  this.frmsrc.value ;  
    requestBody.companyId=this.auth.getCompany();
    
    this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceOnlyByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.subscribers=res;
    }, err => {
      this.toastrService.error("Error ! Data is not saved . ");
    })
  }
  send() {
    debugger
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var obj= this.frm.value;
        this.gSvc.postdata("api/SendSMS/Save", JSON.stringify(obj)).subscribe(res => {
          if(res.success){
          this.toastrService.success("Saved success");
          }else{
            this.toastrService.error("Error ! Data is not send . ");
          }
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
  messageCount(){
    if(this.frm.controls['lang'].value=='bn'||this.frm.controls['lang'].value=='en'){
      var message= this.frm.controls['message'].value;
      var bn =67
      var en=160
      this.messageLength=message.length;
      if(this.frm.controls['lang'].value=='bn'){
        this.countSMS=Math.ceil(this.messageLength/bn).toString();
      }
      if(this.frm.controls['lang'].value=='en'){
       this.countSMS=Math.ceil(this.messageLength/en).toString();
     }
    }else{
      this.toastrService.error("Please select language !")
      return ;
    }


  }
  checkBnEn(){
   if(this.frm.controls['en'].value==true){
     this.frm.controls['bn'].setValue(false);
   }
   if(this.frm.controls['bn'].value==true){
    this.frm.controls['en'].setValue(false);
  }
  }
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/subscriber/stbassign')
  }
  clear(table: Table) {
    table.clear();
  }
  searchReset(){
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  edit(res: any) {
    this.frm.patchValue(res);
  }
  getDistrict() {
    this.apiurl = "api/GeneralServices/Districts";
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.districtList = res;
    }, err => {
      this.toastrService.error("District error!");
    })
  }
  getUpazillaByDistrictId() {
    this.apiurl = "api/GeneralServices/Upazila/" + this.frmsrc.controls['cmnDistrictId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.thanaList = res;
    }, err => {
      this.toastrService.error("Upazila error!");
    })
  }
  getUnionByUpazillaId() {
    this.apiurl = "api/GeneralServices/Union/" + this.frmsrc.controls['cmnUpazillaId'].value;
    this.gSvc.getdata(this.apiurl).subscribe(res => {
      this.unionList = res;
    }, err => {
      this.toastrService.error("Union error!");
    })
  }
  
}