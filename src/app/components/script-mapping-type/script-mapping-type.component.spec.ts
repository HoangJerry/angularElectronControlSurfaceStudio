import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptMappingTypeComponent } from './script-mapping-type.component';

describe('ScriptMappingTypeComponent', () => {
  let component: ScriptMappingTypeComponent;
  let fixture: ComponentFixture<ScriptMappingTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptMappingTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptMappingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
