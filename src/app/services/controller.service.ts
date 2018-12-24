import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  MIDI :any
  private messageSource = new BehaviorSubject(this.MIDI);
  currentMIDI = this.messageSource.asObservable();

  constructor() { }


  changeMIDI(message:any) {
    this.messageSource.next(message);
  }
}
