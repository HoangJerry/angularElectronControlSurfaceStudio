import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FileService } from '../../../services/file.service'
import { ElectronService } from '../../../providers/electron.service'
import { MidiControllerService } from '../../../services/midi-controller.service';

@Component({
  selector: 'app-controller-crossfader',
  templateUrl: './controller-crossfader.component.html',
  styleUrls: ['./controller-crossfader.component.scss']
})
export class ControllerCrossfaderComponent implements OnInit {
	 onChangeController = () =>{
    this.crossfader_names_show = this.crossfader_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name==null){
        this.selected.name = this.crossfader_names_show[0].name;
        this.selected.width = 16;
        this.selected.height = 2;
        this.selected.top = 8;
        this.selected.left = 4;
        this.onChangeName();
      }
  }
 	crossfader_names:any;
 	crossfader_names_show:any;
 	controllers:any;
 	selected:any;
  selectedtemp:any;

 	@Input() 
  	set selectedData(name: string) {
    this.selected = name;
    if (this.controllers!=undefined&&this.crossfader_names!=undefined  ){
      this.onChangeController();
    }
  }
  @Output() changeSelected: EventEmitter<string> = new EventEmitter();

  constructor(private fileService: FileService, private electronService:ElectronService,
              private midiControllerService:MidiControllerService) {
    this.crossfader_names = require('../../../services/controller-input-names/crossfader-names.json');
    if (this.controllers!=undefined&&this.crossfader_names!=undefined  ){
      this.onChangeController();
    }
  }

  ngOnInit() {
    this.midiControllerService.currentController
      .subscribe(controller => {
        this.controllers = controller;
        setTimeout(()=>{
          if (this.controllers!=undefined&&this.crossfader_names!=undefined  ){
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

