import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

var $ = require('jquery');
@Component({
  selector: 'app-script-parameter',
  templateUrl: './script-parameter.component.html',
  styleUrls: ['./script-parameter.component.scss']
})
export class ScriptParameterComponent implements OnInit {
	@Input() 
  set selectedData(name){
    this.selected=name;
    this.onClickInput();
    if(this.selected.minimum==undefined){
      if (this.selected.type.type=='Parameter'){
        this.selected.minimum = 0;
        this.selected.maximum = 127;
      }
      else{
        this.selected.minimum = -70;
        this.selected.maximum = 0;
      }
      this.onChangeName()
    }
  }
  dbclick:any;
  selected:any;
  selectedtemp:any;
  selectParameterBy = ['number']
	selectOnOff = [{
    "value": "True",
    "display": "On"
    }, {
    "value": "False",
    "display": "Off"
  }];
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  dbClickEvent = ($event) => {
    $(event.target).siblings().last().click();
  }

  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.selected));
  }

  onChangeName = () =>{
    if(this.selectedtemp!=this.selected){
      this.changeSelected.emit(this.selected);
    }
  }

}
