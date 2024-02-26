import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-integrator-company',
  templateUrl: './integrator-company.component.html',
  styleUrls: ['./integrator-company.component.css'],
  providers: [ConfirmationService]
})
export class IntegratorCompanyComponent implements OnInit {

  intregatorList: any;
  servicetypeList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  id: any;
  serviceList: any;
  frm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService) {
    this.getServiceType();
  }



  ngOnInit(): void {
    this.castypeFrmBuild();
  }

  castypeFrmBuild() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      name: new FormControl(),
      cmnServiceTypeId: new FormControl(1),
      isActive: new FormControl(true),
      url: new FormControl(""),
      createdBy: new FormControl(1),
      createdDate: new FormControl(new Date()),
      modifiedBy: new FormControl(),
      modifiedDate: new FormControl(),
  
    });
    this.getServiceType();
    this.getIntregatorCompany();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.gSvc.postdata("Common/Integrator/Save", JSON.stringify(this.frm.value)).subscribe(res => {            
            this.toastrService.success("Saved success");   
            this.getIntregatorCompany(); 
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

  getServiceType() {
    this.gSvc.postdata("Common/ServiceType/GetAll", {}).subscribe(res => {      
      this.serviceList = res;
    }, err => {
      this.toastrService.error("Error! Service Type List not found");
    })
  }

  getIntregatorCompany() {
    this.gSvc.postdata("Common/Integrator/GetAll", {}).subscribe(res => {      
      this.intregatorList = res;
    }, err => {
      this.toastrService.error("Error! Intregation Company List not found");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);    
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
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