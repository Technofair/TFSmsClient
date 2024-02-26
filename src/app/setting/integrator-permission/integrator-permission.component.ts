import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { IntegratorPermission } from 'src/app/model/integrator-permission';
import { Integrator } from 'src/app/model/integrator';
import { Company } from 'src/app/model/company';

@Component({
  selector: 'app-integrator-permission',
  templateUrl: './integrator-permission.component.html',
  styleUrls: ['./integrator-permission.component.css'],
  providers: [ConfirmationService]
})
export class IntegratorPermissionComponent implements OnInit {
  integrators: Integrator[] = [];
  selectedIntegrators: Integrator[] = [];
  companies: Company[] = [];
  integratorPermissions: IntegratorPermission[] = [];
  frm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private auth: AuthService, private toastrService: ToastrService, private route: ActivatedRoute) {
    this.frm = this.fb.group({
      companyId: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getCompany();
    this.getIntegrator();
  }

  save() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.frm.invalid) {
          this.toastrService.error("Please select a company.");
          return false;
        }

        const permissions: IntegratorPermission[] = this.selectedIntegrators.map(integrator => this.createIntegratorPermission(integrator));

        let reqestbody = {
          companyId: this.frm.get("companyId")?.value,
          list: permissions,
        }

        this.gSvc.postdata("Common/IntegratorPermission/Save", JSON.stringify(reqestbody)).subscribe(res => {
          console.log(this.frm.value);
          this.reset();
          this.toastrService.success("Successful");
        }, err => {
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return true;
  }

  getCompany() {
    this.gSvc.postdata("Common/Company/GetAll", {}).subscribe(res => {
      this.companies = res;
      var com=this.companies.filter(x=>x.cmnCompanyTypeId==1);
      this.companies=com;
    }, err => {
      this.toastrService.error("Error! Company List not found ");
    })
  }

  getIntegrator() {
    debugger
    this.gSvc.postdata("Common/Integrator/GetAll", {}).subscribe(res => {
      this.integrators = res;
    }, err => {
      this.toastrService.error("Error! Integrator not found");
    })
  }

  getPermissionByCompanyId() {
    if(!this.frm.get("companyId")?.value) {
      this.selectedIntegrators = [];
      this.toastrService.error("Please select a company");
      return;
    }
    this.gSvc.postdata("Common/IntegratorPermission/GetByCompanyId/" + this.frm.get("companyId")?.value, {}).subscribe(res => {
      this.integratorPermissions = res;
      this.selectedIntegrators = this.integrators.filter(integrator => this.integratorPermissions.some(permission => permission.cmnIntegratorId === integrator.id));
    }, err => {
      this.toastrService.error("Integrator mot found");
    })
  }

  reload() {
    this.router.navigateByUrl('/home/setting/intregationpermission')
  }

  clear(table: Table) {
    table.clear();
  }

  reset() {
    this.frm.reset();
    this.selectedIntegrators = [];
    this.frm.markAsPristine();
  }

  private createIntegratorPermission(integrator: Integrator): IntegratorPermission {
    let permission = this.integratorPermissions.find(p => p.cmnIntegratorId === integrator.id);
    if (permission) {
      permission.modifiedBy = this.auth.getUserId();
      permission.modifiedDate = new Date();
    } else {
      permission = {
        id: 0,
        cmnIntegratorId: integrator.id,
        cmnCompanyId: this.frm.get("companyId")?.value,
        isActive: true,
        createdBy: this.auth.getUserId(),
        createdDate: new Date(),
      };
    }
    
    return permission;
  }
}