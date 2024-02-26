import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css'],
  providers: [ConfirmationService]
})
export class UserRolesComponent implements OnInit {

  rolesList: any;

  displayModal: boolean = false;
  viewInfo: any = {};

  frm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private Authser: AuthService) {
    this.getRoles();
  }



  ngOnInit(): void {

    this.getRoles();
    this.createForm();
  }
  createForm() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      name: new FormControl("", Validators.required),
      isActive: new FormControl(true, Validators.required),
      // createdBy: new FormControl(101),
      // modifiedBy: new FormControl(101)
      createdBy: new FormControl(this.Authser.getUserId),
      modifiedBy: new FormControl(this.Authser.getUserId)
    });

  }



  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.gSvc.postdata("Security/Role/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.getRoles();
          this.toastrService.success("Saved success");
        }, err => {
          this.toastrService.error("Error ! User role is not saved . ");
        })

      },
      reject: () => {

      }

    })
    return false;
  }

  getRoles() {
    this.gSvc.postdata("Security/Role/GetAll", {}).subscribe(res => {
      this.rolesList = res;
    }, err => {
      this.toastrService.error("error");
    })

  }
  edit(res: any) {

    this.getRoles();
    this.frm.patchValue(res);
    /*this.gSvc.postdata("api/UserRole/UserRole/" + id, {}).subscribe((res: any) => {
      this.frm.patchValue(res);
      //this.frm.controls['name'].setValue(res.name);
      //this.frm.controls['remarks'].setValue(res.remarks);
      //this.frm.controls['id'].setValue(res.id);
    }, err => {
      this.toastrService.error("error");
    }) */
  }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;

  }

  reload() {
    this.router.navigateByUrl('/user/roles')
  }

  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
  clear(table: Table) {
    table.clear();
  }

}
