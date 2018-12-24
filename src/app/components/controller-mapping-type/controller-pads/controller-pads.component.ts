import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ElectronService } from '../../../providers/electron.service'
import { FileService } from '../../../services/file.service'
import { MidiControllerService } from '../../../services/midi-controller.service';
import { ControllerManagerComponent } from '../../controller-manager/controller-manager.component'
import { Mode } from '../../../models/controller-mode.model';
@Component({
	providers: [],
  selector: 'app-controller-pads',
  templateUrl: './controller-pads.component.html',
  styleUrls: ['./controller-pads.component.scss']
})
export class ControllerPadsComponent implements OnInit {
  onChangeController = () =>{
    this.pads_names_show = this.pads_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name==null){
        this.selected.name = this.pads_names_show[0].name;
        this.selected.control_pads_width = 12;
        this.selected.control_pads_height = 12;
        this.selected.control_pads_left = 8;
        this.selected.control_pads_top = 5;
        this.selected.control_pads_rows = 4;
        this.selected.control_pads_columns = 4;
        this.onChangeName();
      }
  }
	@Input()
	set selectedData(name: string) {
    this.selected = name;
    if (this.controllers!=undefined&&this.pads_names!=undefined  ){
      this.onChangeController();
    }
  }
	selected:any;
  selectedtemp:any;
  pads_names_show:any;
  pads_names:any;
  controllers:any;
  selectRowCol = [2, 3, 4, 6, 8, 12, 16, 32, 64]
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  @Output() changeController: EventEmitter<any> =   new EventEmitter();
  constructor(private fileService: FileService,
              private electronService:ElectronService,
              private midiControllerService:MidiControllerService,
              private controllerManagerComponent:ControllerManagerComponent) {
    this.pads_names = require('../../../services/controller-input-names/pads-names.json');
  }

  ngOnInit() {
  	this.midiControllerService.currentController
      .subscribe(controller => {
        this.controllers = controller;
        setTimeout(()=>{  
          if (this.controllers!=undefined&&this.pads_names!=undefined  ){
            this.onChangeController();
          }
        },10)
    });
  }

  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.selected));
  }

  onChangeName = (script_id?) => {
    if (this.selectedtemp!=this.selected && this.selected.name) {
    	if (this.selected.control_pads_rows!=undefined && this.selected.control_pads_columns!=undefined){
    		let total_pads = this.selected.control_pads_rows*this.selected.control_pads_columns;
    		// remove old child
    		var controllers = this.controllers.filter(s => s.parent_id!=this.selected.id)
    		let last = controllers[controllers.length-1];
    		let next_id = parseInt(last.id)+1;
    		let val:any = JSON.parse(JSON.stringify(this.selected.type));
    		val.type = "Pad";
    		for (let i=0; i<total_pads;i++){
    			let mode:any = new Mode;
    			mode.id = next_id;
    			mode.name = val.type +" "+(i+1); 
			    mode.type = val;
			    mode.parent_id = this.selected.id;
			    mode.level = this.selected.level+1;
			    mode.icon = val.icon;
          mode.MIDI_type = "CC";
          mode.MIDI_channel = 1;
          mode.MIDI_value = 0;
          mode.control_type = "On/Off";
			    controllers.push(mode);
    			next_id++;
    		}    	
    		this.selected.has_child=1;
      	this.changeController.emit(controllers);
    	}

      this.changeSelected.emit(this.selected);
    }
  }

}
