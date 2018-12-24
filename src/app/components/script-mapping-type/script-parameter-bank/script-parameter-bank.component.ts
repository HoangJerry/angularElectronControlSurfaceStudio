import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MidiControllerService } from '../../../services/midi-controller.service';
import { Mode } from '../../../models/script-mode.model';

@Component({
  selector: 'app-script-parameter-bank',
  templateUrl: './script-parameter-bank.component.html',
  styleUrls: ['./script-parameter-bank.component.scss']
})
export class ScriptParameterBankComponent implements OnInit {
	@Input() 
  set selectedData(name){
    this.selected=name;
  }
  selected:any;
  scripts:any;
  selectParameters = Array.from(new Array(128),(val,index)=>index+1);
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  @Output() changeScript: EventEmitter<string> =   new EventEmitter();
  constructor(private midiControllerService:MidiControllerService) { }

  ngOnInit() {
    this.midiControllerService.currentScript
      .subscribe(script => {
        this.scripts = script;
    });
  }

  onChangeName = () =>{
  	if (this.selected.parameters!=undefined&&this.scripts!=undefined){
  		let scripts = this.scripts.filter(s=>s.parent_id!=this.selected.id)
  		let parameters = this.scripts.filter(s=>s.parent_id==this.selected.id)
  		let last = this.scripts[this.scripts.length-1];
      let next_id = parseInt(last.id)+1;
      let val:any = JSON.parse(JSON.stringify(this.selected.type));
      if (this.selected.type.type=="Parameter Bank"){
        val.type = "Parameter"
      }
      else{
        val.type = this.selected.type.type.slice(0,this.selected.type.type.length-1);
      }
      parameters.length = this.selected.parameters;
     	let i=0;
     	for (let parameter of parameters){
     		if (parameter==null||parameter==undefined){
     			parameter = new Mode;
          parameter.id = next_id;
          parameter.type = val;
          parameter.parent_id = this.selected.id;
          parameter.level = this.selected.level+1;
          parameter.select_parameter_by = "number";
          parameter.snap_to = "True";
          next_id++;
     		}
        parameter.name = val.type +" "+(i+1); 
     		parameters[i]=parameter;
     		i++;
     	}
      scripts = scripts.concat(parameters);
      this.changeScript.emit(scripts)
      this.selected.has_child=-1;
  	}
  	
    this.changeSelected.emit(this.selected);
  }

}
