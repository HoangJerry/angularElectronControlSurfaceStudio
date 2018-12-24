import { Component, OnInit,  Input, Output, EventEmitter } from '@angular/core';

import { ElectronService } from '../../../providers/electron.service'
import { FileService } from '../../../services/file.service'
import { MidiControllerService } from '../../../services/midi-controller.service';

@Component({
  selector: 'app-controller-container',
  templateUrl: './controller-container.component.html',
  styleUrls: ['./controller-container.component.scss']
})
export class ControllerContainerComponent implements OnInit {
	 onChangeController = () =>{
    this.container_names_show = this.container_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name==null){
        this.selected.name = this.container_names_show[0].name;
        this.selected.control_container_width = 20;
        this.selected.control_container_height = 20;
        this.selected.control_container_left = 2;
        this.selected.control_container_top = 2;
        this.onChangeName();
      }
  }
 	container_names:any;
 	container_names_show:any;
 	controllers:any;
 	selected:any;
  selectedtemp:any;
 	@Input() 
  set selectedData(name: string) {
    this.selected = name;
    if (this.controllers!=undefined&&this.container_names!=undefined  ){
      this.onChangeController();
    }
  }
  @Output() changeSelected: EventEmitter<string> = new EventEmitter();

  constructor(private fileService: FileService, private electronService:ElectronService,
              private midiControllerService:MidiControllerService) {
    this.container_names = require('../../../services/controller-input-names/container-names.json');
    if (this.controllers!=undefined&&this.container_names!=undefined  ){
      this.onChangeController();
    }
  }

  ngOnInit() {
    this.midiControllerService.currentController
      .subscribe(controller => {
        this.controllers = controller;
        setTimeout(()=>{
          if (this.controllers!=undefined&&this.container_names!=undefined  ){
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
      this.changeSelected.emit(this.selected);
    }
  }

}
