import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  
  setParentEmail(parentEmail: string): void {
    sessionStorage.setItem('parentEmail', parentEmail);
  }

  getParentEmail(): string | null {
    return sessionStorage.getItem('parentEmail');
  }
  setOldUserName(oldUserName: string): void {
    sessionStorage.setItem('oldUserName', oldUserName);
  }
  
  getOldUserName(): string | null {
    return sessionStorage.getItem('oldUserName');
  }
  setOldPassword(oldPassword: string): void {
    sessionStorage.setItem('oldPassword', oldPassword);
  }
  getOldPassword(): string | null {
    return sessionStorage.getItem('oldPassword');
  }

  setUserName(userName: string): void {
    sessionStorage.setItem('userName', userName);
  }

  getUserName(): string | null {
    return sessionStorage.getItem('userName');
  }

  setUserId(userId: number): void {
    sessionStorage.setItem('userId', userId.toString());
  }

  getUserId(): number {
    return parseInt(sessionStorage.getItem('userId') ?? '0');
  }
  
  setPhotoUrl(photoUrl: string): void {
    sessionStorage.setItem('photoUrl', photoUrl);
  }

  getPhotoUrl(): string | null {
    return sessionStorage.getItem('photoUrl');
  }

  setView(isMobile: boolean): void {
    sessionStorage.setItem('isMobile', isMobile.toString());
  }

  getView(): boolean {
    return sessionStorage.getItem('isMobile')=='true'? true : false;
  }

  setRole(roleId: string): void {
    sessionStorage.setItem('roleId', roleId);
  }

  getRole(): string | null {
    return sessionStorage.getItem('roleId');
  }
  
  setCompany(companyId: string): void {
    sessionStorage.setItem('companyId', companyId);
  }

  getCompany(): string | null {
    return sessionStorage.getItem('companyId');
  }

  setCompanyTypeShortName(companyTypeShortName: string): void {
    sessionStorage.setItem('companyTypeShortName', companyTypeShortName);
  }

  getCompanyTypeShortName(): string | null {
    return sessionStorage.getItem('companyTypeShortName');
  }

  isMso() {
    var shortName = sessionStorage.getItem('companyTypeShortName');
    var status = shortName == "MSO" ? true : false;
    return status;
  }
  isLso() {
    var shortName = sessionStorage.getItem('companyTypeShortName');
    var status = shortName == "LSO" ? true : false;
    return status;
  }
  isSubLso() {
    var shortName = sessionStorage.getItem('companyTypeShortName');
    var status = shortName == "SLSO" ? true : false;
    return status;
  }

  setDistrict(districtId: string): void {
    sessionStorage.setItem('districtId', districtId);
  }

  getDistrict(): string | null {
    return sessionStorage.getItem('districtId');
  }

  setUpazila(upazilaId: string): void {
    sessionStorage.setItem('upazilaId', upazilaId);
  }

  getUpazila(): string | null {
    return sessionStorage.getItem('upazilaId');
  }

  setUnion(unionId: string): void {
    sessionStorage.setItem('unionId', unionId);
  }

  setAppSetting(appSetting: any): void{

    if(appSetting.allowAutoSubscriberNumber){
      sessionStorage.setItem('allowAutoSubscriberNumber', 'YES');
    }
    else{
      sessionStorage.setItem('allowAutoSubscriberNumber', 'NO');
    }

    sessionStorage.setItem('subscriberNumberLength', appSetting.subscriberNumberLength);

    if(appSetting.allowPurchase){
      sessionStorage.setItem('allowPurchase', 'YES');
    }
    else{
      sessionStorage.setItem('allowPurchase', 'NO');
    }

    if(appSetting.allowSale){
      sessionStorage.setItem('allowSale', 'YES');
    }
    else{
      sessionStorage.setItem('allowSale', 'NO');
    }
  }

  allowAutoSubscriberNumber(): boolean{
    var allowAutoSubscriberNumber = sessionStorage.getItem('allowAutoSubscriberNumber');
    return allowAutoSubscriberNumber == 'YES' ? true : false;
  }
  getSubscriberNumberLength(): string | null{
    return sessionStorage.getItem('subscriberNumberLength');
  }
  allowPurchase(): boolean{
    var allowPurchase = sessionStorage.getItem('allowPurchase');
    return allowPurchase == 'YES' ? true : false;
  }
  allowSale(): boolean{
    var allowSale = sessionStorage.getItem('allowSale');
    return allowSale == 'YES' ? true : false;
  }

  getUnion(): string | null {
    return sessionStorage.getItem('unionId');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  setmenuload(islaod: string): void {
    sessionStorage.setItem('isload', islaod);
  }

  getMenuLoad() {
    return sessionStorage.getItem('isload');
  }

  setlanguage(language: string): void {
    sessionStorage.setItem('language', language);
  }
  getLanguage() {
    return sessionStorage.getItem('language');
  }


  isLoggedIn() {
    return !!sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    this.router.navigate(['']);
  }

  login(usercred: any): Observable<any> {
    return this.http.post(environment.baseurl + 'Security/User/Authenticate', usercred);
  }
}
