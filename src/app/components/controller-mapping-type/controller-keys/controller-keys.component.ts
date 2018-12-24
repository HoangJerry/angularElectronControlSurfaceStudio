import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ElectronService } from '../../../providers/electron.service'
import { FileService } from '../../../services/file.service'
import { MidiControllerService } from '../../../services/midi-controller.service';
import { Mode } from '../../../models/controller-mode.model';

@Component({
  selector: 'app-controller-keys',
  templateUrl: './controller-keys.component.html',
  styleUrls: ['./controller-keys.component.scss']
})
export class ControllerKeysComponent implements OnInit {
  onChangeController = () =>{
    this.keys_names_show = this.keys_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name==null){
        this.selected.name = this.keys_names_show[0].name;
        this.selected.control_keys_width = 25;
        this.selected.control_keys_height = 8;
        this.selected.control_keys_left = 2;
        this.selected.control_keys_top = 23;
        this.selected.control_keys_keys = 0;

        this.onChangeName();
      }
  }
  @Input()
    set selectedData(name: string) {
    this.selected = name;
    if (this.controllers!=undefined&&this.keys_names!=undefined  ){
      this.onChangeController();
    }
  }
  selected:any;
  selectedtemp:any;
  keys_names_show:any;
  keys_names:any;
  controllers:any;
  selectKeys = [{'name':'24','value':24,'id':0,'white_keys':14,'start_at':1},
                {'name':'25','value':25,'id':1,'white_keys':15,'start_at':1},
                {'name':'32(1)','value':32,'id':2,'white_keys':19,'start_at':1},
                {'name':'32(2)','value':32,'id':3,'white_keys':19,'start_at':6},
                {'name':'37','value':37,'id':4,'white_keys':22,'start_at':1},
                {'name':'49','value':49,'id':5,'white_keys':29,'start_at':1},
                {'name':'61','value':61,'id':6,'white_keys':36,'start_at':1},
                {'name':'73','value':73,'id':7,'white_keys':43,'start_at':5},
                {'name':'88','value':88,'id':8,'white_keys':52,'start_at':10}]
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  @Output() changeController: EventEmitter<any> =   new EventEmitter();

  constructor(private fileService: FileService,
              private electronService:ElectronService,
              private midiControllerService:MidiControllerService) {
          this.keys_names = require('../../../services/controller-input-names/keys-names.json');
      }

  ngOnInit() {
    this.midiControllerService.currentController
      .subscribe(controller => {
        this.controllers = controller;
        setTimeout(()=>{
          if (this.controllers!=undefined&&this.keys_names!=undefined  ){
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
        if (this.selected.control_keys_keys!=undefined){
            this.selected.control_keys_object=this.selectKeys.filter(s=>s.id==this.selected.control_keys_keys)[0]
            let total_keys = this.selected.control_keys_object.value;
            // remove old child
            var controllers = this.controllers.filter(s => s.parent_id!=this.selected.id)
            let last = controllers[controllers.length-1];
            let next_id = parseInt(last.id)+1;
            let val:any = JSON.parse(JSON.stringify(this.selected.type));
            val.type = "Key";
            let children = [];
            for (let i=0; i<total_keys;i++){
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
                children.push(mode);
                next_id++;
            }
            let white_key_no =1;
            for (let i=0; i<total_keys;i++){
              let tempi = i+ this.selected.control_keys_object.start_at;
              if (tempi%12==1||tempi%12==3||tempi%12==5||
                  tempi%12==6||tempi%12==8||tempi%12==10||tempi%12==0){
                children[i].white_key_no = white_key_no;
                white_key_no++;
              }
            }
            
            for (let i=0; i<total_keys;i++){
              let j=0;
              for (j=i+1;j<total_keys;j++){
                let temp = j+this.selected.control_keys_object.start_at
                if (temp%12==1||temp%12==3||temp%12==5||
                    temp%12==6||temp%12==8||temp%12==10||temp%12==0){
                  break;
                }
              }
              if (j<total_keys){
                children[i].next_white = JSON.parse(JSON.stringify(children[j]));   
              }
            }  
          controllers = controllers.concat(children);
          this.selected.has_child=1;
          this.changeController.emit(controllers);
        }
      this.changeSelected.emit(this.selected);
    }
  }

}
