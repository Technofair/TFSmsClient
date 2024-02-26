export class ReportModel {
    reportPath: string;
    reportName: string;
    reportType: string = '';
    reportHeight: number = 500;
    requestFormat: number = 0;
    constructor(reportPath: string, reportName: string, reportHeight?: number, requestFormat?: number) {
        this.reportPath = reportPath;
        this.reportName = reportName;
        this.reportType = this.reportType;
        this.reportHeight = reportHeight == undefined ? this.reportHeight : reportHeight;
        this.requestFormat = requestFormat == undefined ? this.requestFormat : requestFormat;
    }
}