import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpConfigInterceptor } from "./httpconfig.interceptor";
import { LoadingSpinnerInterceptor } from "./loading-spinner.interceptor";

export const interceptorProviders = 
   [
    
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },  
    { provide: HTTP_INTERCEPTORS, useClass: LoadingSpinnerInterceptor, multi: true },   
];