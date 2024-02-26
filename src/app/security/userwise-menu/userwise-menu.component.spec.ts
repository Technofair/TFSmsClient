import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwiseMenuComponent } from './userwise-menu.component';

describe('UserwiseMenuComponent', () => {
  let component: UserwiseMenuComponent;
  let fixture: ComponentFixture<UserwiseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserwiseMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserwiseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
