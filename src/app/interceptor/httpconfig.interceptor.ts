import { state } from "@angular/animations";
import { HttpInterceptor, HttpRequest, HttpResponse, HttpEvent, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router, RouterStateSnapshot } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: any = localStorage.getItem('token');
        const isfileupload = sessionStorage.getItem("uploadfile");
        // console.log(this.router.routerState.snapshot);

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }
        if (isfileupload != "1") {
            if (!request.headers.has('content-type')) {
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json; charset=utf-8') });
            }

            request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                }
                return event;

            }));

    }
}
