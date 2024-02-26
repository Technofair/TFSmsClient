import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stb-assign',
  templateUrl: './device-assign.component.html',
  styleUrls: ['./device-assign.component.css'],
  providers: [ConfirmationService]
})
export class DeviceAssignComponent implements OnInit {
  packageList: any;
  stbAssignList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  apiurl: any;
  networkList: any;
  devices: any[] = [];
  deviceCards: any[] = [];
  subscribers: any[] = [];
  frm!: FormGroup;
  id: any;
  diviceInvoices: any[] = [];
  assignHistories: any[] = [];
  subscriberDetails: any;
  gateways:any;
  isPayWithSubscription: boolean = false;
  getWayaList:any;
  paymentMoodList: any ;
  paymentAction:boolean=true;
  isCardBase:boolean=true;
  payShow:boolean=true;
  checkGetter:boolean=true;
  getArray : any =[{id:1 ,name:'Mobile Banking',chield:[]},{id:2 ,name:'Internet Banking',chield:[]},{id:3 ,name:'Card',chield:[]}]
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private auth: AuthService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private _location: Location
  ) {

    this.getDevices();
    this.getCards();    
    var currUrl = this.route.snapshot.queryParamMap.get('urlNam');
    if (currUrl != null) {
      this.id = this.route.snapshot.queryParamMap.get('id');
      this._location.replaceState(currUrl);
      this.getSubscriberDetail();
      this.getSubscriberInvoice();
      this.getAssignHistory();
    } else {
      this.router.navigate(['/home/subscription/addSubscriber']);
    }
  }

  ngOnInit(): void {
    this.paymentType();
    this.createDeviceAssign();
  }
  createDeviceAssign() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      refNo: new FormControl(""),
      scpSubscriberId: new FormControl(0),
      prdDeviceNumberId: new FormControl('',[Validators.required]),
      deviceNumber: new FormControl(),
      amount: new FormControl(),
      paymentStatus: new FormControl(),
      isPayWithSubscription: new FormControl(false),
      paymentSchedule: new FormControl(),
      discount: new FormControl(),
      date: new FormControl(new Date()),
      cardNumber: new FormControl(),
      prdCardNumberId: new FormControl(),
      anFPaymentMethodId: new FormControl(''),
      paidAmount: new FormControl(),
      isActive: new FormControl(true),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      subscriberName: new FormControl(),
      scpDeviceAssignId : new FormControl(0),
      remarks : new FormControl(),
      cmnCompanyId: new FormControl()
    });
  }
  paymentType(){
    this.gSvc.postdata("api/PaymentMethod/GetActivePaymentMode", {}).subscribe(res => {
      this.paymentMoodList=res;
    }, err => {
      this.toastrService.error("Error ! Data is not Found . ");
    })
   }
   checkIsCardBase(id:any){
    debugger;
      var cardbase=this.devices.find(x=>x.id==id);
      if(cardbase.IsCardbased==true){
        this.isCardBase=false;
      }else{
        this.isCardBase=true;
        
      }
       
  }
  assignDevice() {
    if (this.frm.invalid) return false;
    //console.log(this.frm.value);
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        var obj = this.frm.value;
        obj.scpSubscriberId = this.id;
        obj.createdBy = this.auth.getUserId();
        obj.cmnCompanyId = this.auth.getCompany();


        console.log(JSON.stringify(obj));

        this.gSvc.postdata("api/DeviceAssign/AssignDevice", JSON.stringify(obj)).subscribe(res => {
         
          //Old: Asad Commented On 03.02.2024
          //this.isPayWithSubscription = false;
          //this.frm.reset();
          // this.getDevices();
          // this.getCards();
          // this.getSubscriberInvoice();
          // this.getAssignHistory();
          //End
          
          if (res.success == true) {

            alert("Device Assigned Successful");
            this.toastrService.success("Device Assigned Successfully");
            //New On 03.02.2024
            this.isPayWithSubscription = false;
            this.getDevices();
            this.getCards();
            this.getSubscriberInvoice();
            this.getAssignHistory();
            this.router.navigate(['/home/subscription/addSubscriber']);
            //End           

          } else {
            if (res.message != undefined) {
              this.toastrService.error(res.message);
            } else {
              this.toastrService.error("There is assign problem");
            }
          }
        }, err => {
          this.toastrService.error(err.message);
          console.log('Exception: (save)' +  err.message);
        })
        
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  setChecked(ev: any) {
    this.isPayWithSubscription = ev.currentTarget.checked;
  }
  getSubscriberInvoice() {
    this.gSvc.postdata("api/DeviceAssign/GetInvoiceInfoBySubscriberId?subscriberId=" + this.id, {}).subscribe(res => {
      this.diviceInvoices = res;
    }, err => {
      // this.toastrService.error("Error! Invoice not found!");
    })
  }
  getAssignHistory() {
    this.gSvc.postdata("api/DeviceAssign/GetAssignHistoryBySubscriberId?subscriberId=" + this.id, {}).subscribe(res => {
      this.assignHistories = res;
    }, err => {

      //this.toastrService.error("Error! Assign history not found!");
    })
  }
  getSubscriberDetail() {
    this.gSvc.postdata("api/Subscriber/GetById/" + this.id, {}).subscribe(res => {
      this.subscriberDetails = res;
    }, err => {
      this.toastrService.error("Error! Subscriber not found!");
    })
  }
  getDevices() {
    this.gSvc.postdata("Inventory/Purchase/GetUnassignStockInDeviceByCompanyId?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
      this.devices = res;
    }, err => {
      this.toastrService.error("Error! Device not found!");
    })
  }
  getCards() {
    this.gSvc.postdata("Inventory/Purchase/GetUnpairStockInCardByCompanyId/" + this.auth.getCompany(), {}).subscribe(res => {
      this.deviceCards = res;
    }, err => {
      this.toastrService.error("Error! Card not found!");
    })
  }
  getNetworkInfos() {
    this.gSvc.postdata("api/NetworkInfo/NetworkInfos", {}).subscribe(res => {
      this.networkList = res;
    }, err => {
      this.toastrService.error("Network Not Loaded")
    })
  }
  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/DeviceAssign/STBAssign/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/subscriber/stbassign')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.isPayWithSubscription = false;
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  edit(res: any) {
    this.frm.patchValue(res);
  }
  gateWayPermission(data:any){
    this.payShow=false;
    if(this.frm.get("anFPaymentMethodId")?.value==5){
      this.paymentAction=false;
      this.getPaymentList();
    }else{
      this.paymentAction=true;
    }
  }
  checkGetterAmount(){

    var amount = this.frm.controls['amount'].value;
    var paidAmount = this.frm.controls['paidAmount'].value;
    this.frm.controls['paymentSchedule'].setValue(0);
    if(amount == null || paidAmount == null)
    {
      
      return;
    }

    if(amount > paidAmount){
       this.checkGetter=false;
    }
    else{
      this.checkGetter=true;
    }
  }
  getPaymentList(){
    var url="api/MFSPGW/GetSSLCommerzGrantToken?deviceNumberId="+this.frm.get("prdDeviceNumberId")?.value+"&&paymentMethodId="+this.frm.get("anFPaymentMethodId")?.value;
    this.gSvc.postdata(url,{}).subscribe(res => {
     this.gateways=res.desc;
     this.getData();
    })
  }
  getData(){
    this.gateways.forEach((element:any) => {
      if(element.type=='internetbanking'){
        var mb =this.getArray.filter((x:any)=>x.id==2)[0];
        mb.chield.push(element);
      }else if(element.type=='mobilebanking'){
        var mb =this.getArray.filter((x:any)=>x.id==1)[0];
        mb.chield.push(element);
      }else{
        var mb =this.getArray.filter((x:any)=>x.id==3)[0];
        mb.chield.push(element);
      }
    });
  }
  getWayaLists(data:any){
    var dt=this.getArray.find((x: { id: any; })=>x.id==data);
    this.getWayaList=dt.chield;
  }

  toUrl: string = '/home/subscription/'
  goToUrl(url: string, id: string) {
    
    var eurl = this.toUrl + url;
    this.router.navigate([eurl], { queryParams: { id: id, urlNam: eurl}, queryParamsHandling: 'merge', skipLocationChange: false });
  }
}