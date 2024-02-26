import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadCount: number = 0;
  loadState: BehaviorSubject<boolean> = new BehaviorSubject(false);

  showLoader() {
    this.loadCount+=1;
    this.loadState.next(true);
  }

  hideLoader() {

    this.loadState.next(false);
    // this.loadCount = (this.loadCount ? --this.loadCount : 0);
    // if (!this.loadCount) this.loadState.next(false);
  }
}
