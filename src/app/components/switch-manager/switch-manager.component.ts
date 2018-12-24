import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-switch-manager',
  templateUrl: './switch-manager.component.html',
  styleUrls: ['./switch-manager.component.scss']
})
export class SwitchManagerComponent implements OnInit {
  @Input() selected;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();

  constructor() { 
  }

  ngOnInit() {
  }

  changeSelection = (value) => {
  	this.selected = value;
  	this.changeSelected.emit(this.selected);
  }

}
