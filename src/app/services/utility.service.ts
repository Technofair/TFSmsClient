// import { AppSettings } from '../app.settings';
// import { Settings } from '../app.settings.model';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class Utility {
    //public settings: Settings;
    public trustedUrl!: SafeUrl;

    public monthArray: any = [
        { monthId: "01", monthName: 'January' }
        , { monthId: "02", monthName: 'February' }
        , { monthId: "03", monthName: 'March' }
        , { monthId: "04", monthName: 'April' }
        , { monthId: "05", monthName: 'May' }
        , { monthId: "06", monthName: 'June' }
        , { monthId: "07", monthName: 'July' }
        , { monthId: "08", monthName: 'August' }
        , { monthId: "09", monthName: 'September' }
        , { monthId: "10", monthName: 'October' }
        , { monthId: "11", monthName: 'November' }
        , { monthId: "12", monthName: 'December' }
    ];

    public months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public days: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(
        // public appSettings: AppSettings, 
        private _domSanitizer: DomSanitizer
    ) {
        // this.settings = this.appSettings.settings; 
    }

    JsonStringify(models: any): string {
        var smodel = '';
        if (models.length !== undefined) {
            if (models.length > 1) {
                for (var i = 0; i < models.length; i++) {
                    if (i == 0) {
                        smodel += "[" + JSON.stringify(models[i]) + ",";
                    }
                    else if (i == (models.length - 1)) {
                        smodel += JSON.stringify(models[i]) + "]";
                    }
                    else {
                        smodel += JSON.stringify(models[i]) + ",";
                    }
                }
            }
            else {
                smodel = "[" + JSON.stringify(models[0]) + "]";
            }
        }
        else {
            smodel = "[" + JSON.stringify(models) + "]";
        }
        return smodel;
    }

    SetUntouchPristine(form: any) {
        form.markAsUntouched();
        form.markAsPristine();
    }
    previousDay(data:any){
        var date = new Date();
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + data)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return Nowdate;
    }
    Today() {
        var date = new Date();
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return Nowdate;
    }

    firstDayOfMonth() {
        let date = new Date();
        date.setDate(1);
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return Nowdate;
    }

    lastDayOfMonth() {
        let date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return Nowdate;
    }

    preMonthDay() {
        var date = new Date();
        date.setMonth(date.getMonth() - 1);     
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return Nowdate;
    }
    nextMonthDay(vale:any) {
        var date = new Date();
        date.setMonth(date.getMonth() + vale);     
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        return Nowdate;
    }

    TodayWithHourMinuteSecondMiliseconds() {
        var date = new Date();
        var Nowdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + '-' + ('0' + date.getHours()).slice(-2) + '-' + ('0' + date.getMinutes()).slice(-2) + '-' + ('0' + date.getSeconds()).slice(-2) + '-' + ('0' + date.getMilliseconds()).slice(-2);
        return Nowdate;
    }

    TodayYear() {
        var date = new Date();
        return date.getFullYear();
    }

    TodayMonth() {
        var date = new Date();
        return ('0' + (date.getMonth() + 1)).slice(-2);
    }

    TodayHHmmss() {
        var date = new Date();
        var nowDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var nowTime = ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        return nowDate + 'T' + nowTime;
    }

    TodayHHmm() {
        var date = new Date();
        var nowDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var nowTime = ('0' + (date.getHours())).slice(-2) + ':' + ('0' + (date.getMinutes())).slice(-2);
        return nowDate + 'T' + nowTime;
    }

    AddDayMonthYear(date: any, day: number, month: number, year: number) {
        var ndate = new Date(date);
        var incYear = new Date(ndate.setFullYear(ndate.getFullYear() + year));
        var incMonth = new Date(incYear.setMonth(incYear.getMonth() + month));
        var incdate = new Date(incMonth.setDate(incMonth.getDate() + day));
        var newdate = incdate.getFullYear() + '-' + ('0' + (incdate.getMonth() + 1)).slice(-2) + '-' + ('0' + incdate.getDate()).slice(-2);
        return newdate;
    }

    DeductDayMonthYear(date: any, day: number, month: number, year: number) {
        var ndate = new Date(date);
        var incYear = new Date(ndate.setFullYear(ndate.getFullYear() - year));
        var incMonth = new Date(incYear.setMonth(incYear.getMonth() - month));
        var incdate = new Date(incMonth.setDate((incMonth.getDate()) - day));
        var newdate = incdate.getFullYear() + '-' + ('0' + (incdate.getMonth() + 1)).slice(-2) + '-' + ('0' + incdate.getDate()).slice(-2);
        return newdate;
    }

    FinancialYearStart() {
        var date = new Date();
        var Nowdate = date.getFullYear() + '-' + '04' + '-' + '01';
        return Nowdate;
    }

    FinancialYearEnd() {
        var date = new Date();
        var Nowdate = (date.getFullYear() + 1) + '-' + '03' + '-' + '31';
        return Nowdate;
    }

    GetAWeekDay(inputDate: string) {
        var fulldate = new Date(inputDate);
        var dayName = this.days[fulldate.getDay()];
        return dayName;
    }

    GetAMonthName(inputDate: string) {
        var fulldate = new Date(inputDate);
        var MonthName = this.months[fulldate.getMonth()];
        return MonthName;
    }

    getAllMonths() {
        return this.monthArray;
    }

    getSessionYears() {
        var currentYear = new Date().getFullYear();
        return [{ yearId: currentYear.toString() }, { yearId: (currentYear - 1).toString() }];
    }

    DateConvert(dateTime: any) {
        var rdt = null;
        if (dateTime != undefined) {
            rdt = dateTime.split('T');
        }

        return dateTime != undefined ? rdt[0] : '';
    }

    TimeConvert(dateTime: any) {
        var rdt = null;
        if (dateTime != undefined) {
            rdt = dateTime.split('T');
        }
        return dateTime != undefined ? rdt[1] : '';
    }

    convertTime24to12Capital(time: any) {
        var displayTime = '';
        if (time != "") {
            var hours = time.split(":")[0];
            var minutes = time.split(":")[1];
            var suffix = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            hours = hours < 10 ? "0" + hours : hours;
            displayTime = hours + ":" + minutes + " " + suffix;
        }

        return displayTime;
    }

    convertUniversalUtcToLocalTime(DateTime: any) {

        var dateTimeNew = null;
        var newDatePart = null;
        var newTimePart = null;
        if (DateTime == '1900-01-01T00:00:00') {
            return "";
        }
        if (DateTime == '') {
            return "";
        }
        if (DateTime != undefined) {
            var dt = null;
            if (DateTime.includes('T')) {
                var newDate = DateTime.split('T');
                newDatePart = newDate[0];
                newTimePart = newDate[1];
                DateTime = newDatePart + ' ' + newTimePart;
            }
            dt = new Date(DateTime);
            dt.setHours(dt.getHours() + 6);//convert to local by minus 6 hours from Otc

            var resultedDate = dt.toLocaleDateString();
            var resultedDateTime = dt.toLocaleTimeString();
            dateTimeNew = resultedDate + ' ' + this.convertTime24to12Capital(resultedDateTime);
        }
        return dateTimeNew;
    }

    convertLocalUtcToLocalTime(DateTime: any) {

        var dateTimeNew = null;
        var newDatePart = null;
        var newTimePart = null;
        if (DateTime == '1900-01-01T00:00:00') {
            return "";
        }
        if (DateTime == '') {
            return "";
        }
        if (DateTime != undefined) {
            var dt = null;
            if (DateTime.includes('T')) {
                var newDate = DateTime.split('T');
                newDatePart = newDate[0];
                newTimePart = newDate[1];
                DateTime = newDatePart + ' ' + newTimePart;
            }
            dt = new Date(DateTime);


            var resultedDate = dt.toLocaleDateString();
            var resultedDateTime = dt.toLocaleTimeString();
            dateTimeNew = resultedDate + ' ' + this.convertTime24to12Capital(resultedDateTime);
        }
        return dateTimeNew;
    }

    DateWithAM_PM(dateTime: any) {
        var result = '';
        if (dateTime === '0001-01-01T00:00:00' || dateTime === undefined || dateTime === null || dateTime === '') {
            result = '';
        }
        else {
            var date = this.DateConvert(dateTime);
            var time = this.TimeConvert(dateTime);
            var TimeWithAM_PM = this.convertTime24to12Capital(time);
            result = date + ' ' + TimeWithAM_PM;
        }
        return result;
    }

    Focus(elementId: string) {
        $('#' + elementId + '').focus();
    }

    Focus_Delay(elementId: string, time: number) {
        setTimeout(() => { $('#' + elementId + '').focus(); }, time);
    }

    ModalFocus(modalid: string, elementId: string) {
        $('#' + modalid + '').on('shown.bs.modal', () => {
            $(this).find('#' + elementId + '').focus();
        });
    }

    ModalFocusWithBackColor(modalid: string, elementId: string, color: string) {
        $('#' + modalid + '').on('shown.bs.modal', function () {
            $('#' + elementId + '').focus();
            $('#' + elementId + '').css({ backgroundColor: color });
        });
    }

    FocusWithBackColor(elementId: string, color: string) {
        $('#' + elementId + '').focus();
        $('#' + elementId + '').css({ backgroundColor: color });
    }

    SetBackColor(elementId: string, color: string) {
        $('#' + elementId + '').css({ backgroundColor: color });
    }

    ModalShow(modalid: string) {
        $('#' + modalid + '').modal('show');
    }

    ModalShowAndFocus(modalid: string, elementId: string) {
        //this.ModalShowNoDrop(modalid);
        //this.ModalShow(modalid);
        this.ModalFocus(modalid, elementId);
    }

    ModalShowNoDrop(modalid: string) {
        $('#' + modalid + '').modal({ show: true, backdrop: 'static', keyboard: false });
    }

    ModalShowDelay(modalid: string, time: number) {
        setTimeout(() => {
            $('#' + modalid + '').modal('show');
        }, time);
    }

    ModalHide(modalid: string) {
        $('#' + modalid + '').modal('hide');
    }

    Disable(elementid: string) {
        $('#' + elementid + '').attr("disabled", "disabled");
    }

    Enable(elementid: string) {
        $('#' + elementid + '').removeAttr('disabled');
    }

    Delay_Disable(elementid: string, time: number) {
        setTimeout(() => {
            $('#' + elementid + '').attr("disabled", "disabled");
        }, time);
    }

    Delay_Enalble(elementid: string, time: number) {
        setTimeout(() => {
            $('#' + elementid + '').removeAttr('disabled');
        }, time);
    }

    Disable_con(elementid: string, frstcon: any, scndcon: any) {
        if (frstcon === scndcon) {
            $('#' + elementid + '').attr("disabled", "disabled");
        }
    }

    Enalble_con(elementid: string, frstcon: any, scndcon: any) {
        if (frstcon === scndcon) {
            $('#' + elementid + '').removeAttr('disabled');
        }
    }

    Delay_Disable_con(elementid: string, time: number, frstcon: any, scndcon: any) {
        if (frstcon === scndcon) {
            setTimeout(() => {
                $('#' + elementid + '').attr("disabled", "disabled");
            }, time);
        }
    }

    Delay_Enalble_con(elementid: string, time: number, frstcon: any, scndcon: any) {
        if (frstcon === scndcon) {
            setTimeout(() => {
                $('#' + elementid + '').removeAttr('disabled');
            }, time);
        }
    }

    Checked(elementid: any) {
        $('#' + elementid + '').prop('checked', true);
    }

    UnChecked(elementid: string) {
        $('#' + elementid + '').prop('checked', false);
    }

    // clickfunc(elementid) {
    //     setTimeout(() => {
    //         $(elementid).click();
    //     }, 0);
    // }

    progressInterval(elementId: any, ttlTime: any, width: any) {
        var elem: any = document.getElementById(elementId);
        var intervalTime = (ttlTime / 100);
        var id = setInterval(frame, intervalTime);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width++;
                elem.style.width = width + '%';
                elem.innerHTML = width + '%';
            }
        }
    }

    getCurrentTimeZone() {
        var offset = new Date().getTimezoneOffset();
        var formatted = -(offset / 60);
        return formatted;
    }

    getEndDateTimeString(sdate: any, edate: any) {
        var rdate = '';
        var date = new Date();
        if (edate !== '') {
            if (sdate === edate || edate !== this.Today()) {
                rdate = edate + ' 23:59:59';
            }
            else {
                rdate = edate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            }
        }
        return rdate;
    }

    getStartDateTimeString(sdate: any) {
        var rdate = '';
        var date = new Date();
        if (sdate !== '') {
            if (sdate === this.Today()) {
                rdate = sdate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            }
            else {
                rdate = sdate + ' 23:59:59';
            }
        }
        return rdate;
    }

    setCurrentTimeWithDeliveredDate(dt: any) {
        var rdate = '';
        var date = new Date();
        if (dt !== '') {
            rdate = dt + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        }
        return rdate;
    }

    getCurrentYear() {
        return new Date().getFullYear();
    }

    getCurrentMonth() {
        return new Date().getMonth();
    }

    getYearList(start: any, end: any) {
        var yearList = [{ yearNo: start }];
        var count = (end - start);
        for (var i = 0; i < count; i++) {
            start += 1;
            yearList.push({ yearNo: start })
        }

        return yearList;
    }

    lastDayOfMonthByParam(m: any, y: any) {
        var month = parseInt(m);
        var year = parseInt(y);
        return new Date(year, month, 0).getDate();
    }

    setEndTimeOfDay(date: any) {

        return date + ' 23:59:59';
    }

    setLastDate(d: any, m: any, y: any) {
        return ('0' + m).slice(-2) + '/' + ('0' + d).slice(-2) + '/' + y + ' 23:59:59';
    }

    setLastDateOfMonth(d: any, m: any, y: any) {
        var dd = parseInt(d);
        var mm = parseInt(m);
        var yy = parseInt(y);
        return yy.toString() + '-' + ('0' + mm.toString()).slice(-2) + '-' + ('0' + dd.toString()).slice(-2);
    }

    getCurrentTimeZoneMin() {
        var formatted;
        var offset = new Date().getTimezoneOffset();
        if (offset < 0) {
            formatted = -(offset * 1);
        }
        else {
            formatted = -(offset);
        }
        //var formatted = -(offset / 60);
        return formatted;
    }

    convertUTCtoLocal(utcdate: any) {
        if (utcdate === '1900-01-01T00:00:00') {
            utcdate = undefined;
        }
        var rdate = ''
        if (utcdate !== undefined) {
            var strTZ = 'Z';
            var ifZ = utcdate.includes(strTZ);

            if (!ifZ) {
                utcdate = utcdate.concat(strTZ);
            }

            var date = new Date(utcdate);
            rdate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        }
        return rdate;
    }

    setExpireDate(stdate: string, numday: number) {
        var date = new Date();
        if (this.Today() == stdate) {

        }
        else {

        }
    }

    subtractDateString(endDate: any, startDate: any) {
        var endDateList = endDate.split('-');
        var startDateList = startDate.split('-');
        var eDay = parseInt(endDateList[2]);
        var sDay = parseInt(startDateList[2]);
        var subDay = eDay - sDay;
        return subDay + 1;
    }

    stringToDate(date: any) {
        var rdate = new Date(date.toString())
        return rdate;
    }

    substractDate(dtEx: string, dtSt: string) {
        var exDate = this.stringToDate(dtEx);
        var stDate = this.stringToDate(dtSt);
        var sstDate = new Date(stDate.setDate(stDate.getDate()));
        var Difference_In_Time = exDate.getTime() - sstDate.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days;
    }

    // returns the number of milliseconds since the epoch
    // unix time
    dateTimetoSecond(dateTime: string) {
        return parseInt((new Date(dateTime).getTime() / 1000).toFixed(0));
    }

    timeZones: any = [
        { "gmt": "GMT-12:00", "offsetValue": -12, "timeZone": "(GMT-12:00) Eniwetok, Kwajalein" }
        , { "gmt": "GMT-11:00", "offsetValue": -11, "timeZone": "(GMT-11:00) Midway Island, Samoa" }
        , { "gmt": "GMT-10:00", "offsetValue": -10, "timeZone": "(GMT-10:00) Hawaii" }
        , { "gmt": "GMT-9:00", "offsetValue": -9, "timeZone": "(GMT-9:00) Alaska" }
        , { "gmt": "GMT-8:00", "offsetValue": -8, "timeZone": "(GMT-8:00) Pacific Time (US &amp; Canada)" }
        , { "gmt": "GMT-7:00", "offsetValue": -7, "timeZone": "(GMT-7:00) Mountain Time (US &amp; Canada)" }
        , { "gmt": "GMT-6:00", "offsetValue": -6, "timeZone": "(GMT-6:00) Central Time (US &amp; Canada), Mexico City" }
        , { "gmt": "GMT-5:00", "offsetValue": -5, "timeZone": "(GMT-5:00) Eastern Time (US &amp; Canada), Bogota, Lima" }
        , { "gmt": "GMT-4:00", "offsetValue": -4, "timeZone": "(GMT-4:00) Atlantic Time (Canada), Caracas, La Paz" }
        , { "gmt": "GMT-3:30", "offsetValue": -3.5, "timeZone": "(GMT-3:30) Newfoundland" }
        , { "gmt": "GMT-3:00", "offsetValue": -3, "timeZone": "(GMT-3:00) Brazil, Buenos Aires, Georgetown" }
        , { "gmt": "GMT-2:00", "offsetValue": -2, "timeZone": "(GMT-2:00) Mid-Atlantic" }
        , { "gmt": "GMT-1:00", "offsetValue": -1, "timeZone": "(GMT-1:00) Azores, Cape Verde Islands" }
        , { "gmt": "GMT±0:00", "offsetValue": 0, "timeZone": "(GMT±0:00) Western Europe Time, London, Lisbon, Casablanca" }
        , { "gmt": "GMT+1:00", "offsetValue": 1, "timeZone": "(GMT+1:00) Brussels, Copenhagen, Madrid, Paris" }
        , { "gmt": "GMT+2:00", "offsetValue": 2, "timeZone": "(GMT+2:00) Kaliningrad, South Africa" }
        , { "gmt": "GMT+3:00", "offsetValue": 3, "timeZone": "(GMT+3:00) Baghdad, Riyadh, Moscow, St. Petersburg" }
        , { "gmt": "GMT+3:30", "offsetValue": 3.5, "timeZone": "(GMT+3:30) Tehran" }
        , { "gmt": "GMT+4:00", "offsetValue": 4, "timeZone": "(GMT+4:00) Abu Dhabi, Muscat, Baku, Tbilisi" }
        , { "gmt": "GMT+4:30", "offsetValue": 4.5, "timeZone": "(GMT+4:30) Kabul" }
        , { "gmt": "GMT+5:00", "offsetValue": 5, "timeZone": "(GMT+5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" }
        , { "gmt": "GMT+5:30", "offsetValue": 5.5, "timeZone": "(GMT+5:30) Bombay, Calcutta, Madras, New Delhi" }
        , { "gmt": "GMT+5:45", "offsetValue": 5.75, "timeZone": "(GMT+5:45) Kathmandu" }
        , { "gmt": "GMT+6:00", "offsetValue": 6, "timeZone": "(GMT+6:00) Almaty, Dhaka, Colombo" }
        , { "gmt": "GMT+7:00", "offsetValue": 7, "timeZone": "(GMT+7:00) Bangkok, Hanoi, Jakarta" }
        , { "gmt": "GMT+8:00", "offsetValue": 8, "timeZone": "(GMT+8:00) Beijing, Perth, Singapore, Hong Kong" }
        , { "gmt": "GMT+9:00", "offsetValue": 9, "timeZone": "(GMT+9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" }
        , { "gmt": "GMT+9:30", "offsetValue": 10.5, "timeZone": "(GMT+9:30) Adelaide, Darwin" }
        , { "gmt": "GMT+10:00", "offsetValue": 10, "timeZone": "(GMT+10:00) Eastern Australia, Guam, Vladivostok" }
        , { "gmt": "GMT+11.00", "offsetValue": 11, "timeZone": "(GMT+11.00) Magadan, Solomon Islands, New Caledonia" }
        , { "gmt": "GMT+12.00", "offsetValue": 13, "timeZone": "(GMT+12.00) Auckland, Wellington, Fiji, Kamchatka" }
    ];

    ConvertTo64ToBlobPdf(base64String: any) {
        const byteArray = Uint8Array.from(
            atob(base64String)
                .split('')
                .map(char => char.charCodeAt(0))
        );
        return new Blob([byteArray], { type: 'application/pdf' });
    }

    daysInMonth(anyDateInMonth: any) {
        return new Date(anyDateInMonth.getFullYear(),
            anyDateInMonth.getMonth() + 1,
            0).getDate();
    }

    dateStringRearrange(strDate: any) {
        var nstrDate = strDate.replace('T', ' ').replace('Z', '').replace(' GMT+0000', '');
        return nstrDate;
    }

    commaSeparateDecimal(nom: any) {
        debugger;
        var parts = (+nom).toFixed(2).split(".");
        var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
        return num;
    }

    commaSeparate(nom: any) {
        debugger;
        var num = nom.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        return num;
    }

    removeComma(strNom: any) {
        debugger;
        if (strNom.includes(',')) {
            strNom = strNom.toString().replace(",", "");
        }

        return strNom;
    }

    removeSpace(str: string) {
        //return str.replace(/^\s+/,"");
        return str.replace(/ /g, '');
    }

    getNameToNumDate(strDate: string) {
        debugger;
        var nDate = new Date(strDate);
        var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
        return Nowdate;
        return
    }


    downloadDocument(url: string) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = 'abc';
                link.click();
            })
            .catch(console.error);
    }

    viewDocument(filePath: string) {
        var resize = this.calculateScreen(window.innerWidth, window.innerHeight);
        window.open(filePath, '_blank', 'width=' + resize.innerWidth + ',height=' + resize.innerHeight + ',toolbar=0,scrollbars=0,menubar=0,location=1,left=' + resize.left + ',top=' + resize.top + '');
    }

    viewReport(file: any, FileName: any, windowType: any) {
        file.setProperties({ author: 'Md. Jahangir Alam', creator: 'Md. Jahangir Alam', title: FileName });

        if (windowType == 0) {//windowType:0=='New popup window';
            var resize = this.calculateScreen(window.innerWidth, window.innerHeight);
            window.open(file.output("bloburl"), '_blank', 'width=' + resize.innerWidth + ',height=' + resize.innerHeight + ',toolbar=0,scrollbars=0,menubar=0,location=1,left=' + resize.left + ',top=' + resize.top + '');
        }
        else if (windowType == 1) {//windowType:1=='New window tab';
            window.open(file.output("bloburl"), '_blank');
        }
        else if (windowType == 2) {//windowType:2=='Save document';
            file.save(FileName);
        }

        // this.settings.loadingSpinnerOnAction = false;
    }

    calculateScreen(windowWidth: number, windowHeight: number): {
        innerWidth: number;
        innerHeight: number;
        left: number;
        top: number
    } {
        // declaration
        var innWidth = windowWidth;
        var innHeight = windowHeight;
        var lft = 0;
        var tp = 0;

        // calculation of width and height
        var widthPercent = 0.8; // 80% of window
        var heightPercent = 0.8; // 80% of window
        var width = windowWidth * widthPercent;
        var height = windowHeight * heightPercent;
        innWidth = parseInt(width.toString());
        innHeight = parseInt(height.toString());

        // calculation of left and top
        var leftPercent = 0.1; // 10% of window
        var topPercent = 0.1; // 10% of window
        var innLeft = windowWidth * leftPercent;
        var innTop = windowHeight * topPercent;
        lft = parseInt(innLeft.toString());
        tp = parseInt(innTop.toString());

        return {
            innerWidth: innWidth,
            innerHeight: innHeight,
            left: lft,
            top: tp
        };
    }

    calculateHeight(windowHeight: number, heightPercent: number): {
        innerHeight: number;
    } {
        // declaration
        var innHeight = windowHeight;
        // calculation of width and height
        //var heightPercent = 0.8; // 80% of window
        var height = windowHeight * heightPercent;
        innHeight = parseInt(height.toString());
        return {
            innerHeight: innHeight,
        };
    }

    removeString(strModel: string) {
        var numVal = strModel.replace(/[^0-9\.]+/g, "");
        return parseInt(numVal);
    }

    removeSpChar(strModel: string) {
        var numVal = strModel.replace(/[.]+/g, "");
        numVal = numVal.replace(/[^0-9/,]+/g, ",");
        return numVal;
    }

    removeSpChars(strModel: string) {
        var numVal = strModel.replace(/[ .]+/g, ",");
        numVal = numVal.replace(/,+/g, ', ');
        numVal = numVal.replace(/[^0-9/,-]+/g, "");
        numVal = numVal.replace(/-,/g, "-");
        numVal = numVal.replace(/,-+/g, "-");
        numVal = numVal.replace(/\//g, "~");
        numVal = numVal.replace(/~,/g, "~");
        numVal = numVal.replace(/,~+/g, "~");
        numVal = numVal.replace(/~+/g, "/");
        numVal = numVal.replace(/,+/g, ", ");
        numVal = numVal.replace(/,\s*$/, "");
        return numVal;
    }

    removeDigit() {

    }

    intToEnglish(number: number): any {

        var NS = [
            { value: 10000000, str: "Crore" },
            { value: 100000, str: "Lakh" },
            { value: 1000, str: "Thousand" },
            { value: 100, str: "Hundred" },
            { value: 90, str: "Ninety" },
            { value: 80, str: "Eighty" },
            { value: 70, str: "Seventy" },
            { value: 60, str: "Sixty" },
            { value: 50, str: "Fifty" },
            { value: 40, str: "Forty" },
            { value: 30, str: "Thirty" },
            { value: 20, str: "Twenty" },
            { value: 19, str: "Nineteen" },
            { value: 18, str: "Eighteen" },
            { value: 17, str: "Seventeen" },
            { value: 16, str: "Sixteen" },
            { value: 15, str: "Fifteen" },
            { value: 14, str: "Fourteen" },
            { value: 13, str: "Thirteen" },
            { value: 12, str: "Twelve" },
            { value: 11, str: "Eleven" },
            { value: 10, str: "Ten" },
            { value: 9, str: "Nine" },
            { value: 8, str: "Eight" },
            { value: 7, str: "Seven" },
            { value: 6, str: "Six" },
            { value: 5, str: "Five" },
            { value: 4, str: "Four" },
            { value: 3, str: "Three" },
            { value: 2, str: "Two" },
            { value: 1, str: "One" }
        ];

        var result: string = '';
        for (var n of NS) {
            if (number >= n.value) {
                if (number <= 99) {
                    result += n.str;
                    number -= n.value;
                    if (number > 0) result += ' ';
                } else {
                    var t = Math.floor(number / n.value);
                    // console.log(t);
                    var d = number % n.value;
                    if (d > 0) {
                        return this.intToEnglish(t) + ' ' + n.str + ' ' + this.intToEnglish(d);
                    } else {
                        return this.intToEnglish(t) + ' ' + n.str;
                    }

                }
            }
        }
        return result;
    }

    openReport(dataBytes: any, mimeType: any, filename: any, VSVersion: any, IsModal: boolean) {
        var blobUrl = this.bytesToBlob(dataBytes, mimeType, VSVersion);
        var viewType = this.mimeData('viewType', mimeType, VSVersion)
        if (viewType == 'download') {
            this.downloadReport(blobUrl, filename);
        } else {
            if (IsModal) {
                this.loadReportModal(blobUrl);
            } else {
                this.loadReportTab(blobUrl);
                //this.blobToDataUrl(blobUrl);
            }
        }
    }

    loadReportModal(url: string) {
        var resize = this.calculateScreen(window.innerWidth, window.innerHeight);
        window.open(url, '_blank', 'width=' + resize.innerWidth + ',height=' + resize.innerHeight + ',toolbar=0,scrollbars=0,menubar=0,location=1,left=' + resize.left + ',top=' + resize.top + '');
    }

    loadReportTab(url: string) {
        window.open(url, '_blank');
    }

    blobToDataUrl(blobUrl: any) {
        var xhr = new XMLHttpRequest;
        xhr.responseType = 'blob';

        xhr.onload = function () {
            var recoveredBlob = xhr.response;

            var reader = new FileReader;

            reader.onload = function () {
                var blobAsDataUrl: any = reader.result;
                window.location = blobAsDataUrl;
            };

            reader.readAsDataURL(recoveredBlob);
        };

        xhr.open('GET', blobUrl);
        xhr.send();
    }

    downloadReport(blobUrl: any, filename: string) {
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = blobUrl;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        a.remove();

    }

    openSanitizedReport(dataBytes: any, mimeType: string, VSVersion: string) {
        var blobUrl = this.bytesToBlob(dataBytes, mimeType, VSVersion);
        var sanitizeUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        return sanitizeUrl;
    }

    openSanitizedReportByFile(file: any) {
        var blobUrl = URL.createObjectURL(file);
        var sanitizeUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        return sanitizeUrl;
    }

    openSanitizedReportByUrl(url: any) {
        var sanitizeUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(url);
        return sanitizeUrl;
    }

    bytesToBlob(dataBytes: any, mimeType: string, VSVersion: string) {
        var retUrl = '';
        var contentType = this.mimeData('mimeType', mimeType, VSVersion);
        var binaryString = window.atob(dataBytes);
        var bytes = new Uint8Array(binaryString.length);
        var Bbytes = bytes.map((byte, i) => binaryString.charCodeAt(i));
        var blob = new Blob([Bbytes], { type: contentType });

        retUrl = URL.createObjectURL(blob);

        return retUrl;
    }

    private mimeList19 = [
        { renderType: 'doc', extension: 'doc', mimeType: 'application/msword', viewType: 'download' },
        { renderType: 'docx', extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', viewType: 'download' },
        { renderType: 'xls', extension: 'xls', mimeType: 'application/vnd.ms-excel', viewType: 'download' },
        { renderType: 'xlsx', extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', viewType: 'download' },
        { renderType: 'pdf', extension: 'pdf', mimeType: 'application/pdf', viewType: 'open' },
        { renderType: 'html', extension: 'html', mimeType: 'text/html', viewType: 'open' },
        { renderType: 'image', extension: 'bmp', mimeType: 'image/bmp', viewType: 'open' },
        { renderType: 'image', extension: 'gif', mimeType: 'image/gif', viewType: 'open' },
        { renderType: 'image', extension: 'ico', mimeType: 'image/vnd.microsoft.icon', viewType: 'open' },
        { renderType: 'image', extension: 'jpeg', mimeType: 'image/jpeg', viewType: 'open' },
        { renderType: 'image', extension: 'jpg', mimeType: 'image/jpeg', viewType: 'open' },
        { renderType: 'image', extension: 'png', mimeType: 'image/png', viewType: 'open' }
    ];

    private mimeList22 = [
        { renderType: 'Word', extension: 'doc', mimeType: 'application/msword', viewType: 'download' },
        { renderType: 'Excel', extension: 'xls', mimeType: 'application/vnd.ms-excel', viewType: 'download' },
        { renderType: 'PDF', extension: 'pdf', mimeType: 'application/pdf', viewType: 'open' }
    ];

    mimeData(col: string, value: any, VSVersion: string) {
        var mimeList = 'mimeList' + VSVersion;
        var mimeValue = '';
        var mimeModel = this.mimeList22.filter(x => x.extension == value)[0];
        if (mimeModel != undefined) {
            if (col == 'renderType') {
                mimeValue = mimeModel.renderType;
            } else if (col == 'mimeType') {
                mimeValue = mimeModel.mimeType;
            } else if (col == 'viewType') {
                mimeValue = mimeModel.viewType;
            }
        }
        return mimeValue;
    }

    sanitizeViewClose(reportType: string, VSVersion: string) {
        var isOn = true;
        var viewType = this.mimeData('viewType', reportType, VSVersion)
        if (viewType == 'download') {
            isOn = false;
        }
        return isOn;
    }

    getLandUnit(quantity: number) {
        //var allUnits;
        var thsnd: number = quantity;//In Thousand
        var pcnt: number = thsnd / 100;
        var katha: number = pcnt / 1.5;
        var bigha: number = pcnt / 30;
        var ekr: number = pcnt / 100;

        var allUnits = {
            thsnd: thsnd,
            pcnt: pcnt,
            katha: katha,
            bigha: bigha,
            ekr: ekr
        };

        return allUnits;
    }

    enNumToBnNum(numEn: number) {
        var n = '';
        const numBd: any = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        n = numEn.toString().split("").map(num => numBd[num]).join('');
        return n;
    }

    CaptchaAlphaNumeric() {
        var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        var i;
        for (i = 0; i < 6; i++) {
            var a: any = alpha[Math.floor(Math.random() * alpha.length)];
            var b: any = alpha[Math.floor(Math.random() * alpha.length)];
            var c: any = alpha[Math.floor(Math.random() * alpha.length)];
            var d: any = alpha[Math.floor(Math.random() * alpha.length)];
            var e: any = alpha[Math.floor(Math.random() * alpha.length)];
            var f: any = alpha[Math.floor(Math.random() * alpha.length)];
            var g: any = alpha[Math.floor(Math.random() * alpha.length)];
        }
        var genCaptcha = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
        // document.getElementById("mainCaptcha").innerHTML = code
        // document.getElementById("mainCaptcha").value = code       
        return genCaptcha;
    }

    CaptchaNumeric() {
        var alpha = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        var i;
        for (i = 0; i < 6; i++) {
            var a: any = alpha[Math.floor(Math.random() * alpha.length)];
            var b: any = alpha[Math.floor(Math.random() * alpha.length)];
            var c: any = alpha[Math.floor(Math.random() * alpha.length)];
            var d: any = alpha[Math.floor(Math.random() * alpha.length)];
            var e: any = alpha[Math.floor(Math.random() * alpha.length)];
        }
        var genCaptcha = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e;
        return genCaptcha;
    }

    ValidCaptcha(genCap: string, inCap: string) {
        var string1 = this.removeSpaces(genCap);
        var string2 = this.removeSpaces(inCap);
        if (string1 == string2) {
            return true;
        } else {
            return false;
        }
    }

    removeSpaces(str: string) {
        return str.split(' ').join('');
    }
}