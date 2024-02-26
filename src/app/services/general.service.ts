import { Injectable } from '@angular/core';

//import {environment  } from "../environments/environment";
import { Observable, catchError, map } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Utility } from './utility.service';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public _conversion: any;
  private _domSanitizer!: DomSanitizer;
  searchData(searchQuery: string) {
    throw new Error('Method not implemented.');
  }


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  token: string = "token";

  constructor(private http: HttpClient) {

    this._conversion = new Utility(this._domSanitizer);

  }

  getDivision() {
    return this.http.get(environment.baseurl + "api/GeneralServices/GetDivision");
  }

  getDistrictById(divisionId: any) {
    return this.http.get(environment.baseurl + "api/GeneralServices/GetDistrictById?divisionId=" + divisionId + "");
  }
  getThanaById(districtId: any) {
    return this.http.get(environment.baseurl + "api/GeneralServices/GetUpazilaById?districtId=" + districtId + "");
  }

  getUnionById(thanaId: any) {
    return this.http.get(environment.baseurl + "api/GeneralServices/GetUnionById?upazillaId=" + thanaId + "");
  }

  postdata(apiurl: string, data: any): Observable<any> {
    sessionStorage.setItem("uploadfile", "0");
    return this.http.post(environment.baseurl + apiurl, data);
  }

  postdata_param(apiurl: string, data: any, param: any): Observable<any> {
    sessionStorage.setItem("uploadfile", "0");
    return this.http.post<any>(environment.baseurl + apiurl, data, { params: param });
  }

  postparam(apiurl: string, param: any): Observable<any> {
    sessionStorage.setItem("uploadfile", "0");
    return this.http.post<any>(environment.baseurl + apiurl, {}, { params: param });
  }

  postdatafile(apiurl: string, data: any): Observable<any> {
    sessionStorage.setItem("uploadfile", "1");
    return this.http.post(environment.baseurl + apiurl, data);
  }
  getdata(apiurl: string) {
    return this.http.get(environment.baseurl + apiurl);
  }


  getdata1(apiurl: string) {
    return this.http.get(environment.baseurl + apiurl).toPromise();
  }


  putdata(apiurl: string, data: any) {
    return this.http.put(environment.baseurl + apiurl, data);
  }

  overlay(status: string) {
    if (status == "show") {
      (<HTMLInputElement>document.getElementById("overlay")).style.display = 'block';
    } else {
      (<HTMLInputElement>document.getElementById("overlay")).style.display = 'none';
    }
  }

  postMultipleModel(_apiRout: string, model: any) {
    let body = this._conversion.JsonStringify(model);
    _apiRout = environment.baseurl + _apiRout;
    let _headers = new HttpHeaders();
    _headers = _headers.set('Content-Type', 'application/json; charset=utf-8').append('userId', '0001');;
    return this.http.post(_apiRout, body, { headers: _headers })
      .pipe(map((res: any) => { return res; }))
      .pipe(catchError(this.handleError));
  }

  postMultipleModelForm(_apiRout: string, model: any, formModel:any) {
    let body = this._conversion.JsonStringify(model);
    formModel.append('data', body);          
    _apiRout = environment.baseurl + _apiRout;
    let _headers = new HttpHeaders();
    return this.http.post(_apiRout, formModel, { headers: _headers })
         .pipe(map((res: any) => { return res; }))
         .pipe(catchError(this.handleError));
}

  postForm(_apiRout: string, formModel:any) {
    _apiRout = environment.baseurl + _apiRout;
    let _headers = new HttpHeaders();
    return this.http.post(_apiRout, formModel, { headers: _headers })
         .pipe(map((res: any) => { return res; }))
         .pipe(catchError(this.handleError));
}

  private handleError(error: Response) {
    return (error.toString() || 'Opps!! Server error');
  }
}
