import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Utility } from 'src/app/services/utility.service';

@Component({
  selector: 'app-login',
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
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];
  password!: string;
  genCaptcha: string = '';
  inCaptcha: string = '';
  loginForm = new FormGroup({
    username: new FormControl(''),
    userPassword: new FormControl(''),
  });

  isMobile: boolean = false;
  constructor(
    private router: Router
    , private auth: AuthService
    , public layoutService: LayoutService
    , private toastrService: ToastrService
    , private _util: Utility) { 
      if (window.screen.width < 541) { // 768px portrait
        this.isMobile = true;
    } else {
        this.isMobile = false;
    }
    }

  ngOnInit(): void {

    this.genCaptcha = this._util.CaptchaNumeric();
  };

  onSubmit(): void {
    //this.router.navigate(['/admin']);
    // this.toastrService.success("successfull");
    if (this.loginForm.valid && this._util.ValidCaptcha(this.genCaptcha, this.inCaptcha)) {
      this.auth.login(this.loginForm.value).subscribe(
        (result: any) => {
          //console.log(result);
          if (result != undefined && result.userId > 0) {
            this.auth.setToken(result.token);
            this.auth.setRole(result.roleId);
            
            this.auth.setCompany(result.companyId);
            this.auth.setCompanyTypeShortName(result.companyTypeShortName);
            
            this.auth.setUserId(result.userId);
            this.auth.setPhotoUrl(result.photoUrl);
            this.auth.setView(this.isMobile);
            this.auth.setUserName(result.userName);
            this.auth.setDistrict(result.districtId);
            this.auth.setUpazila(result.upazilaId);
            this.auth.setUnion(result.unionId);

            //New: 11.02.2024 Added By Asad
            this.auth.setAppSetting(result.cmnAppSetting);
            //End

            this.auth.setlanguage('bn');
            this.router.navigate(['/home/dashboard/msodashboard']);
          } else {
            this.toastrService.warning("Incorrect User ID or Password");
          //  this.toastrService.warning(result.message);
          }
        },
        (err: Error) => {
          this.toastrService.error("Error! internal problem");
         // this.toastrService.error(err.message);
        }
      );
    }
  };

  stCap: boolean = false;
  reCaptcha() {
    this.stCap = true;
    setTimeout(() => {
      this.genCaptcha = this._util.CaptchaNumeric();
      this.stCap = false;
    }, 1000);
  }
}
