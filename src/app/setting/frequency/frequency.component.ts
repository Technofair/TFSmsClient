import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css'],
  providers: [ConfirmationService]
})
export class FrequencyComponent {
  list: any;
  displayModal: boolean = false;
  viewInfo: any = {};
  formId = 0;
  frm!: FormGroup;
  //organizationList:any;
  //progressStatus: boolean = true; 
  constructor(private fb: FormBuilder,
     private router: Router,
     private confirmationService: ConfirmationService,
     private gSvc: GeneralService,
     private toastrService: ToastrService,
     private auth: AuthService) {

  }

  ngOnInit(): void {   
    this.getFrm();
    this.getFrequency();
  }

  getFrm(){
    this.frm = new FormGroup({
      id: new FormControl(0),      
      name: new FormControl("",Validators.required),      
      createdBy: new FormControl(this.auth.getUserId()),
      createdDate: new FormControl(new Date())      
    });
  }

  save() {
    //this.progressStatus = false;
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        debugger
        console.log(JSON.stringify(this.frm.value));
        this.gSvc.postdata("Common/CmnFrequency/AddCmnFrequency", JSON.stringify(this.frm.value)).subscribe(res => {
          this.getFrm();
          this.getFrequency();
          //this.progressStatus = true;
          this.toastrService.success("Successful");
        }, err => {
          //this.progressStatus = true;
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }
  getFrequency() { 
    this.gSvc.postdata("Common/CmnFrequency/CmnFrequencies", {}).subscribe(res => {
      this.list = res;      
    }, err => {      
      this.toastrService.error("List not found");
    })
  }

  edit(res: any) {
    this.formId = 1;
    this.frm.patchValue(res);
  }

  // delete(id: any) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure that you want to proceed?',
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.gSvc.postdata("Subscription/Broadcaster/Delete/" + id + "", {}).subscribe((res: any) => {
  //         this.frm.patchValue(res);
  //       }, err => {
  //         this.toastrService.error("Delete Error!");
  //       })
  //       return true;
  //     },
  //     reject: () => {
  //     }
  //   })
  //   return false;
  // }

  showModalDialog(res: any) {
    this.displayModal = true;
    this.reset();
    this.viewInfo = res;
  }

  reload() {
    this.formId = 0;
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.getFrm();
  }

}
