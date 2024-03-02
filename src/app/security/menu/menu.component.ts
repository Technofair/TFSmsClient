import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin } from 'rxjs';
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
  parentlist: any;
  parentsmenuList: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  constructor(private fb: FormBuilder, private gSvc: GeneralService, private toastrService: ToastrService, private router: Router, private confirmationService: ConfirmationService) {
    this.getParentsMenu();
    this.getModules();
    this.getMenus();
    this.propulateData();
  }

  frm: FormGroup = new FormGroup({
    id: new FormControl(""),
    title: new FormControl(""),
    link: new FormControl(""),
    isParents: new FormControl(true),
    parentsId: new FormControl(""),
    moduleId: new FormControl(""),
    icon: new FormControl(""),
    // menuLevel: new FormControl(""),
    // parentSeqNo: new FormControl(""),
    // childSeqNo: new FormControl(""),
    isActive: new FormControl(),
  })

  async ngOnInit(): Promise<void> {

    this.frm = this.fb.group({
      title: ["", [Validators.required]],
      link: ["", [Validators.required]],
      moduleId: ["", [Validators.required]],
      icon: [""],
      id: ["0"],
      parentsId: [0],
      isParents: ["", [Validators.required]],
      // menuLevel: ["0"],
      // parentSeqNo: ["0"],
      // childSeqNo: ["0"],
      isActive: [true],
    });

    this.parentlist = [
      {
        value: "", text: ""
      },
      {
        value: "Y", text: "Parents"
      },
      {
        value: "N", text: "Children"
      }
    ]
    this.propulateData();
  }

  save() {

    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.formId == 0) {
          let isactive = this.frm.controls['isActive'].value == true ? "Y" : "N";
          this.frm.controls['isActive'].setValue(isactive)
          this.gSvc.postdata("Security/Menu/AddMenu", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.toastrService.success("succesfully");
            this.getMenus();
            this.getModules();
            this.getParentsMenu();
          }, err => {
            this.toastrService.error("Error! internal server error");
          })
        } else if (this.formId == 1) {
          let isactive = this.frm.controls['isActive'].value == true ? "Y" : "N";
          this.frm.controls['isActive'].setValue(isactive)
          this.gSvc.postdata("Security/Menu/UpdateMenu", JSON.stringify(this.frm.value)).subscribe(res => {
            this.reset();
            this.formId = 0;
            this.toastrService.success("Updated succesfully");
            this.getMenus();
            this.getModules();
            this.getParentsMenu();
          }, err => {
            this.toastrService.error("Error! not updated");
          })
        } else {
          this.toastrService.error("System error!");
        }
        return true;
      },
      reject: () => {

      }
    });

    return false;
  }

  getMenus() {
    this.gSvc.postdata("Security/Menu/GetMenus", {}).subscribe(res => {
      this.menulist = res;
    }, err => {
      this.toastrService.error("error");
    })
  }

  getModules() {
    this.gSvc.postdata("Security/Menu/Modules", {}).subscribe(res => {
      this.moduleList = res;

    }, err => {
      this.toastrService.error("Error");
    })
  }


  getParentsMenu() {
    this.gSvc.postdata("Security/Menu/GetParentsMenu", {}).subscribe(res => {
      this.parentsmenuList = res;

    }, err => {
      this.toastrService.error("Error");
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

  edit(id: any) {

    this.formId = 1;
    this.gSvc.postdata("Security/Menu/GetMenuById?id=" + id + "", {}).subscribe((res: any) => {


      // var filter_array = this.parentsmenuList.filter((x: { value: any; }) => x.value == res.parentsId);
      // const [obj] = filter_array;
      //this.frm.controls['parentsId'].setValue(res.parentsId.toString());
      //  res.parentsId.toString();
      let appmneu = {
        link: res.link,
        title: res.title,
        isParents: res.isParents,
        parentsId: res.parentsId.toString(),
        moduleId: res.moduleId,
        icon: res.icon,
        isActive: res.isActive == "Y" ? true : false,
        id: res.id

      };
      this.frm.patchValue(appmneu);
      //this.frm.controls['title'].setValue(res.title);
      //this.frm.controls['link'].setValue(res.link);
      //this.frm.controls['isParents'].setValue(res.isParents);
      this.frm.controls['parentsId'].setValue(res.parentsId.toString());
      //this.frm.controls['moduleId'].setValue(res.moduleId);
      //this.frm.controls['icon'].setValue(res.icon);
      //this.frm.controls['isActive'].setValue(res.isActive=="Y"?true:false);
      //this.frm.controls['id'].setValue(res.id);
    }, err => {

      this.toastrService.error("edit error");
    })
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
