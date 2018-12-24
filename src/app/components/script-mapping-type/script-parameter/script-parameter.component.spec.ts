import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptParameterComponent } from './script-parameter.component';

describe('ScriptParameterComponent', () => {
  let component: ScriptParameterComponent;
  let fixture: ComponentFixture<ScriptParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
