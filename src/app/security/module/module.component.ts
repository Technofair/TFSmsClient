import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
  providers: [ConfirmationService]
})
export class ModuleComponent {

  appmodulelist: any;

  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  progressStatus=true;
  constructor(private fb: FormBuilder, private gSvc: GeneralService, private toastrService: ToastrService, private router: Router, private confirmationService: ConfirmationService) {
    this.getAppModuleList();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    name: new FormControl(""),
    icon: new FormControl(""),
    isActive: new FormControl(true),
  })

  ngOnInit(): void {

    this.frm = this.fb.group({
      id: ["0"],
      name: ["", [Validators.required]],
      icon: [""],
      isActive: [true]
    });
    this.getAppModuleList();
  }

  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        if (this.formId == 0) {
          this.gSvc.postdata("Security/Menu/AddModule", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.getAppModuleList();
            this.toastrService.success("Saved");
          }, err => {
            this.toastrService.error("Error! Not Saved");
          })
        } else if (this.formId == 1) {
          this.gSvc.postdata("Security/Menu/UpdateModule", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.formId = 0;
            this.getAppModuleList();
            this.toastrService.success("Updated");
          }, err => {
            this.toastrService.error("Error! Not updated");
          })
        } else {
          this.toastrService.error("System error!");
        }
        return true;
      },
      reject: () => {

      }
    })


    return false;
  }

  getAppModuleList() {
    this.progressStatus=false;
    this.gSvc.postdata("Security/Menu/Modules", {}).subscribe(res => {
      this.appmodulelist = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("Error! List not found");
    })

  }

  edit(id: any) {
    this.formId = 1;
    this.gSvc.postdata("Security/Menu/GetModuleById?id=" + id + "", {}).subscribe((res: any) => {
      this.frm.reset();
      this.frm.patchValue(res);

    }, err => {
      this.toastrService.error("Error! Not found");
    })
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("Security/Menu/Module/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/admin/appmodules')
  }
  reset() { this.formId = 0; this.frm.reset(); this.frm.controls['id'].setValue(0), this.frm.pristine; }
  clear(table: any) {
    table.clear();
  }
}
