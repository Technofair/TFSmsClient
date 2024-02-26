import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/layout/service/export.service';
import { ReportViewer } from 'src/app/reportviewer/reportviewer';
import { ReportModel } from 'src/app/reportviewer/reportmodel';

@Component({
  selector: 'app-add-subscriber',
  templateUrl: './subscriber-list.component.html',
  styleUrls: ['./subscriber-list.component.css'],
  providers: [ConfirmationService]
})
export class SubscriberListComponent implements OnInit {

  displayModal: boolean = false;
  displayPackageModal: boolean = false;
  displaySTBModal: boolean = false
  viewInfo: any = {};
  subscriberList: any[] = [];
  apiurl: any;
  casTypeList: any;
  networkList: any;
  stbList: any;
  packageList: any;
  numberOfMonth: any;
  frmstb!: FormGroup;
  devices: any;
  progressStatus:boolean=true;
  genderList: any = [{ 'id': 1, "name": 'Male' }, { 'id': 2, "name": "Female" }, { 'id': 3, "name": "Others" }]
  subsType: any = [{ id: 1, name: 'General-জেনারেল' }, { id: 2, name: 'Corporate-কর্পোরেট' }];

  id: any;
  cardNumberList: any;
  organizations: any;
  frmsrc!: FormGroup
  // districtList: any
  // thanaList: any
  // unionList: any;
  companies: any;
  tableData: any;
  searchQuery: string = '';
  searchResults: any[] = [];
  deviceCount: any;
  constructor(
    private fb: FormBuilder
    , private router: Router
    , private confirmationService: ConfirmationService
    , private gSvc: GeneralService
    , private toastrService: ToastrService
    , private route: ActivatedRoute
    , private auth: AuthService
    , private exportService: ExportService) {

  }
  frm: FormGroup = new FormGroup({
    packageId: new FormControl(""),
    monthDayAmount: new FormControl(""),
    subscriberId: new FormControl(""),
    cardNumber: new FormControl(""),
    startDate: new FormControl(""),
    networkNo: new FormControl(""),
    casType: new FormControl(""),
    isMonth: new FormControl(""),
    remarks: new FormControl(""),
    endDate: new FormControl(""),
    articleNumber: new FormControl(""),
    numberOfPerioad: new FormControl(""),
    subscribtionTypeId: new FormControl(""),
    //cmnUnionId: new FormControl(""),
    subscriberName: new FormControl(""),
    phone: new FormControl("")
    // cmnUpazillaId: new FormControl(""),

  })

  ngOnInit(): void {
    this.searchFrom();
    this.route.params.subscribe((params: any) => {
      if (params.id) {
        this.id = params.id;
        this.subDetails(this.id);
      }
    });

    this.getCompany();
    // this.getDistrict();
    this.assignStbFrm();
    this.frmsearch();
    
  }
  searchFrom() {
    this.frm = this.fb.group({
      id: ["0"],
      subscriberId: [""],
      packageId: [""],
      monthDayAmount: [""],
      startDate: [""],
      cardNumber: [""],
      networkNo: [""],
      casType: [""],
      isMonth: [JSON.parse('true')],
      remarks: [""],
      articleNo: ["0"],
      endDate: [""],
      articleNumber: [""],
      numberOfPerioad: [""],
      organizationId: [""],
      subscriberName: [""],
      phone: [""],
      subscriberNo: [""]
      // cmnUpazillaId: [""],
      // cmnUnionId: [""],
    });
  }
  toUrl: string = '/home/subscription/'
  goToUrl(url: string, id: string) {
    var eurl = this.toUrl + url;
    this.router.navigate([eurl], { queryParams: { id: id, urlNam: eurl}, queryParamsHandling: 'merge', skipLocationChange: false });
  }
  assignStbFrm() {
    this.frmstb = this.fb.group({
      id: new FormGroup(0),
      scpSubscriberId: new FormControl(),
      prdDeviceNumberId: new FormControl(),
      amount: new FormControl(),
    });
  }
  frmsearch() {
    
    // var dstrct: any = this.auth.getDistrict();
    // var upzla: any = this.auth.getUpazila();
    // var unon: any = this.auth.getUnion();

    this.frmsrc = this.fb.group({
      companyId: new FormControl(),
      clientId: new FormControl(),
      customerNumber: new FormControl(''),
      contactNumber: new FormControl(''),
      deviceNumber: new FormControl(''),
      name: new FormControl('') //,
      // cmnDistrictId: new FormControl(parseInt(dstrct)),
      // cmnUpazillaId: new FormControl(parseInt(upzla)),
      // cmnUnionId: new FormControl(parseInt(unon))
    })

    // this.getUpazillaByDistrictId();
    // this.getUnionByUpazillaId();

  }

  //May be unneccessary
  subDetails(id: any) {
    this.gSvc.postdata("api/Subscriber/Subscriber/" + id + "", {}).subscribe((res: any) => {
    
      this.viewInfo = res;
    }, err => {
      this.toastrService.error(err.message);
            console.log('Exception: (subDetails)' +  err.message);
    })
  }


  edit(id: any) {
  
    this.router.navigate(['home/subscription/addSubscriber/' + id]);
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }

  saveSTB() {
    this.gSvc.postdata("api/DeviceAssign/AssignDevice", JSON.stringify(this.frmstb.value)).subscribe(res => {
      this.frm.reset();
      this.toastrService.success("Assign successful");
    }, err => {
      
     // this.toastrService.error("Error ! STB not assigned");
    })
  }

  join(res: any) {
    var list = res;
    //var name =this.subsType.find((item: { id: number; })=> item.id==1).name;
    var transformedList = list.map((item: {
      autoDeactive: any;
      lastName: any;
      firstName: any;
      address: any;
      email: any;
      contactNumber: any;
      subscriberType: any;
      id: any;
    }) => ({
      id: 0,
      firstName: item.firstName,
      lastName: item.lastName,
      typeName: this.subsType.find((type: { id: number; }) => type.id == item.subscriberType).name,
      contactNumber: item.contactNumber,
      email: item.email,
      subscriberType: item.subscriberType,
      autoDeactive: item.autoDeactive,
      address: item.address,
    }));
    this.subscriberList = transformedList;
  }
  
  search() {
    var requestBody = this.frmsrc.value;
    requestBody.companyId = this.auth.getCompany();
    this.progressStatus=false;
    this.gSvc.postdata("api/Subscriber/GetSubscriberWithDeviceByParameter", JSON.stringify(requestBody)).subscribe(res => {
      this.subscriberList = res;
      this.progressStatus=true;

    }, err => {
      this.progressStatus=true;
      this.toastrService.error(err.message);
            console.log('Exception: (search)' +  err.message);
      //this.toastrService.error("Error ! Data is not found . ");
    })
  }

  showModalDialog(item: any) {
    this.displayModal = true;
    this.viewInfo = item;
    var id = item.id;
    this.gSvc.postdata("api/SubscriberPackage/GetSubscriberLatestDevicePackageInfoBySubscriberId?subscriberId=" + id, {}).subscribe((res: any) => {
      this.tableData = res;
    }, err => {
      this.toastrService.error(err.message);
            console.log('Exception: (showModalDialog)' +  err.message);
    })
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error(err.message);
            console.log('Exception: (getCompany)' +  err.message);
     // this.toastrService.error("Error! Data Not Found");
    })
  }

  // getDistrict() {
  //   this.apiurl = "api/GeneralServices/Districts";
  //   this.gSvc.getdata(this.apiurl).subscribe(res => {
  //     this.districtList = res;
  //   }, err => {
  //     this.toastrService.error(err.message);
  //           console.log('Exception: (getDistrict)' +  err.message);
  //   })
  // }

  // getUpazillaByDistrictId() {
  //   this.apiurl = "api/GeneralServices/Upazila/" + this.frmsrc.controls['cmnDistrictId'].value;
  //   this.gSvc.getdata(this.apiurl).subscribe(res => {
  //     this.thanaList = res;
  //   }, err => {
  //     this.toastrService.error(err.message);
  //           console.log('Exception: (getUpazillaByDistrictId)' +  err.message);
  //   })
  // }

  // getUnionByUpazillaId() {
  //   this.apiurl = "api/GeneralServices/Union/" + this.frmsrc.controls['cmnUpazillaId'].value;
  //   this.gSvc.getdata(this.apiurl).subscribe(res => {
  //     this.unionList = res;

  //   }, err => {
  //     this.toastrService.error(err.message);
  //     console.log('Exception: (getUnionByUpazillaId)' +  err.message);
  //   })
  // }


  searchReset() {
    this.frmsrc.reset();
    this.frmsrc.markAsPristine();
  }

  exportTExcel() {
    const columnsToExport: any[] = ['customerNumber', 'firstName', 'contactNumber', 'email', 'address', 'packageName', 'devices'];
    this.exportService.exportToExcel(this.subscriberList, 'subscriber_report', columnsToExport);
  }

  //Report Execution
  @ViewChild(ReportViewer)
  _rptViewer!: ReportViewer;
  public reportModal: boolean = false;
  public _getReportUrl: string = 'api/Subscriber/GetReportSubscriberWithDeviceByParameter';
  loadReportIn() {
    debugger;
    var requestBody = this.frmsrc.value;
    requestBody.companyId = this.auth.getCompany();
    this.reportModal = true;
    var repFile = 'rptSubscriver.rdlc';
    var rmodel = { reportPath: '/reportfile/Subscription/' + repFile, reportName: 'Subscriber List' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 800);
    var param = { pageNumber: 0, pageSize: 100, IsPaging: true, id: 0, strId: this.auth.getCompany() };
    var ModelsArray = [requestBody, param];
    this._rptViewer.reportInPage(this._getReportUrl, ModelsArray);
  }
}
