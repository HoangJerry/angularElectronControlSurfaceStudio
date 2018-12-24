import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-script-drumrack',
  templateUrl: './script-drumrack.component.html',
  styleUrls: ['./script-drumrack.component.scss']
})
export class ScriptDrumrackComponent implements OnInit { 
  @Input() 
  set selectedData(name){
    this.selected=name;
    if (this.selected.drumrack==undefined){
    	this.selected.drumrack=[]
    	this.onChangeName();
    }
  }
  selected:any;
  @Input() selectControllerButtonInput;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }


  onChangeName = () =>{
      this.changeSelected.emit(this.selected);
  }

}
