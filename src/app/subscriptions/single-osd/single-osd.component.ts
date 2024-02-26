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
  templateUrl: './single-osd.component.html',
  styleUrls: ['./single-osd.component.css'],
  providers: [ConfirmationService]
})


export class SingleOsdComponent implements OnInit {
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
  dvbEncodings: any = [{ 'name': 'ascii' }, { 'name': 'latin1' },{ 'name': 'latin2'},{ 'name': 'latin5' },{ 'name': 'ISO-8859-13' },{ 'name': 'hebrew'},{ 'name': 'greek'},{ 'name': 'ISO-8859-6'},{ 'name': 'utf8' }];
  //osdTypes: any = [{ name: 'Select OSD', id: '0' },{ name: 'Short', id: '1' }, { name: 'Long', id: '2' },  { name: 'Scroll', id: '3' }];
  date: any;
  osdTypes:any;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.frmcreate();
    this.frmsearch();
    this.getCompany();
    this.getDistrict();
    this.getOsd();
    this.getOsdType(); 
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
      cmnUnionId: new FormControl()
    })
  }
  
  frmcreate() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId: new FormControl(),
      oSDType: new FormControl(),
      message: new FormControl('',Validators.required ),
      dVBEncoding: new FormControl('ascii', Validators.required),
      duration: new FormControl(),
      recurrent: new FormControl(),
      date:new FormControl(),
      startDate: new FormControl(),
      startTime: new FormControl(),
      repetition: new FormControl(),
      interval: new FormControl(),
      color: new FormControl(),
      backgroundColor: new FormControl(),
      scrollSpeed: new FormControl(),
      forced: new FormControl(),
      createdBy: new FormControl(),
     
      createdDate: new FormControl()
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
      // for (var i = 0; i < res.length; i++) {
      //   res[i].isActive = true;
      // }
      // this.clients = res;
    }, err => {
      this.toastrService.error("Error ! Data is not saved . ");
    })

  }
  getOsdType(){
    this.gSvc.postdata("Common/OSDType/GetAllOSDType", {}).subscribe(res => {
      this.osdTypes=res;
    }, err => {
      this.toastrService.error(err.message);
    })
  }
  send() {
    const selectedUsers = this.selectedSubscribers.filter(user => user.isActive);
    const transformedList = selectedUsers.map(item => ({
      id: 0,
      ScpSubscriberId: item.id,
      PrdDeviceNumberId: item.prdDeviceNumberId,
    }));

    if (this.frm.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        var date= this.frm.get('startDate')?.value;
        var time= this.frm.get('startTime')?.value;
        
        if(this.frm.get('startDate')?.value!=null &&  this.frm.get('startTime')?.value!=null){
          this.frm.controls['startTime'].setValue(date+' '+time+':00');
        }else if(this.frm.get('startDate')?.value!=null){
          this.frm.controls['startTime'].setValue(date+' '+'00:00:00');
        }else{
          this.frm.controls['startTime'].setValue('');
      }
        var obj= this.frm.value;
        obj.cmnCompanyId=this.auth.getCompany();
        obj.createdBy=this.auth.getUserId();
        obj.createdDate=new Date();
       
        
      //  this.frm.controls['messageStartTime']?.setValue(messageDisplayTime);
       
        let reqestbody = {
          list: transformedList,
          obj: obj
        }
        
        if(obj.oSDType<=0){
          return false;
        }
      
       

        this.gSvc.postdata("api/OSDMessageSend/Save", JSON.stringify(reqestbody)).subscribe(res => {
          console.log(reqestbody);
          if(res.success){
            
          this.toastrService.success("Saved success");
          this.getOsd(); 
          this.reset();
          }else{
            console.log(reqestbody);
            this.toastrService.error("Error ! Data is not saved . ");
          }
        }, err => {
          console.log(reqestbody);
          this.toastrService.error("Error ! Data is not saved . ");
        })
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }
  osdTypeChange(){
    var osd= this.frm.get('oSDType')?.value;
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
  getOsd(){
    this.apiurl = "api/OSDMessageSend/GetSentOSDByClientId?companyId="+this.auth.getCompany();
    this.gSvc.postdata(this.apiurl,{}).subscribe(res => {
      this.osdMessages = res;
      
    }, err => {
      this.toastrService.error("Data not found!");
    })
  }
}