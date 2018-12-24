import { Component, OnInit ,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-script-session-box',
  templateUrl: './script-session-box.component.html',
  styleUrls: ['./script-session-box.component.scss']
})
export class ScriptSessionBoxComponent implements OnInit {
  @Input() 
  set selectedData(name){
    this.selected=name;
    if (this.selected.session_box_height==undefined){
      this.selected.session_box_height=2
      this.selected.session_box_width=4
      this.selected.session_box_clips=[];
      this.selected.session_box_scenes=[]
      this.selected.session_box_stops=[]
      this.selected.session_box_stop_all="";
    }
    this.onChangeWidthHeight();
  }
  @Input() selectControllerInput;
  @Input() selectControllerButtonInput;

  selected:any;
  selectSessBoxWidth = Array.from(new Array(128),(val,index)=>index+1);
  selectSessBoxHeight = Array.from(new Array(128),(val,index)=>index+1);
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  constructor() {
  }
  onChangeWidthHeight = () =>{
    for (var i = 0; i < this.selected.session_box_height; i++) {
      if (this.selected.session_box_clips[i]!= undefined){
        this.selected.session_box_clips[i].length = parseInt(this.selected.session_box_width)
      }
      else{
        this.selected.session_box_clips[i]= [];
        this.selected.session_box_clips[i].length = parseInt(this.selected.session_box_width)
      }
    }
    this.selected.session_box_clips.length = this.selected.session_box_height;
    this.onChangeName();  
  }

  onChangeName = () =>{
    this.changeSelected.emit(this.selected);
  }

  
  ngOnInit() {
  }

}
