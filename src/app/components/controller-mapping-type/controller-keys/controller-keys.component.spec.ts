import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerKeysComponent } from './controller-keys.component';

describe('ControllerKeysComponent', () => {
  let component: ControllerKeysComponent;
  let fixture: ComponentFixture<ControllerKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
