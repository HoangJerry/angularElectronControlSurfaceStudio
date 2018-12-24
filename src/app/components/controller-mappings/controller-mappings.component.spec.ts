import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerMappingsComponent } from './controller-mappings.component';

describe('ControllerMappingsComponent', () => {
  let component: ControllerMappingsComponent;
  let fixture: ComponentFixture<ControllerMappingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerMappingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
