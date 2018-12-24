import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptSessionBoxComponent } from './script-session-box.component';

describe('ScriptSessionBoxComponent', () => {
  let component: ScriptSessionBoxComponent;
  let fixture: ComponentFixture<ScriptSessionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptSessionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptSessionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
