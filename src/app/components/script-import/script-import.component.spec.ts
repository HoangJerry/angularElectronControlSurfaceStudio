import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptImportComponent } from './script-import.component';

describe('ScriptImportComponent', () => {
  let component: ScriptImportComponent;
  let fixture: ComponentFixture<ScriptImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
