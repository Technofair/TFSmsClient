import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { GeneralService } from 'src/app/services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

interface user {
  id: number;
  name: string;
  isActive: boolean;
}
interface roleUser {
  id: number;
  secUserId: number;
  secRoleId: number;
  isActive: boolean;
  createdBy: number;
  createdDate: Date;
  modifiedBy: number;
  modifiedDate: Date;
}
@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles-mapping.component.html',
  styleUrls: ['./user-roles-mapping.component.css'],
  providers: [ConfirmationService]
})
export class UserRolesMappingComponent implements OnInit {
  frm!: FormGroup;
  roles: any;
  users: any[] = [];
  //companyId: any = 1;
  //userRolesMappingList: any;
  //userMappingList: roleUser[] = [];
  userRoles: any; 
  selectedUsers: any[] = [];
  isCheck :boolean=true;
  activeUserRoles:any []=[];
  inActiveUserRoles:any []=[];
  progressStatus:boolean=true;
  authUserId:any=this.Authser.getUserId();
  constructor(private fb: FormBuilder, private gSvc: GeneralService, private toastrService: ToastrService, private router: Router, private confirmationService: ConfirmationService, private Authser: AuthService) {
  }
  ngOnInit() {
    this.frm = this.fb.group({
      id: new FormControl(0),
      role: new FormControl(0),
      secUserId: new FormControl(0),
      secRoleId: new FormControl(0),
      isActive: new FormControl(true),
      createdBy: new FormControl(this.Authser.getUserId()),
      createdDate: new FormControl(new Date),
      modifiedBy: new FormControl(this.Authser.getUserId()),
      modifiedDate: new FormControl(new Date),
    });
    this.roleList();
    //this.userList();
  }
  toggleItemCheck(user: user): void {
    //user.checked = !user.checked;
  }
  roleList() {
    this.gSvc.postdata("Security/Role/GetAll", {}).subscribe(res => {
      this.roles = res;
    }, err => {
      this.toastrService.error("error");
    })
  }
  userList() {
    this.progressStatus=false;
    this.gSvc.postdata("Security/UserRole/GetUserRolesByCompanyAndRoleId?companyId=" + this.Authser.getCompany()+"&roleId="+ this.frm.get("role")?.value, {})
    .subscribe(res => {     
      this.users = res;
      this.progressStatus=true;
      this.activeUserRoles = this.users.filter((user: {
        secRoleId: any; isActive: any;
       
}) => user.isActive==true && user.secRoleId==this.frm.get("role")?.value);
      this.inActiveUserRoles = this.users.filter((user: {
        secRoleId: any; isActive: any; 
}) => user.isActive==false && user.secRoleId==0);
    }, err => {
      this.progressStatus=true;
      this.toastrService.error("error");
    })
  }

  userRolelist() {
    this.gSvc.postdata("Security/UserRole/GetByRoleId?roleid=" + this.frm.get('role')?.value, {}).subscribe(res => {
      this.userRoles = res;

    }, err => {
      this.toastrService.error("error");
    })
    
     // this.activeUserRoles= this.userRoles.forEach((list: {isActive: string;})=>{list.isActive=='true'});
     //this.inActiveUserRoles= this.userRoles.forEach((list: {isActive: string;})=>{list.isActive=='false'});
  }
  
  save() {
    
    this.selectedUsers=[];
    this.selectedUsers = this.users.filter(user => user.isActive);
    const transformedList = this.selectedUsers.map(item => ({

      id: 0,
      secUserId: item.secUserId,
      secRoleId: this.frm.get("role")?.value,
      isActive: this.frm.get("isActive")?.value,
      createdBy: this.Authser.getUserId(),
      createdDate: new Date(),
      modifiedBy: this.Authser.getUserId(),
      modifiedDate: new Date()
    }));


    if (this.frm.invalid) return false;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        let reqestbody = {
          list: transformedList,
          roleId: this.frm.get("role")?.value,
        }

        this.gSvc.postdata("Security/UserRole/Save", JSON.stringify(reqestbody)).subscribe(res => {
          //this.frm.reset();
          this.userList();
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
  reset() {
    this.router.navigateByUrl('/home/security/userrolesmapping')
    this.frm.reset();
  }
  remove(res: any) {
    if(this.Authser.getRole()== this.frm.get("role")?.value){
      this.toastrService.error("Error ! You can not remove this . ");
      
    }else{          
    this.gSvc.postdata("Security/UserRole/Delete?Id="+res.id,{}).subscribe(res => {
      if(res.Success)
      {
      this.userList();
      this.toastrService.success("Saved success");
      }else{
        this.toastrService.error("Error ! User role is not saved . ");
      }
    }, err => {
      this.toastrService.error("Error ! User role is not saved . ");
    })
    }
    
  }
  selectAll() {
    if(this.isCheck==true){
       this.isCheck=false;
      this.users.forEach(user => (user.isActive = true));
    }else{
      this.isCheck=true;
      this.users.forEach(user => (user.isActive = false));
      
    }
    
    
  }

}
