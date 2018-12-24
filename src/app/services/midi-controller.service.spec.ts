import { TestBed, inject } from '@angular/core/testing';

import { MidiControllerService } from './midi-controller.service';

describe('MidiControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MidiControllerService]
    });
  });

  it('should be created', inject([MidiControllerService], (service: MidiControllerService) => {
    expect(service).toBeTruthy();
  }));
});
