import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-integrator-settings',
  templateUrl: './integrator-settings.component.html',
  styleUrls: ['./integrator-settings.component.css'],

  providers: [ConfirmationService]
})
export class IntegratorSettingsComponent implements OnInit {

  companyList: any;
  configarationList: any;
  intregatorList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  frm!: FormGroup;
  progressStatus:boolean=true;
  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.frm = new FormGroup({
      id: new FormControl([Validators.required]),
      cmnCompanyId: new FormControl([Validators.required]),
      cmnIntegratorId: new FormControl([Validators.required]),
      version: new FormControl([Validators.required]),
      iPAddress: new FormControl([Validators.required]),
      portNo: new FormControl([Validators.required]),
      token: new FormControl([Validators.required]),
      providerID: new FormControl([Validators.required]),
      sMSID: new FormControl([Validators.required]),
      portNo1: new FormControl([Validators.required]),
      networkID: new FormControl([Validators.required]),
      clientIPAddress: new FormControl([Validators.required]),
      destinationID: new FormControl([Validators.required]),
      mOPID: new FormControl([Validators.required]),
      sourceID: new FormControl([Validators.required]),
      userID: new FormControl([Validators.required]),
      password: new FormControl([Validators.required]),
      operatorActiveInterval: new FormControl([Validators.required]),
      isActive: new FormControl([Validators.required]),
      createdBy: new FormControl([Validators.required]),
      createdDate: new FormControl([Validators.required]),
      modifiedBy: new FormControl([Validators.required]),
      modifiedDate: new FormControl([Validators.required])
    })
    this.getCompany();

    //New
    this.getPermittedIntegratorByCompanyId(this.auth.getCompany());
    //Old
    //this.getIntregatorCompany();
  }

  save() {

    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {
          // console.log(this.frm.value);
          // let appmneu={
          //   link:res.link,
          //   title:res.title,
          //   isParents:res.isParents,
          //   parentsId:res.parentsId.toString(),
          //   moduleId:res.moduleId,
          //   icon:res.icon,
          //   isActive:res.isActive=="Y"?true:false,
          //   id:res.id

          // };

          //this.frm.controls['name'].setValue(1);
          this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            console.log(res);
            this.frm.reset();
            this.toastrService.success("Saved success");
          }, err => {
            this.toastrService.error("Error ! Data is not saved . ");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Common/Company/Save", JSON.stringify(this.frm.value)).subscribe(res => {
            this.frm.reset();
            this.toastrService.success("Updated success");
            this.formId == 1;
          }, err => {
            this.toastrService.error("Error ! Data is not updated . ");
          })
        } else {
          this.toastrService.error("Error ! Data is not saved or updated. ");
        }
        return true;
      },
      reject: () => {

      }

    })
    return false;
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
      this.companyList = res;
    }, err => {
      this.toastrService.error("Error! Company List not found ");
    })
  }
 
//New
getPermittedIntegratorByCompanyId(cmnCompanyId: any){
var param = {
  cmnCompanyId: cmnCompanyId
}
this.progressStatus=false;
  this.gSvc.postparam("Common/Integrator/GetPermittedIntegratorByCompanyId", param).subscribe(res => {
    this.intregatorList = res;
    this.progressStatus=true;
  }, err => {
    this.progressStatus=true;
    this.toastrService.error("Error! Intregation Company List not found");
  })
}

//Old
  // getIntregatorCompany() {
  //   this.gSvc.postdata("Common/Integrator/GetAll", {}).subscribe(res => {
  //     console.log(res);
  //     this.intregatorList = res;
  //   }, err => {
  //     this.toastrService.error("Error! Intregation Company List not found");
  //   })
  // }

  edit(res: any) {
    this.formId = 1;
    this.getCompany();
    this.frm.patchValue(res);
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("Common/Company/GetByCompanyId/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/company')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['Id'].setValue(0);
    this.frm.markAsPristine();
  }
}