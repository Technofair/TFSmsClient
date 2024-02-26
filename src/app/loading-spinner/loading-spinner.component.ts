import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() parent: string = 'default';
  show: boolean = false;
  private readonly destroyed$ = new Subject();

  constructor(private loaderService: LoadingService) { }

  ngOnInit() {
    this.loaderService.loadState
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (this.parent === 'default') this.show = res;
      }, err => {
        this.show = true;
        this.destroyed$.next(true);
        this.destroyed$.unsubscribe();
        this.destroyed$.complete();
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
    this.destroyed$.complete();
  }
}
