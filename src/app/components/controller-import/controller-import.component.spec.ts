import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerImportComponent } from './controller-import.component';

describe('ControllerImportComponent', () => {
  let component: ControllerImportComponent;
  let fixture: ComponentFixture<ControllerImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
