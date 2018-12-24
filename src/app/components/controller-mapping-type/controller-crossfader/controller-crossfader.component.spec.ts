import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerCrossfaderComponent } from './controller-crossfader.component';

describe('ControllerCrossfaderComponent', () => {
  let component: ControllerCrossfaderComponent;
  let fixture: ComponentFixture<ControllerCrossfaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerCrossfaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerCrossfaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
