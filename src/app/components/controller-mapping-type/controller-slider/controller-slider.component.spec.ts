import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerSliderComponent } from './controller-slider.component';

describe('ControllerSliderComponent', () => {
  let component: ControllerSliderComponent;
  let fixture: ComponentFixture<ControllerSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
