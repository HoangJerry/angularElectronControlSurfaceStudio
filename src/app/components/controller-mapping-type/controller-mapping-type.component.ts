import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Mode } from '../../models/controller-mode.model';
import { ControllerService } from '../../services/controller.service';
import { MidiControllerComponent } from '../midi-controller/midi-controller.component'
import { Router } from '@angular/router';

@Component({
  providers:[MidiControllerComponent],
  selector: 'app-controller-mapping-type',
  templateUrl: './controller-mapping-type.component.html',
  styleUrls: ['./controller-mapping-type.component.scss']
})
export class ControllerMappingTypeComponent implements OnInit {
  @Input() 
  set selectedData(name){
    this.selected=name;
    this.onClickInput();
    if (this.selected.type.type=='Button'||this.selected.type.type=='Pad'||this.selected.type.type=='Key'){
      this.selectControlType = ["On/Off"]
    }
    else{
      this.selectControlType = ["Absolute","Relative"]
    }

    if (this.selected.type.type=='Knob'||
        this.selected.type.type=='Encoder'||
        this.selected.type.type=='Slider'||
        this.selected.type.type=='Crossfader'||
        this.selected.type.type=='Button'){
            if (this.selected.MIDI_type==null){
                this.selected.MIDI_type=this.selectMIDITypes[0];
            }
            if (this.selected.MIDI_channel==null){
                this.selected.MIDI_channel=this.selectMIDIChannels[0];
            }
            if (this.selected.MIDI_value==null){
                this.selected.MIDI_value=this.selectMIDIValues[0];
            }
            if (this.selected.control_type==null){
              this.selected.control_type = this.selectControlType[0];
              this.selected.control_type_takeover_mode = this.selectTakeoverMode[0];
            }
            if (this.selected.control_type=="On/Off"&&this.selected.control_type_on==undefined){
                this.selected.control_type_on=127
                this.selected.control_type_off=0
            }
            if (this.selected.control_type=="Absolute"&&this.selected.control_type_first==undefined){
              this.selected.control_type_first=1
              this.selected.control_type_last=127
              this.selected.control_type_reverse_mode="Off"
              this.selected.control_type_takeover_mode="None"
            }
    }
    this.onChangeName();
  };

  selectedtemp : any;
  MIDItemp :any;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  @Output() changeController: EventEmitter<any> =   new EventEmitter();

  selected: any;
  selectMIDITypes = ["CC","Note"];
  selectTakeoverMode = ["None","Pickup","Value scaling"]
  selectMIDIChannels = Array.from(new Array(16),(val,index)=>index+1);
  selectMIDIValues = Array.from(Array(128).keys());
  selectControlType :any;

  constructor(private controllerService:ControllerService,
              private changeDetectorRef: ChangeDetectorRef,
              private midi: MidiControllerComponent,
              private router: Router) {
  }

  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.selected));
  }

  onChangeName = (script_id?) => {
    if (this.selected.control_type=="Relative"&&this.selected.control_type_left==null){
      this.selected.control_type_left=45
      this.selected.control_type_right=85
      this.selected.control_type_steps=50
    }
    if (this.selectedtemp!=this.selected && this.selected.name) {
		  this.changeSelected.emit(this.selected);
    }
  }
  
  onChangeSelected = (change) => {
    this.selected = change;
    this.onChangeName()
  }
  onchangeController = (change) =>{
    this.changeController.emit(change);
  }

  ngOnInit() {
    this.controllerService.currentMIDI
      .subscribe(controller => {
        if (controller!=undefined){
          this.MIDItemp = controller;
          this.selected.MIDI_type = this.MIDItemp.type;
          this.selected.MIDI_channel = this.MIDItemp.channel;
          this.selected.MIDI_value = this.MIDItemp.value;
          this.onChangeName()
        }
      });
  }

}
