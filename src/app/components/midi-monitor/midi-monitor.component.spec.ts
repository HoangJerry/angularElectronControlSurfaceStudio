import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiMonitorComponent } from './midi-monitor.component';

describe('MidiMonitorComponent', () => {
  let component: MidiMonitorComponent;
  let fixture: ComponentFixture<MidiMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
