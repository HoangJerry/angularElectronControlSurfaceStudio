import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerManagerComponent } from './controller-manager.component';

describe('ControllerManagerComponent', () => {
  let component: ControllerManagerComponent;
  let fixture: ComponentFixture<ControllerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
