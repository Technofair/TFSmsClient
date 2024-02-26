import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../loading-spinner/loading.service';

@Injectable()
export class LoadingSpinnerInterceptor implements HttpInterceptor {

  constructor(private _loaderService: LoadingService) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this._loaderService.showLoader();
    return next.handle(request).pipe(
      tap(
        req => { if (req instanceof HttpResponse) { this._loaderService.hideLoader(); } },
        err => { this._loaderService.hideLoader(); }
      )
    );
  }
}
