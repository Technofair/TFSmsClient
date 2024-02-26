import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-integrator-credentials',
  templateUrl: './integrator-credential.component.html',
  styleUrls: ['./integrator-credential.component.css'],
  providers: [ConfirmationService]
})
export class integratorCredentialComponent implements OnInit {

  formId = 0;
  id: any;
  name: any;
  frm!: FormGroup;
  cmnIntegratorId: any;

  constructor(private fb: FormBuilder, private router: Router, private confirmationService: ConfirmationService, private gSvc: GeneralService, private toastrService: ToastrService, private route: ActivatedRoute, private auth: AuthService) {
    
  }

  ngOnInit(): void {

    this.frm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      cmnCompanyId: new FormControl(),
      cmnIntegratorId: new FormControl(),
      integratorName: new FormControl(""),
      version: new FormControl("", [Validators.required]),
      serverIP: new FormControl("", [Validators.required]),
      portNo: new FormControl([Validators.required]),
      token: new FormControl("", [Validators.required]),
      providerID: new FormControl(""),
      sMSID: new FormControl(""),
      portNo1: new FormControl(),
      networkID: new FormControl(),
      clientIPAddress: new FormControl(""),
      destinationID: new FormControl(""),
      mOPID: new FormControl(""),
      sourceID: new FormControl(""),
      userID: new FormControl(""),
      password: new FormControl(""),
      operatorActiveInterval: new FormControl(""),
      isActive: new FormControl(true, [Validators.required]),
      createdBy: new FormControl(),
      createdDate: new FormControl(new Date),
      modifiedBy: new FormControl()
    });
    // this.route.params.subscribe((params: any) => {
    //   if (params.id) {
    //     this.id = params.id;
    //     this.showIntregatorName();
    //   }
    // });
    // this.url = {
    //   id : this.route.snapshot.params['id'],
    //   name : this.route.snapshot.params['name']   
    // };
    // this.route.params.subscribe((param : Params) => {
    //   this.url.id = param['id'];
    //   this.url.name = param['name'];
    // });
    // debugger;
    var href = this.router.url;
    if(href !=undefined)
    var arr=[];
    arr=href.split('/');
    //this.integratorName=arr[arr.length-1];
    this.cmnIntegratorId=arr[arr.length-1];
    //console.log(this.router.url);
    
    this.getIntregatorById();
    
  }

getIntregatorById() {
    this.reset();
    this.gSvc.postdata("Common/Integrator/GetById/"+this.cmnIntegratorId, {}).subscribe((res: any) => {
      this.frm.controls["integratorName"].setValue(res.name);
      this.getCredentialByIntegratorId();
    }, err => {
      this.toastrService.error("Error! Intregator Data Not Found");
    })
  }

getCredentialByIntegratorId() {    
    var obj={companyId: this.auth.getCompany(),integratorId: this.cmnIntegratorId};
    this.gSvc.postdata("Common/IntegratorCredential/GetCredentialByIntegratorId",obj ).subscribe((res: any) => {
      debugger;
      this.frm.patchValue(res);
      //this.frm.controls["integratorName"].setValue(res.name);
      //this.viewIntregator = res;
    }, err => {
      this.toastrService.error("Error! Intregator Data Not Found");
    })
  }


  save() {
    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.frm.controls["cmnIntegratorId"].setValue(this.cmnIntegratorId)
        this.frm.controls["cmnCompanyId"].setValue(this.auth.getCompany())  
        
        if(this.frm.controls['id'].value==0){
          this.frm.controls['createdBy'].setValue(this.auth.getUserId());
          this.frm.controls['createdDate'].setValue(new Date());
          }else if(this.frm.controls['id'].value>0){
            this.frm.controls['modifiedBy'].setValue(this.auth.getUserId());
          }

        console.log(this.frm.value);
        this.gSvc.postdata("Common/IntegratorCredential/Save", JSON.stringify(this.frm.value)).subscribe(res => {
          this.frm.reset();
          this.router.navigate(['/home/setting/integrationsettings']);
          this.toastrService.success("Successful");
        }, err => {
          this.toastrService.error("Error! Data Not Saved.");
        })
        return true;
      },
      reject: () => {
      }
    })
    return false;
  }

  edit(res: any) {
    this.frm.patchValue(res);
  }

  

  reload() {
    this.formId = 0;
    this.router.navigateByUrl('/home/setting/casprovidersetting')
  }
  clear(table: Table) {
    table.clear();
  }
  reset() {
    this.frm.reset();
    this.frm.controls['id'].setValue(0);
    this.frm.markAsPristine();
  }
}