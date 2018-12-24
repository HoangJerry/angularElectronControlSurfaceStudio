import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerKnobComponent } from './controller-knob.component';

describe('ControllerKnobComponent', () => {
  let component: ControllerKnobComponent;
  let fixture: ComponentFixture<ControllerKnobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerKnobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerKnobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
