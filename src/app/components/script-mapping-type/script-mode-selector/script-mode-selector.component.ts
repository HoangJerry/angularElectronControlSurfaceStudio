import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { MidiControllerService } from '../../../services/midi-controller.service';

@Component({
  selector: 'app-script-mode-selector',
  templateUrl: './script-mode-selector.component.html',
  styleUrls: ['./script-mode-selector.component.scss']
})
export class ScriptModeSelectorComponent implements OnInit {
	@Input() 
  set selectedData(name){
    this.selected=name;
    if(this.selected.mode_select_type==undefined){
      this.selected.mode_select_type=this.selectModeType[0];
    }
  }
  selected:any;
  selectModeType = ["Scroll", "Select Mode"]
  scripts:any;

  constructor(private midiControllerService:MidiControllerService) { }
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();

  ngOnInit() {
  	this.midiControllerService.currentScript
      .subscribe(script => {
        this.scripts = [{"id":"Previous Mode","name":"Previous Mode"}].concat(script.filter(s=>{if(s!=null){return s.type.type=="Mode"}}));
    });
  }


  onChangeName = () =>{
      if (this.selected.mode_select_type=="Select Mode"&&this.selected.func_arg==undefined){
        this.selected.func_arg=this.scripts[0];
      }
      this.changeSelected.emit(this.selected);
  }

}
