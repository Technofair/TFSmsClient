import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/general.service';
import { ChartModule } from 'primeng/chart';
import { Router } from '@angular/router';
@Component({
    selector: 'app-mso-dashboard',
    templateUrl: './mso-dashboard.component.html',
    styleUrls: ['./mso-dashboard.component.css']
})
export class MsoDashboardComponent implements OnInit {
    name = 'Angular 4';
    date: any;
    hours: any;
    minutes: any;
    seconds: any;
    currentLocale: any;
    subscriberList: any[] = [];
    data: any;
    options: any;
    activeSubscriber: any[] = [];
    inactiveSubscriber: any[] = [];
    newSubscriber: any[] = [];
    isTwelveHrFormat: boolean = false;
    test: any;
    toastrService: any;

    isMobile: boolean = false;

    constructor(
        private gSvc: GeneralService
        , private auth: AuthService
        , private router: Router) {
        setInterval(() => {
            const currentDate = new Date();
            this.date = currentDate.toLocaleTimeString();
        }, 1000);

        debugger;
        if (window.screen.width < 541) { // 768px portrait
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }
    ngOnInit(): void {
        this.getSubscriberList();
        this.getDeviceList();
        this.getDeviceHistoryList();
        this.chart();
    }
    chart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Today',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40, 30, 100, 300, 200, 150]
                },
                {
                    label: 'TodayDue',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: [28, 48, 40, 19, 86, 27, 90, 20, 10, 5, 12, 100]
                }
            ]
        };
        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }

            }
        };
    }


    // getSubscriberList() {
    //     debugger
    //     var active: any[];
    //     this.gSvc.postdata("api/Subscriber/GetDeviceStatusByParameter", { companyId: this.auth.getCompany() }).subscribe(
    //         (res) => {
    //             this.subscriberList = res;
    //             //this.activeSubscriber= this.subscriberList.forEach((list: {deviceStatus: string;})=>{list.deviceStatus=='true'});
    //             //this.inactiveSubscriber= this.subscriberList.forEach((list: {deviceStatus: string;})=>{list.deviceStatus=='false'});
    //             this.inactiveSubscriber = this.subscriberList.filter(x => x.deviceStatus == false);
    //             this.activeSubscriber = this.subscriberList.filter(x => x.deviceStatus == true);
    //             this.totalSubscribers = this.subscriberList.length; // Set the total subscriber count
    //             this.newSubscriber=[];
    //         },
    //         (err) => {
    //             this.toastrService.error("Error fetching subscriber list");
    //         }
    //     );
    // }

    totalSubscriber: any = 0;
    getSubscriberList() {
        debugger
        this.gSvc.postdata("api/Dashboard/GetSubscriptionInfoByParameter", { companyId: this.auth.getCompany() }).subscribe(
            (res) => {
                this.subscriberList = res;
                this.totalSubscriber = this.subscriberList.length > 0 ? this.subscriberList[0].value : 0;
            },
            (err) => {
                this.toastrService.error("Error fetching subscriber list");
            }
        );
    }

    deviceList: any[] = [];
    totalExDevice: any = 0;
    getDeviceList() {
        debugger
        this.gSvc.postdata("api/Dashboard/GetExpirySubscriberByParameter", { companyId: this.auth.getCompany() }).subscribe(
            (res) => {
                this.deviceList = res;
                this.totalExDevice = this.deviceList.length > 0 ? this.deviceList[0].value : 0;
            },
            (err) => {
                this.toastrService.error("Error fetching subscriber list");
            }
        );
    }

    deviceHistoryList: any[] = [];
    totalDevice: any = 0;
    getDeviceHistoryList() {
        debugger
        this.gSvc.postdata("api/Dashboard/GetDeviceHistoryByParameter", { companyId: this.auth.getCompany() }).subscribe(
            (res) => {
                this.deviceHistoryList = res;
                this.totalDevice = this.deviceHistoryList.length > 0 ? this.deviceHistoryList[0].value : 0;
            },
            (err) => {
                this.toastrService.error("Error fetching subscriber list");
            }
        );
    }

    refreshData() {
        location.reload();
    }

    // onResize(ev: any) {
    //     debugger;
    //     if (window.screen.width < 531) { // 768px portrait
    //         this.isMobileView = true;
    //     } else {
    //         this.isMobileView = false;
    //     }
    // }

    @HostListener('window:resize', [])
    onResize() {
        if (window.screen.width < 541) {
            this.isMobile = true;
        } else {
            this.isMobile = false;
        }
    }

    toUrl: string = '/home/subscription/package-renew'
    goToUrl(item: any, type: string) {
        debugger;
        if (item.name == 'Deactive') {
            var eurl = this.toUrl;
            this.router.navigate([eurl], { queryParams: { trxID: type, urlNam: eurl }, queryParamsHandling: 'merge', skipLocationChange: false });
        }
    }

}
