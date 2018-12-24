import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptParameterBankComponent } from './script-parameter-bank.component';

describe('ScriptParameterBankComponent', () => {
  let component: ScriptParameterBankComponent;
  let fixture: ComponentFixture<ScriptParameterBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptParameterBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptParameterBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
