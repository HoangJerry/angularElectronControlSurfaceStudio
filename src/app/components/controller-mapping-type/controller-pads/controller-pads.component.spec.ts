import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerPadsComponent } from './controller-pads.component';

describe('ControllerPadsComponent', () => {
  let component: ControllerPadsComponent;
  let fixture: ComponentFixture<ControllerPadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerPadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerPadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
