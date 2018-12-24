import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-midi-keys',
  templateUrl: './midi-keys.component.html',
  styleUrls: ['./midi-keys.component.scss']
})
export class MidiKeysComponent implements OnInit {
  @Input()
  set selectedData(name: string) {
    this.selected = name;
  }
  @Input()
  set controllerKeys(name:string){
    this.keys = name;
  }
  @Input()
  set controller(name:string){
    this.controller_parent = name;
  }
  @Input() square_size:any;
  @Input() padding:any;
  @Output() clickKey: EventEmitter<string> = new EventEmitter();
  selected:any;
  keys:any;
  controller_parent:any;
  counter = Array;
  constructor() { }

  onClickKey = (key) =>{
    this.clickKey.emit(key)
  }

  ngOnInit() {
  }

}
