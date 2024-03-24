import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-netid-mapping',
  templateUrl: './netid-mapping.component.html',
  styleUrls: ['./netid-mapping.component.css'],
  providers: [ConfirmationService]
})
export class NetidMappingComponent implements OnInit {

  intregatorList: any;
  networklists: any;
  networklist:any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  serviceList: any;
  frm!: FormGroup;
  companies:any;
  list:any;
  intregatorNetworkMappingList:any;
  progressStatus:any=false;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService) {
    
  }
  ngOnInit(): void {
    this.castypeFrmBuild();
    this.getCompany();
    this.getCompanyIntregatorNetworkMapping();
    this.getIntregatorCompany();
  }

  castypeFrmBuild() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      cmnCompanyId: new FormControl(Validators.required),
      netTypeId: new FormControl(1),
      networkInfoId:new FormControl(Validators.required),
      isActive: new FormControl(true),
      cmnIntegratorId: new FormControl(Validators.required),
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
    });
  }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.gSvc.postdata("Common/CmnCompanyNetworkMapping/Save", JSON.stringify(this.frm.value)).subscribe(res => {            
            this.toastrService.success("Saved success");   
            this.getIntregatorCompany(); 
            this.getCompanyIntregatorNetworkMapping();
            this.join();
            this.reset();
          }, err => {
            this.toastrService.error("Error ! Data is not saved . ");
          })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetClientByCompanyId/" + this.auth.getCompany(), {}).subscribe((res: any) => {
      this.companies = res;
    }, err => {
      this.toastrService.error(err.message);
      // console.log('Exception: (getCompany)' +  err.message);
     // this.toastrService.error("Error! Data Not Found");
    })
  }

//   getnetworklist() {
//     this.gSvc.postdata("Common/CmnCompanyNetworkMapping/GetCompNetMapByCompAndIntgId?cmnCompanyId="+this.auth.getCompany()+'&&cmnIntegratorId='+this.frm.get('cmnIntegratorId')?.value, {}).subscribe(res => {      
//       this.networklist = res;
//     }, err => {
//       this.toastrService.error("Error! Service Type List not found");
//     })
//   }
getnetworklist() {
  if(this.frm.controls['cmnIntegratorId']?.value==null||this.frm.controls['cmnIntegratorId'].value=='undefined'||this.frm.get('netTypeId')?.value==null||this.frm.get('netTypeId')?.value=='undefined' )
    return;
         this.getsyncNet();
         
         this.gSvc.postdata("api/NetworkInfo/GetNetworkInfoByIntegratorId/"+this.auth.getCompany()+'/'+this.frm.get('netTypeId')?.value+'/'+this.frm.get('cmnIntegratorId')?.value, {}).subscribe(res => {      
          this.networklist = res;
        }, err => {
         this.toastrService.error(err.message);
        })
      }
  getsyncNet(){
    if(this.frm.controls['cmnIntegratorId']?.value==null||this.frm.controls['cmnIntegratorId'].value=='undefined'||this.frm.get('netTypeId')?.value==null||this.frm.get('netTypeId')?.value=='undefined' )
    return;
    this.gSvc.postdata("api/NetworkInfo/SyncCasNetworks/"+this.auth.getCompany()+'/'+this.frm.get('netTypeId')?.value+'/'+this.frm.get('cmnIntegratorId')?.value, {}).subscribe(res => {      
      this.networklists = res;
    }, err => {
     this.toastrService.error("Error! Service Type List not found");
    })
  }
  getIntregatorCompany() {
    this.gSvc.postdata("Common/Integrator/GetPermittedIntegratorByCompanyId?cmnCompanyId="+this.auth.getCompany(), {}).subscribe(res => {      
      this.intregatorList = res;
      
    }, err => {
      this.toastrService.error("Error! Intregation Company List not found");
    })
  }
  getCompanyIntregatorNetworkMapping() {
    this.progressStatus=false;
    this.gSvc.postdata("Common/CmnCompanyNetworkMapping/GetAllCompanyNetworkMapping", {}).subscribe(res => {      
      this.intregatorNetworkMappingList = res;
     // this.join();
     this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error(err.message);
    })
  }
  join() {

    var transformedList = this.intregatorNetworkMappingList.map((item: {
      cmnCompanyId: any;
      companyName: any;
      netTypeId: any;
      netTypeName:any;
      cmnIntegratorId: any;
      integratorName:any;
      isActive: any;
      id: any;
    }) => ({
      id: 0,
      cmnCompanyId: item.cmnCompanyId,
      companyName: this.companies.find((companie: { id: number; }) => companie.id == item.cmnCompanyId).name,
      netTypeId: item.netTypeId,
      netTypeName: this.networklist.find((network: { id: number; }) => network.id == item.netTypeId).name,
      cmnIntegratorId: item.cmnIntegratorId,
      integratorName: this.intregatorList.find((intregator: { id: number; }) => intregator.id == item.cmnIntegratorId).name,
      isActive: item.isActive,
    }));
    // debugger;
     this.list = transformedList;
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
    this.getnetworklist(); 
    this.frm.controls['cmnIntegratorId'].setValue(res.cmnIntegratorId); 
  }
  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/intregationcompany')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.formId = 0;
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}