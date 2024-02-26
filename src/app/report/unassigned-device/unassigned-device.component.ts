import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ExportService } from 'src/app/layout/service/export.service';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-unassigned-device',
  templateUrl: './unassigned-device.component.html',
  styleUrls: ['./unassigned-device.component.css']
})
export class UnassignedDeviceComponent implements OnInit {

  frm!: FormGroup;
  devices: any[] = [];
  companies:any;
  deviceNumber:any;
  progressStatus:boolean=true;
  isMso: boolean =this.auth.isMso();

    constructor(
        private fb: FormBuilder,
        private gSvc: GeneralService,
        private toastrService: ToastrService,
        private exportService: ExportService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.frmsearch();
        //console.log(JSON.stringify(this.auth.getCompany()));
        this.getCompany();
        this.getCompanys();
        this.getDevices();
    }

    frmsearch() { 
          this.frm = this.fb.group({
          cmnCompanyId: new FormControl(),
          deviceNumber: new FormControl()
        })
      }


      getCompany(){  
        this.gSvc.postdata("Common/Company/GetCompanyByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
          
        }, err => {
          
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

    getDevices(): void {
        //NEW BY ASAD ON 19.12.2023
        this.progressStatus=false;
        // public int? CmnCompanyId { get; set; }
        // public string? DeviceNumber { get; set; }
        console.log(JSON.stringify(this.frm.value));
       var companyId= this.frm.controls['cmnCompanyId'].value;
       if(companyId==null || companyId==0 ||companyId==""||companyId==undefined)
      var test= this.frm.controls['cmnCompanyId'].setValue(this.auth.getCompany());

        this.gSvc.postdata("Inventory/Purchase/GetUnassignDeviceByAnyKey", JSON.stringify(this.frm.value)).subscribe((res: any) => {
        //oLD
        //this.gSvc.postdata("Inventory/Purchase/GetUnassignStockInDeviceByCompanyId?companyId="+this.auth.getCompany(), {}).subscribe((res: any) => {
                this.devices = res;
                this.progressStatus=true;
            },
            (err: any) => {
              this.progressStatus=true;
                this.toastrService.error(err.message);
                console.log('Exception: (getDevices)' +  err.message);
                //this.toastrService.error("Error! Device list not found!");
            }
        );
    }

    reset(): void{
      this.frm.reset();
    }

    exportTExcel() {
        const columnsToExport: any[] = ['productName', 'deviceNumber', 'modelName'];
        this.exportService.exportToExcel(this.devices, 'Unassign_report', columnsToExport);
      }
}
