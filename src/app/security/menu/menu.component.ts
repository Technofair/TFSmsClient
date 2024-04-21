import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  providers: [ConfirmationService]
})
export class MenuComponent {
  menulist: any
  moduleList: any;
 // parentlist: any;
  parentsmenuList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  progressStatus=true;
  frm!:FormGroup;
  parentlist: any = [
    {
      value: '', text: "Select One"
    },
    {
      value: true, text: "Parents"
    },
    {
      value: false, text: "Children"
    }
  ];
  constructor(private fb: FormBuilder, private gSvc: GeneralService, private toastrService: ToastrService, private router: Router, private confirmationService: ConfirmationService, private auth: AuthService) {
    this.getParentsMenu();
    this.getModules();
    this.getMenus();
    this.propulateData();
  }

  

  async ngOnInit(): Promise<void> {

   this.getFrm();
   
    //this.propulateData();
  }
 getFrm(){
  this.frm = this.fb.group({
    id: new FormControl(0),
    titleBn:new FormControl("",Validators.required),
    title: new FormControl("",Validators.required),
    link: new FormControl(""),
    parentMenuId:new FormControl(),
    secModuleId:new FormControl(Validators.required),
    parentSerialNo:new FormControl("",Validators.required),
    childSerialNo:new FormControl("",Validators.required),
    levelNo: new FormControl("",Validators.required),
    isParent: new FormControl(false),
    icon: new FormControl(""),
    isActive: new FormControl(true),
    createdBy:new FormControl(this.auth.getUserId()),
    createdDate:new FormControl(new Date),
    isModule:new FormControl(false),
  });
 }
  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.frm.controls['createdBy'].setValue(this.auth.getUserId());
        console.log(JSON.stringify(this.frm.value));
          this.gSvc.postdata("Security/Menu/AddOrUpdateMenu", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.toastrService.success("succesfully");
            this.getMenus();
            this.getModules();
            this.getParentsMenu();
          }, err => {
            this.toastrService.error("Error! internal server error");
          })
        
        return true;
      },
      reject: () => {

      }
    });

    return false;
  }

  getMenus() {
    this.progressStatus=false;
    this.gSvc.postdata("Security/Menu/GetMenus", {}).subscribe(res => {
      this.menulist = res;
      this.progressStatus=true;
    }, err => {
      this.progressStatus=true;
     // this.toastrService.error("error");
    })
  }

  getModules() {
    this.gSvc.postdata("Security/Menu/Modules", {}).subscribe(res => {
      this.moduleList = res;
    }, err => {
      //this.toastrService.error("Error");
    })
  }


  getParentsMenu() {
    this.gSvc.postdata("Security/Menu/GetParentsMenu", {}).subscribe(res => {
      this.parentsmenuList = res;
    }, err => {
     // this.toastrService.error("Error");
    })
  }

  propulateData() {
    forkJoin([
      this.gSvc.postdata("Security/Menu/Modules", {}),
      this.gSvc.postdata("Security/Menu/GetParentsMenu", {}),
      this.gSvc.postdata("Security/Menu/GetMenus", {})

    ]).subscribe(([Modules, GetParentsMenu, menulist]) => {
      this.moduleList = Modules; this.parentsmenuList = GetParentsMenu; this.menulist = menulist;

    })
  }

  edit(data: any) {
    this.frm.patchValue(data);
    this.frm.controls['isParent'].setValue(data.isParent);
    this.frm.controls['secModuleId'].setValue(data.secModuleId);
    this.frm.controls['parentMenuId'].setValue(data.parentMenuId);
  }

  showModalDialog(id: any) {
    this.displayModal = true;
    this.reset();
    this.gSvc.postdata("Security/Menu/Menu/" + id + "", {}).subscribe((res: any) => {
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
  }
  clear(table: Table) {
    table.clear();
  }
}
