import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login1',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  styles: [`
  :host ::ng-deep .pi-eye,
  :host ::ng-deep .pi-eye-slash {
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
  }
`]
})
export class LoginComponent1 implements OnInit  {
  valCheck: string[] = ['remember'];
  password!: string;
  loginForm = new FormGroup({
    username: new FormControl('101'),
    userPassword: new FormControl('123'),
  });

  constructor(private router:Router,private auth: AuthService, public layoutService: LayoutService,private toastrService: ToastrService) 
  { }
  
  ngOnInit(): void {
   
  };

  onSubmit(): void {
    //this.router.navigate(['/admin']);
   // this.toastrService.success("successfull");
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(
        (result:any) => {        
          //console.log(result);
          if(result !=undefined && result.userId>0)
          {
          this.auth.setToken(result.token);
          this.auth.setRole(result.roleId);
          this.auth.setCompany(result.companyId);
          this.auth.setUserId(result.userId);
          this.auth.setUserName(result.userName);
         
         this.router.navigate(['/home/dashboard/msodashboard']);
          }else{
            this.toastrService.warning("Incorrect User ID or Password");
          }
        },
        (err: Error) => {
          this.toastrService.error("Error! internal problem");
        }
      );
    }
  };
}
