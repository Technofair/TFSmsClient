import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { Observable } from 'Rxjs/Observable';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler.service';
import { catchError } from 'rxjs/operators';
//import { DataTablesResponse } from '../model/datatables.response';

@Injectable({
    providedIn: 'root',
})
export class ApiHttpService {
    private handleError: HandleError;
    baseUrl: string = '';

    constructor(private http: HttpClient,
        httpErrorHandler: HttpErrorHandler) {

         // this.baseUrl = "https://localhost:44387/api/";
          //this.baseUrl = "http://45.115.115.154/BOIMELAAADMINAPI/api/";
       // this.baseUrl = "http://45.115.115.154/DAYTWODAYADMINAPI/api/";
      
        this.handleError = httpErrorHandler.createHandleError('ApiHttpService');
    }
    public GETDATATABLE(url: string, dtParams: any): Observable<any> {
        let dtUrl = this.baseUrl + url;
        return this.http.post<any>(
            dtUrl, dtParams,
            {}
        );
    }

    public GETMATTABLE(url: string, params: any): Observable<any> {
        let uri = this.baseUrl + url;
        return this.http.post<any>(uri, params, {});
    }

    //public GETMATTABLEss(url: string,sort: string, order: string, page: number): Observable<GithubApi> {
    //    const href = 'https://api.github.com/search/issues';
    //    const requestUrl =
    //        `${href}?q=repo:angular/material2&sort=${sort}&order=${order}&page=${page + 1}`;

    //    return this.http.get<GithubApi>(requestUrl);
    //}



    GET(url: string): Observable<any> {
        return this.http.get(this.baseUrl + url, { responseType: 'json' });
    }

    POST(url: string, data: any): Observable<any> {
        return this.http.post(this.baseUrl + url, data, { responseType: 'json' });
    }

    PUT(url: string, data: any): Observable<any> {
        return this.http.put(this.baseUrl + url, data, { responseType: 'json' });
    }

    DELETE(url: string): Observable<any> {
        return this.http.delete(this.baseUrl + url, { responseType: 'json' });
    }

    POSTTODELETE(url: string, data: any[]): Observable<any> {
        return this.http.post(this.baseUrl + url, data, { responseType: 'json' });
    }

    GETRemoteValidation(url: string): Observable<any> {
        return this.http.get(this.baseUrl + url, { responseType: 'json' });
    }
}
