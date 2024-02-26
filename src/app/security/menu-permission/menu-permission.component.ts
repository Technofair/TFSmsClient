import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Module } from 'src/app/model/module';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MenuPermission } from 'src/app/model/menu-permission';
import { Role } from 'src/app/model/role';
import { GeneralService } from 'src/app/services/general.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rolebase-menu',
  templateUrl: './menu-permission.component.html',
  styleUrls: ['./menu-permission.component.css'],
  providers: [ConfirmationService]
})
export class MenuPermissionComponent {
  roles: Role[] = [];
  modules: Module[] = [];
  roleBaseMenus: MenuPermission[] = [];
  checked: boolean = true;

  filterValue = '';
  displayModal: boolean = false;
  viewInfo: any = {};
  clickRow: boolean = true;
  clickAll: boolean = true;
  clickRead: boolean = true;
  clickAdd: boolean = true;
  clickDelete: boolean = true;
  clickEdit: boolean = true;
  clickPrint: boolean = true;
  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    roleId: new FormControl(""),
    moduleId: new FormControl(""),
    isActive: new FormControl("")
  });

  menuPermissionsForm: FormGroup;

  constructor(private fb: FormBuilder, private gSvc: GeneralService, private toastrService: ToastrService, private confirmationService: ConfirmationService, private authService: AuthService) {
    this.menuPermissionsForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.frm = this.fb.group({
      roleId: ["", [Validators.required]],
      moduleId: ["", [Validators.required]],
      isActive: [true],
      id: ["0"],

    });
    this.getModules();
    this.getRoles();
  }

  save() {

    if (this.frm.invalid) return false;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        let isactive = this.frm.controls['isActive'].value == true ? "Y" : "N";
        this.frm.controls['isActive'].setValue(isactive);


        this.roleBaseMenus.forEach(item => {
          item.secRoleId = this.frm.controls['roleId'].value;
          item.secMenuId = item.id;
          item.createdBy = this.authService.getUserId();
          item.modifiedBy = this.authService.getUserId();
          item.createdDate = new Date();
        });
        // Update role based menu from form input
        const menuPermissionToSave = {
          moduleId: this.frm.controls['moduleId'].value,
          roleId: this.frm.controls['roleId'].value,
          list: this.roleBaseMenus,//.map((item: MenuPermission) => this.updateMenuPermissionObject(item))
        };
        this.gSvc.postdata("Security/MenuPermission/Save", JSON.stringify(menuPermissionToSave)).subscribe(res => {
          if (res == "duplicate") {
            this.toastrService.error("Duplicate!Try again");
          } else {
            this.reset();
            this.toastrService.success("succesfully");
            // this.getRoleBaseMenu();
          }
        }, err => {
          this.toastrService.error("Error! internal server error");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  getRoles() {
    this.gSvc.postdata("Security/Role/GetAll", {}).subscribe(res => {
      this.roles = res;
    }, err => {
      this.toastrService.error("Error");
    })
  }

  getModules() {
    this.gSvc.postdata("Security/Module/GetAll", {}).subscribe(res => {
      this.modules = res;
    }, err => {
      this.toastrService.error("Error");
    })
  }

  getMenuByModuleAndRole() {
    const moduleId = this.frm.controls['moduleId'].value;
    const roleId = this.frm.controls['roleId'].value;
    if (!moduleId || !roleId) {
      this.roleBaseMenus = [];
      this.menuPermissionsForm = this.fb.group({});
      return;
    }

    this.gSvc.postdata("Security/MenuPermission/GetMenuPermissionByUserOrRoleId", { moduleId, roleId }).subscribe(res => {
      this.createMenuPermissionForm(res);
      this.roleBaseMenus = res;
    }, err => {
      this.toastrService.error("Error")
    });
  }

  edit(id: any) {
    // this.getRoleBaseMenu();
    this.gSvc.postdata("api/RolesBaseMenu/RolesBaseMenu/" + id + "", {}).subscribe((res: any) => {

      let role = {
        menuId: res.menuId, roleId: res.roleId.toString(), id: res.id, isActive: res.isActive
      };
      this.frm.patchValue(role);
      //this.frm.controls['menuId'].setValue(res.menuId);
      //this.frm.controls['roleId'].setValue(res.roleId.toString());
      //this.frm.controls['roleId'].setValue("Admin");
      // this.frm.controls['id'].setValue(res.id);
      // this.frm.controls['isActive'].setValue(res.isActive);

    }, err => {
      this.toastrService.error("error");
    })
  }

  status(id: any, status: any) {

    if (status == '0' || status == 0) {
      //   console.log('OKKK');
      // console.log({id});
      // console.log({status});
      this.gSvc.postdata("api/RolesBaseMenu/InActiveMenu/" + id + "", {}).subscribe((res: any) => {
        window.location.reload();
        // this.viewInfo = res;
      }, err => {
        this.toastrService.error("Error! Data Not Found");
      })

    } else {
      this.gSvc.postdata("api/RolesBaseMenu/ActiveMenu/" + id + "", {}).subscribe((res: any) => {
        window.location.reload();
        // this.viewInfo = res;
      }, err => {
        this.toastrService.error("Error! Data Not Found");
      })

    }

  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("api/RolesBaseMenu/RolesBaseMenu/" + id + "", {}).subscribe((res: any) => {
      this.viewInfo = res;
    }, err => {
      this.toastrService.error("Error! Data Not Found");
    })
  }

  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.controls['isActive'].setValue(true);
    this.frm.markAsPristine();
    this.roleBaseMenus = [];
  }

  clear(table: Table) {
    table.clear();
  }

  formFieldNameById(id: number, prefix: 'read' | 'add' | 'edit' | 'delete' | 'print') {
    debugger;
    return prefix + id;
  }

  toMenuPermission(mp: MenuPermission): MenuPermission {
    return mp;
  }

  private createMenuPermissionForm(menuPermissions: MenuPermission[]) {
    this.menuPermissionsForm = this.fb.group({});
    menuPermissions.forEach(menuPermission => {
      this.menuPermissionsForm.addControl(this.formFieldNameById(menuPermission.id, 'read'), this.fb.control(menuPermission.read));
      this.menuPermissionsForm.addControl(this.formFieldNameById(menuPermission.id, 'add'), this.fb.control(menuPermission.add));
      this.menuPermissionsForm.addControl(this.formFieldNameById(menuPermission.id, 'edit'), this.fb.control(menuPermission.edit));
      this.menuPermissionsForm.addControl(this.formFieldNameById(menuPermission.id, 'delete'), this.fb.control(menuPermission.delete));
      this.menuPermissionsForm.addControl(this.formFieldNameById(menuPermission.id, 'print'), this.fb.control(menuPermission.print));
    });
  }

  private updateMenuPermissionObject(menuPermission: MenuPermission): MenuPermission {
    menuPermission.read = this.menuPermissionsForm.controls[this.formFieldNameById(menuPermission.id, 'read')].value;
    menuPermission.add = this.menuPermissionsForm.controls[this.formFieldNameById(menuPermission.id, 'add')].value;
    menuPermission.edit = this.menuPermissionsForm.controls[this.formFieldNameById(menuPermission.id, 'edit')].value;
    menuPermission.delete = this.menuPermissionsForm.controls[this.formFieldNameById(menuPermission.id, 'delete')].value;
    menuPermission.print = this.menuPermissionsForm.controls[this.formFieldNameById(menuPermission.id, 'print')].value;
    menuPermission.secRoleId = this.frm.controls['roleId'].value;
    menuPermission.secMenuId = menuPermission.id;
    menuPermission.createdBy = this.authService.getUserId();
    menuPermission.modifiedBy = this.authService.getUserId();
    menuPermission.createdDate = new Date();
    return menuPermission;
  }
  clickRowCheck(menu: any) {
    if (this.clickRow == true) {
      menu.read = true;
      menu.add = true;
      menu.edit = true;
      menu.delete = true;
      menu.print = true;
      this.clickRow = false
    } else {
      menu.read = false;
      menu.add = false;
      menu.edit = false;
      menu.delete = false;
      menu.print = false;
      this.clickRow = true
    }

  }
  clickAllCheck() {
    debugger
    if (this.clickAll == true) {
      this.clickAll = false;

      this.roleBaseMenus.forEach(menu => (menu.read = true,
        menu.add = true,
        menu.edit = true,
        menu.delete = true,
        menu.print = true));
    } else {
      this.clickAll = true;

      this.roleBaseMenus.forEach(menu => (
        menu.read = false,
        menu.add = false,
        menu.edit = false,
        menu.delete = false,
        menu.print = false
      ));
    }

  }
  clickPrintCheck() {
    if (this.clickPrint == true) {
      this.clickPrint = false;
      this.roleBaseMenus.forEach(menu => (
        menu.print = true));
    } else {
      this.clickPrint = true;
      this.roleBaseMenus.forEach(menu => (
        menu.print = false
      ));
    }
  }
  clickDeleteCheck() {
    if (this.clickDelete == true) {
      this.clickDelete = false;
      this.roleBaseMenus.forEach(menu => (
        menu.delete = true
      ));
    } else {
      this.clickDelete = true;
      this.roleBaseMenus.forEach(menu => (
        menu.delete = false
      ));
    }
  }
  clickEditCheck() {
    if (this.clickEdit == true) {
      this.clickEdit = false;
      this.roleBaseMenus.forEach(menu => (
        menu.edit = true
      ));
    } else {
      this.clickEdit = true;
      this.roleBaseMenus.forEach(menu => (
        menu.edit = false
      ));
    }
  }
  clickAddCheck() {
    if (this.clickAdd == true) {
      this.clickAdd = false;
      this.roleBaseMenus.forEach(menu => (
        menu.add = true
      ));
    } else {
      this.clickAdd = true;
      this.roleBaseMenus.forEach(menu => (
        menu.add = false
      ));
    }
  }
  clickReadCheck() {
    if (this.clickRead == true) {
      this.clickRead = false;
      this.roleBaseMenus.forEach(menu => (
        menu.read = true
      ));
    } else {
      this.clickRead = true;
      this.roleBaseMenus.forEach(menu => (
        menu.read = false
      ));
    }
  }

}
