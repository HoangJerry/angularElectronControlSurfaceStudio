import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptReactionComponent } from './script-reaction.component';

describe('ScriptReactionComponent', () => {
  let component: ScriptReactionComponent;
  let fixture: ComponentFixture<ScriptReactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptReactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
