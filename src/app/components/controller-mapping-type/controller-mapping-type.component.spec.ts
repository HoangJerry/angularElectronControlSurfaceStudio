import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerMappingTypeComponent } from './controller-mapping-type.component';

describe('ControllerMappingTypeComponent', () => {
  let component: ControllerMappingTypeComponent;
  let fixture: ComponentFixture<ControllerMappingTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerMappingTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerMappingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
