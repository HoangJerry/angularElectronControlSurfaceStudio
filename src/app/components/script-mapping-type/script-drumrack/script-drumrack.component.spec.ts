import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptDrumrackComponent } from './script-drumrack.component';

describe('ScriptDrumrackComponent', () => {
  let component: ScriptDrumrackComponent;
  let fixture: ComponentFixture<ScriptDrumrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptDrumrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptDrumrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
