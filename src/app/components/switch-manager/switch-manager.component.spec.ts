import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchManagerComponent } from './switch-manager.component';

describe('SwitchManagerComponent', () => {
  let component: SwitchManagerComponent;
  let fixture: ComponentFixture<SwitchManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
