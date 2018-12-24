import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiKeysComponent } from './midi-keys.component';

describe('MidiKeysComponent', () => {
  let component: MidiKeysComponent;
  let fixture: ComponentFixture<MidiKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
