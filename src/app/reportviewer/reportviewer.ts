import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ReportModel } from './reportmodel';
import { Utility } from '../services/utility.service';
import { GeneralService } from '../services/general.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
    selector: 'reportviewer',
    templateUrl: './reportviewer.html',
    styleUrls: ['./reportviewer.scss']
})

export class ReportViewer implements OnInit {
    public trustedUrl: any;
    public trustedUrls: any;
    private VSVersion: string = '22';
    public loadingSpinnerOnAction: boolean = false;
    public isLoaded:boolean=true;
    constructor(
        private _util: Utility,
        private toastrService: ToastrService,
        private gSvc: GeneralService) { }

    ngOnInit(): void {

    }

    public rptModel = new ReportModel('', '');
    public isOn: boolean = false;
    private baseDocType: string = 'pdf';
    public rptType: string = 'pdf';
    private rptUrl: string = '';
    private rptModelArray: any;
    public isDownload: boolean = false;

    private reportTypeList19: any = [{ rndrType: 'pdf', display: 'PDF', icon: '', color: '' }, { rndrType: 'xls', display: 'Excel', icon: '', color: '' }, { rndrType: 'doc', display: 'Word', icon: '', color: '' }];
    private reportTypeList22: any = [{ rndrType: 'pdf', display: 'PDF', icon: '', color: '' }, { rndrType: 'xls', display: 'Excel', icon: '', color: '' }, { rndrType: 'doc', display: 'Word', icon: '', color: '' }];
    private reportTypeListName:string='reportTypeList'+this.VSVersion;
    public reportTypeList: reportType[] = this.reportTypeList22;
    setReportType() {
        this.reportInPageChange(this.rptUrl, this.rptModelArray);
    }    

    reportInPage(reportUrl: string, modelArray: any) {
        this.rptType = this.baseDocType;
        this.rptUrl = reportUrl;
        this.rptModelArray = modelArray;
        this.isDownload = false;
        if(this.rptModel.requestFormat==0){
            this.reportInPages(reportUrl, modelArray);
        }
        else if(this.rptModel.requestFormat==1)
        {
            this.reportInPageParam(reportUrl, modelArray);
        }
    }

    reportInPageChange(reportUrl:string, modelArray:any) {
        if (this.rptType != 'pdf'){
            if(this.rptModel.requestFormat==0){
                this.reportInPages(reportUrl, modelArray);
            }else if(this.rptModel.requestFormat==1)
            {
                this.reportInPageParam(reportUrl, modelArray);
            }
        }
            
    }

    reportInPages(reportUrl: string, modelArray: any[]) {
        this.loadingSpinnerOnAction = true;
        // this.settings.loadingSpinnerOnAction = true;
        this.rptModel.reportType = this._util.mimeData('renderType', this.rptType, this.VSVersion);
        var ModelsArray = []; ModelsArray.push(this.rptModel);
        if (modelArray.length > 0) { modelArray.forEach((model) => { ModelsArray.push(model); }); }
        var apiUrl = reportUrl;
        this.gSvc.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(
                (response) => {
                    debugger;
                    var res = response.resdata;
                    if (res.resstate) {
                        this.trustedUrls = undefined;
                        this.isOn = true;
                        this.isDownload = !this._util.sanitizeViewClose(this.rptType, this.VSVersion) ? true : false;
                        if (this.isDownload) {
                            this.trustedUrls = this._util.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
                            setTimeout(() => { this.isDownload = false; }, 100);
                        }
                        else {
                            this.isLoaded=false;
                            this.trustedUrl = undefined;
                            this.trustedUrl = this._util.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
                        }

                        //setTimeout(() => { this.isOn = this._conversion.sanitizeViewClose(this.rptModel.reportType); }, 100);
                    }
                    else {
                        this.toastrService.warning('No data found!!!');
                        //this._msg.warning('No data found!!!');
                    }

                    this.loadingSpinnerOnAction = false;
                    //this.settings.loadingSpinnerOnAction = false;
                }, error => {
                    console.log(error);
                });
    }

    reportOutPage(reportUrl: string, modelArray: any[], IsModal:boolean) {
        this.loadingSpinnerOnAction = true;
        //this.settings.loadingSpinnerOnAction = true;
        this.rptModel.reportType = this._util.mimeData('renderType', this.rptType, this.VSVersion);
        var ModelsArray = [];
        ModelsArray.push(this.rptModel);
        if (modelArray.length > 0) {
            modelArray.forEach((model) => {
                ModelsArray.push(model);
            });
        }

        var marray=JSON.stringify(ModelsArray);
        var apiUrl = reportUrl;
        this.gSvc.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(
                (response) => {
                    debugger;
                    var res = response.resdata;
                    this.isOn = false;
                    this.trustedUrl = undefined;
                    if (res.resstate) {
                        this.isLoaded=false;
                        var fileName = this.rptModel.reportName + '_' + this._util.TodayWithHourMinuteSecondMiliseconds();;
                        this._util.openReport(res.bytes, this.rptType, fileName, this.VSVersion, IsModal);
                    }
                    else {
                        this.toastrService.warning('No data found!!!');
                    }

                    this.loadingSpinnerOnAction = false;
                    //this.settings.loadingSpinnerOnAction = false;
                }, error => {
                    console.log(error);
                });
    }


    reportInPageParam(reportUrl: string, model:any) {
        this.loadingSpinnerOnAction = true;
        this.rptModel.reportType = this._util.mimeData('renderType', this.rptType, this.VSVersion);
        var apiUrl = reportUrl;
        this.gSvc.postdata_param(apiUrl, model, this.rptModel)
            .subscribe(
                (response) => {
                    debugger;
                    var res = response;
                    if (res.resstate) {
                        this.trustedUrls = undefined;
                        this.isOn = true;
                        this.isDownload = !this._util.sanitizeViewClose(this.rptType, this.VSVersion) ? true : false;
                        if (this.isDownload) {
                            this.trustedUrls = this._util.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
                            setTimeout(() => { this.isDownload = false; }, 100);
                        }
                        else {
                            this.isLoaded=false;
                            this.trustedUrl = undefined;
                            this.trustedUrl = this._util.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
                        }

                        //setTimeout(() => { this.isOn = this._conversion.sanitizeViewClose(this.rptModel.reportType); }, 100);
                    }
                    else {
                        this.toastrService.warning('No data found!!!');
                        //this._msg.warning('No data found!!!');
                    }

                    this.loadingSpinnerOnAction = false;
                    //this.settings.loadingSpinnerOnAction = false;
                }, error => {
                    console.log(error);
                });
    }

}


export interface reportType {
    rndrType: string;
    display: string;
    icon: string;
    color: string;
}




// import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
// import { ReportModel } from './reportmodel';
// import { Utility } from '../services/utility.service';
// import { GeneralService } from '../services/general.service';
// import { ToastrService } from 'ngx-toastr';
// declare var $: any;

// @Component({
//     selector: 'reportviewer',
//     templateUrl: './reportviewer.html',
//     styleUrls: ['./reportviewer.scss']
// })

// export class ReportViewer implements OnInit {
//     public trustedUrl: any;
//     public trustedUrls: any;
//     private VSVersion: string = '22';
//     public loadingSpinnerOnAction: boolean = false;
//     constructor(
//         private _util: Utility,
//         private toastrService: ToastrService,
//         private gSvc: GeneralService) { }

//     ngOnInit(): void {

//     }

//     public rptModel = new ReportModel('', '');
//     public isOn: boolean = false;
//     private baseDocType: string = 'pdf';
//     public rptType: string = 'pdf';
//     private rptUrl: string = '';
//     private rptModelArray: any = [];
//     public isDownload: boolean = false;

//     private reportTypeList19: reportType[] = [{ rndrType: 'pdf', display: 'PDF', icon: '', color: '' }, { rndrType: 'xls', display: 'Excel', icon: '', color: '' }, { rndrType: 'doc', display: 'Word', icon: '', color: '' }];
//     private reportTypeList22: reportType[] = [{ rndrType: 'pdf', display: 'PDF', icon: '', color: '' }, { rndrType: 'xls', display: 'Excel', icon: '', color: '' }, { rndrType: 'doc', display: 'Word', icon: '', color: '' }];
//     private reportTypeListName: string = 'reportTypeList' + this.VSVersion;
//     public reportTypeList: reportType[] = this.reportTypeList22;
//     setReportType() {
//         this.reportInPageChange(this.rptUrl, this.rptModelArray);
//     }

//     reportInPage(reportUrl: string, modelArray: any[]) {
//         this.rptType = this.baseDocType;
//         this.rptUrl = reportUrl;
//         this.rptModelArray = modelArray;
//         this.isDownload = false;
//         this.reportInPages(reportUrl, modelArray);
//     }

//     reportInPageChange(reportUrl: string, modelArray: any) {
//         if (this.rptType != 'pdf')
//             this.reportInPages(reportUrl, modelArray);
//     }

//     reportInPages(reportUrl: string, modelArray: any[]) {
//         this.loadingSpinnerOnAction = true;
//         //this.settings.loadingSpinnerOnAction = true;
//         this.rptModel.reportType = this._util.mimeData('renderType', this.rptType, this.VSVersion);
//         var ModelsArray = []; ModelsArray.push(this.rptModel);
//         if (modelArray.length > 0) { modelArray.forEach((model) => { ModelsArray.push(model); }); }
//         var apiUrl = reportUrl;
//         this.gSvc.postdata(apiUrl, ModelsArray)
//             .subscribe(
//                 (response) => {
//                     debugger;
//                     var res = response.resdata;
//                     if (res.resstate) {
//                         this.trustedUrls = undefined;
//                         this.isOn = true;
//                         this.isDownload = !this._util.sanitizeViewClose(this.rptType, this.VSVersion) ? true : false;
//                         if (this.isDownload) {
//                             this.trustedUrls = this._util.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
//                             setTimeout(() => { this.isDownload = false; }, 100);
//                         }
//                         else {
//                             this.trustedUrl = undefined;
//                             this.trustedUrl = this._util.openSanitizedReport(res.bytes, this.rptType, this.VSVersion);
//                         }

//                         //setTimeout(() => { this.isOn = this._conversion.sanitizeViewClose(this.rptModel.reportType); }, 100);
//                     }
//                     else {
//                         this.toastrService.warning('No data found!!!');
//                     }

//                     this.loadingSpinnerOnAction = false;
//                     //this.settings.loadingSpinnerOnAction = false;
//                 }, error => {
//                     console.log(error);
//                 });
//     }

//     reportOutPage(reportUrl: string, modelArray: any[]) {
//         this.loadingSpinnerOnAction = true;
//         //this.settings.loadingSpinnerOnAction = true;
//         this.rptModel.reportType = this._util.mimeData('renderType', this.rptType, this.VSVersion);
//         var ModelsArray = [];
//         ModelsArray.push(this.rptModel);
//         if (modelArray.length > 0) {
//             modelArray.forEach((model) => {
//                 ModelsArray.push(model);
//             });
//         }
        
//         var marray=JSON.stringify(ModelsArray);
//         var apiUrl = reportUrl;
//         this.gSvc.postdata(apiUrl, marray)
//             .subscribe(
//                 (response) => {
//                     debugger;
//                     var res = response.resdata;
//                     this.isOn = false;
//                     this.trustedUrl = undefined;
//                     if (res.resstate) {
//                         var fileName = this.rptModel.reportName + '_' + this._util.TodayWithHourMinuteSecondMiliseconds();;
//                         this._util.openReport(res.bytes, this.rptType, fileName, this.VSVersion);
//                     }
//                     else {
//                         this.toastrService.warning('No data found!!!');
//                     }

//                     this.loadingSpinnerOnAction = false;
//                     //this.settings.loadingSpinnerOnAction = false;
//                 }, error => {
//                     console.log(error);
//                 });
//     }
// }

// export interface reportType {
//     rndrType: string;
//     display: string;
//     icon: string;
//     color: string;
// }
