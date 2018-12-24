import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptModeSelectorComponent } from './script-mode-selector.component';

describe('ScriptModeSelectorComponent', () => {
  let component: ScriptModeSelectorComponent;
  let fixture: ComponentFixture<ScriptModeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptModeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
