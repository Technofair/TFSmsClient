import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { ExportService } from 'src/app/layout/service/export.service';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-unassigned-device',
  templateUrl: './assign-device.component.html',
  styleUrls: ['./assign-device.component.css']
})
export class AssignDeviceComponent implements OnInit {
    frmsrc!: FormGroup;
  devices: any[] = [];
  companies:any;
  deviceNumber:any;
  progressStatus:boolean=true
  packageRenewlist:any;
  isMso:boolean = this.auth.isMso();
    constructor(
        private fb: FormBuilder,
        private gSvc: GeneralService,
        private toastrService: ToastrService,
        private exportService: ExportService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
       this.frmsearch();
       this.getCompany();
       this.getCompanys();
       this.getRenewableSubscriber();
    }

    frmsearch() {
        
        this.frmsrc = this.fb.group({
          companyId: new FormControl(),
          clientId: new FormControl(),
          customerNumber: new FormControl(),
          contactNumber: new FormControl(),
          deviceNumber: new FormControl(),
          name: new FormControl(),
          fromDate: new FormControl(),
          toDate: new FormControl(),
          statusType: new FormControl()
    
        })
        
      }
      getCompany(){  
        this.gSvc.postdata("Common/Company/GetCompanyByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
          if(res.companyType == 'MSO'){
            this.isMso = true;
          }
          else{
            this.isMso = false;
          }     
        }, err => {
          this.isMso = false;
        })
      }
    getCompanys(){  
        //New
        this.gSvc.postdata("Common/Company/GetCompanyBySelfOrParentCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
        //Old
        //this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
          this.companies = res;
        }, err => {
          console.log(err);
          //this.toastrService.error("Error! Data Not Found");
        })
      }

      getRenewableSubscriber() {
        var requestBody = this.frmsrc.value;
        this.progressStatus=false;
        requestBody.companyId = this.auth.getCompany();
        this.gSvc.postdata("api/SubscriberPackage/GetSubscriptionInfoByParameter", JSON.stringify(requestBody)).subscribe(res => {
         this.packageRenewlist = res;
        this.progressStatus=true;
        }, err => {
        this.progressStatus=true;
        this.toastrService.error("Error ! Data is not Found . ");
        })
    
      }

    reset(): void{
      this.frmsrc.reset();
    }
    clear(table: Table) {
        table.clear();
      }
    exportTExcel() {
        const columnsToExport: any[] = ['firstName', 'lastName', 'customerNumber','contactNumber', 'deviceNumber'];
        this.exportService.exportToExcel(this.packageRenewlist, 'Assign_Device_List', columnsToExport);
      }
}