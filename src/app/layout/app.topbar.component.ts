import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MegaMenuItem, MenuItem, PrimeNGConfig } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { LayoutService } from "./service/app.layout.service";
import { GeneralService } from '../services/general.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { balanceService } from '../global';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css'],
    providers: [ConfirmationService]//, GlobalSharedService
})
export class AppTopBarComponent {
    languageList!: any[];

    public IsHidden: boolean = true;
    isMobile: boolean = false;

    public gm: any;

    langCode: any = this.auth.getLanguage();

    alternativeUrl: any= './assets/img/default-user.jpg';
    baseUrl:any;
    photoUrl: any;

    @Input() public comBalance: number = 0;

    public userInfo: any = { id: 0, hrmEmployeeId: 0, loginID: '', cmnCompanyId: 0, employeeID: '', levelNo: 0, employeeName: '', companyName: '', companyType: '', photoUrl: '', display: '', isActive: false };
    //items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    screenSize: number = 0;
    constructor(private toastrService: ToastrService
        , private confSvc: ConfirmationService
        , private fb: FormBuilder
        , private router: Router
        , public auth: AuthService
        , private translate: TranslateService
        , private primeNGConfig: PrimeNGConfig
        , public layoutService: LayoutService
        , private gSvc: GeneralService
        , private balService: balanceService
    ) {
                       

        this.balService.currentBalance.subscribe(bal => 
            //this.comBalance = bal
            this.getBalance()
        );
        this.screenSize = window.screen.width;
        if (window.screen.width < 913) { // 768px portrait
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }

        this.languageList = [
            { label: 'English', value: 'en' },
            { label: 'বাংলা', value: 'bn' },
        ];
        this.translate.setDefaultLang(this.langCode);

        this.getUserInfo();
        this.createForm();
    }


    ngOnInit(): void {
        
        this.baseUrl = environment.baseurl;
        this.photoUrl = this.auth.getPhotoUrl();
       
        if(this.photoUrl === 'null' || this.photoUrl === 'undefined' || this.photoUrl === ''){
            this.photoUrl = this.alternativeUrl;
        }
        else{
            this.photoUrl = this.baseUrl + this.auth.getPhotoUrl();
        }
    }


    getUserInfo() {

        var userId = this.auth.getUserId();
        this.gSvc.postdata("Security/User/GetUserInfoById?userId=" + userId, {}).subscribe(res => {

            if (res != null) {
                this.userInfo.id = res.id;
                this.userInfo.hrmEmployeeId = res.hrmEmployeeId;
                this.userInfo.loginID = res.loginID;
                this.userInfo.cmnCompanyId = res.cmnCompanyId;
                this.userInfo.employeeID = res.employeeID;
                this.userInfo.levelNo = res.levelNo;
                this.userInfo.isActive = res.isActive;
                this.userInfo.employeeName = res.employeeName;
                this.userInfo.companyName = res.companyName;
                this.userInfo.companyType = res.companyType;
                this.userInfo.photoUrl = res.photoUrl;
                this.userInfo.display = res.employeeName + ' (' + res.prefix + '-' + res.companyType + ')';
            }
        }, err => {
            //this.toastrService.error("Error! Brand not found");
        });

        //this.getBalance();
    }

    //@ViewChild('balfff') _bal!: ElementRef;
    getBalance() {
        debugger
        this.gSvc.postdata("api/ClientRecharge/GetLastRechargeByClientId?companyId=" + this.auth.getCompany(), {}).subscribe(res => {
            debugger
            if (res != null) {
                this.comBalance = res.balance;
            }
        }, err => {
            //this.toastrService.error("Error! Brand not found");
        })
    }
    changeLange(obj: any) {
        this.getBalance();
        let len = obj.value
        //this.translate.use(len);
        //console.log(obj.value);
        if (this.auth.getLanguage() == 'bn') {
            this.auth.setlanguage('en');

            this.langCode = this.auth.getLanguage();
        } else {
            this.auth.setlanguage('bn');

            this.langCode = this.auth.getLanguage();
        }
        location.reload();

    }

    logout() {

        //this.router.navigate(["login"]);
        this.auth.logout();
        // this.router.navigate(['']);
    }

    menuItems: MenuItem[] = [
        {
            label: 'Change password', icon: 'pi pi-pencil', command: (event: any) => { this.displayModal = true }
        },
        {
            separator: true
        },
        {
            label: 'Logout', icon: 'pi pi-power-off', command: (event: any) => { this.logout(); }
        }
    ];

    @ViewChild('cpmenu') _profileBtn!: any;
    btnClick() {
        debugger;
        setTimeout(() => {
            this._profileBtn.buttonViewChild.nativeElement.click();
        }, 0);
    }
    // selectedItem:any;
    // listItems = [{label: 'fa fa-user', value: 'v1'}, {label: 'fa fa-user-cog', value: 'v2'}];    

    public formId: any;
    public frm!: FormGroup;
    public displayModal: boolean = false;
    changePassword() {
        this.displayModal = true;
        // this.frm = this.fb.group({
        //     newPassword: new FormControl(""),
        //     confirmPassword: new FormControl("")
        // });
    }

    createForm() {
        this.frm = this.fb.group({
            id: new FormControl(0),
            cmnCompanyId: new FormControl(1),
            loginID: new FormControl(""),
            //originalPassword: new FormControl("", Validators.required),
            password: new FormControl(""),
            newPassword: new FormControl("", Validators.required),
            confirmPassword: new FormControl("", Validators.required),
            isActive: true,
            createdBy: new FormControl(),
            modifiedBy: new FormControl(),
            createdDate: new FormControl(new Date()),
            modifiedDate: new FormControl(new Date()),
        });
    }

    onSubmit() {

        if (this.frm.invalid) {
            return;
        }

        var userId: number = this.auth.getUserId();

        let obj = {
            id: this.userInfo.id,
            hrmEmployeeId: this.userInfo.hrmEmployeeId,
            cmnCompanyId: this.userInfo.cmnCompanyId,
            loginID: this.userInfo.loginID,
            password: this.frm.controls['confirmPassword'].value,
            isActive: true,
            originalPassword: this.frm.controls['confirmPassword'].value,
            levelNo: this.userInfo.levelNo,
            createdBy: userId,
            createdDate: new Date(),
            modifiedBy: userId,
            modifiedDate: new Date()
        }

        var param = { userId: userId };
        this.gSvc.postdata_param("Security/User/ChangeUser", obj, param).subscribe(res => {
            if (res.success) {
                this.frm.reset();
                this.toastrService.success("Password Changed Successfully");
                this.displayModal = false;
                //this.auth.logout();
            } else {
                this.toastrService.error("Password Change Error");
            }
        }, err => {
            this.toastrService.error("Password Change Error");
        })
        return true;
    }


    @HostListener('window:resize', [])
    onResize() {
        this.screenSize = window.screen.width;
        if (window.screen.width < 913) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }
}
