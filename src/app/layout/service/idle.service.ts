import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout = 10 * 60 * 1000; // 10 minutes
  private lastActivity: number;
  private idleTimer: Observable<number>;
  private idleTimerSubscription: Subscription;
  private isIdleSubject: BehaviorSubject<boolean>;

  constructor() {
    this.lastActivity = Date.now();
    this.isIdleSubject = new BehaviorSubject<boolean>(false);

    // Timer to check for user activity every second
    this.idleTimer = timer(0, 1000).pipe(
      map(() => Date.now() - this.lastActivity),
      filter(elapsed => elapsed > this.idleTimeout)
    );

    // Subscribe to the idle timer
    this.idleTimerSubscription = this.idleTimer.subscribe(() => {
      this.isIdleSubject.next(true);
    });
  }

  resetTimer(): void {
    this.lastActivity = Date.now();
    this.isIdleSubject.next(false);
  }

  getIdleState(): Observable<boolean> {
    return this.isIdleSubject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.idleTimerSubscription) {
      this.idleTimerSubscription.unsubscribe();
    }
  }
}











// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class IdleService {

//   constructor() { }
// }
