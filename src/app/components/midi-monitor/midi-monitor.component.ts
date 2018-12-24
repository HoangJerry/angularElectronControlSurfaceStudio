import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { MidiService } from '../../services/midi.service';
import { FileService } from '../../services/file.service';
import { ControllerService } from '../../services/controller.service';
import {throwError} from 'rxjs';
declare var $ :any;

@Component({
  selector: 'app-midi-monitor',
  templateUrl: './midi-monitor.component.html',
  styleUrls: ['./midi-monitor.component.scss']
})

export class MidiMonitorComponent implements OnInit {

  model :any ={};
  isChecked : any;

  btnText :string;

  channel: any;
  type: any;
  value: any;
  velocity: any;

  inputs : any;
  
  constructor(private midiService: MidiService,
              private ref: ChangeDetectorRef,
              private controllerService:ControllerService,
              private fileService : FileService) {
   this.isChecked = false; // currently its set in html to load as false
   this.fileService.isMidi = false;
   this.btnText = 'OFF';
  }

  ngOnInit() {
    this.midiService.turnMidiOn();
    this.midiService.langUpdated.subscribe(
      (lang) => {
        if(lang.data){
            this.model.channel = lang.data[0] & 0xf;
            this.model.channel = this.model.channel+1;

            var cc = lang.data[0] & 0xf0;
            if(cc >= 176 && cc <= 191) {
              this.model.type = 'CC';
            }else if(cc >= 144 && cc < 159) {
              this.model.type = 'Note';
            //128 = note off
            }
            this.model.value = lang.data[1];
            this.model.velocity = lang.data[2];
        }
        if(lang.inputs){
            this.model.inputs = lang.inputs;
        }
        if (!this.ref['destroyed']) {
            this.ref.detectChanges();
        }
        
        
        
        if(this.isChecked == true) {
          // only update the view if midi monitor on/off is trye
          this.channel = this.model.channel;
          this.type = this.model.type;
          this.value = this.model.value;
          this.velocity = this.model.velocity;
          this.inputs = this.model.inputs;
          this.controllerService.changeMIDI(this.model);
        }
      }
    );
  }

   check(e){

   if(this.isChecked){
      this.isChecked = false;
      this.fileService.isMidi = false;
      this.btnText = 'OFF';
    }
    else{
      this.isChecked =true;
      this.fileService.isMidi = true; 
      this.btnText = 'ON'; 
      this.inputs = this.model.inputs;
   }
  }
}
